import { useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutGrid, Zap, Brain, FileQuestion, Syringe,
  Volume2, VolumeX, RotateCcw, Timer, Trophy,
} from "lucide-react";
import TabNavigation from "@/components/TabNavigation";
import { FadeIn, ScaleIn } from "@/components/animations";
import { useSpeech } from "@/hooks/useSpeech";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { getTopicById } from "@/data/topics";
import { getScenarioByTopicId, RoomItem, SimulationStep } from "@/data/simulationScenarios";
import { FloatingPoints, ScenePhase, SimulationScene } from "@/components/simulation/SimulationScene";

interface SimState {
  phase: ScenePhase;
  stepIndex: number;
  score: number;
  attemptsThisStep: number;
  firstTrySteps: number;
  hintShown: boolean;
  pickedItemIds: string[];
  shake: { itemId: string; key: number } | null;
  floatingPoints: FloatingPoints | null;
  timedOut: boolean;
}

type SimAction =
  | { type: "SPEAK_STEP"; index: number }
  | { type: "SPEECH_END"; kind: SimulationStep["kind"] }
  | { type: "SHOW_HINT" }
  | { type: "WRONG_PICK"; itemId: string }
  | { type: "CORRECT_PICK"; itemId: string; points: number; x: number; y: number; firstTry: boolean }
  | { type: "INJECT" }
  | { type: "INJECT_DONE"; points: number; x: number; y: number }
  | { type: "COMPLETE"; timedOut?: boolean }
  | { type: "RESET" };

const initialState: SimState = {
  phase: "intro",
  stepIndex: 0,
  score: 0,
  attemptsThisStep: 0,
  firstTrySteps: 0,
  hintShown: false,
  pickedItemIds: [],
  shake: null,
  floatingPoints: null,
  timedOut: false,
};

const reducer = (state: SimState, action: SimAction): SimState => {
  switch (action.type) {
    case "SPEAK_STEP":
      return {
        ...state,
        phase: "speaking",
        stepIndex: action.index,
        attemptsThisStep: 0,
        hintShown: false,
        shake: null,
        floatingPoints: null,
      };
    case "SPEECH_END":
      return {
        ...state,
        phase: action.kind === "inject" ? "awaitingInject" : "awaitingPick",
      };
    case "SHOW_HINT":
      return state.phase === "awaitingPick" ? { ...state, hintShown: true } : state;
    case "WRONG_PICK":
      return {
        ...state,
        attemptsThisStep: state.attemptsThisStep + 1,
        shake: { itemId: action.itemId, key: (state.shake?.key ?? 0) + 1 },
      };
    case "CORRECT_PICK":
      return {
        ...state,
        score: state.score + action.points,
        firstTrySteps: state.firstTrySteps + (action.firstTry ? 1 : 0),
        pickedItemIds: [...state.pickedItemIds, action.itemId],
        floatingPoints: { x: action.x, y: action.y, value: action.points, key: state.stepIndex },
        hintShown: false,
      };
    case "INJECT":
      return { ...state, phase: "injecting" };
    case "INJECT_DONE":
      return {
        ...state,
        score: state.score + action.points,
        firstTrySteps: state.firstTrySteps + 1,
        floatingPoints: { x: action.x, y: action.y, value: action.points, key: -1 },
      };
    case "COMPLETE":
      return { ...state, phase: "complete", timedOut: action.timedOut ?? false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const formatTime = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

const PracticalSimulation = () => {
  const { topicId = "" } = useParams();
  const topic = getTopicById(topicId);
  const scenario = getScenarioByTopicId(topicId);
  const user = useAuthStore((s) => s.user);
  const recordResult = useProgressStore((s) => s.recordResult);
  const { supported, muted, toggleMute, speak, cancel } = useSpeech();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [remainingSec, setRemainingSec] = useState(scenario?.timeLimitSec ?? 600);

  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRecordedRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearTimers = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    hintTimerRef.current = null;
    advanceTimerRef.current = null;
    intervalRef.current = null;
  };

  useEffect(() => clearTimers, []);

  const steps = scenario?.steps ?? [];
  const scoringSteps = steps.filter((s) => s.points > 0);
  const maxScore = scoringSteps.reduce((sum, s) => sum + s.points, 0);
  const currentStep = steps[state.stepIndex];

  const recordOnce = () => {
    if (hasRecordedRef.current) return;
    hasRecordedRef.current = true;
    if (user?.id) {
      recordResult(user.id, topicId, stateRef.current.firstTrySteps, scoringSteps.length);
    }
  };

  const finishStation = (timedOut = false) => {
    clearTimers();
    cancel();
    dispatch({ type: "COMPLETE", timedOut });
    recordOnce();
  };

  const speakStep = (index: number) => {
    const step = steps[index];
    if (!step) {
      finishStation();
      return;
    }
    dispatch({ type: "SPEAK_STEP", index });
    speak(step.invigilatorLine, () => {
      if (step.kind === "listen") {
        speakStep(index + 1);
        return;
      }
      dispatch({ type: "SPEECH_END", kind: step.kind });
      if (step.kind === "pick") {
        hintTimerRef.current = setTimeout(
          () => dispatch({ type: "SHOW_HINT" }),
          step.hintDelayMs ?? 2500,
        );
      }
    });
  };

  const handleStart = () => {
    hasRecordedRef.current = false;
    setRemainingSec(scenario?.timeLimitSec ?? 600);
    intervalRef.current = setInterval(() => {
      setRemainingSec((sec) => {
        if (sec <= 1) {
          toast.error("Time's up — the station has ended.");
          finishStation(true);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    speakStep(0);
  };

  const handlePickItem = (item: RoomItem) => {
    if (state.phase === "speaking") {
      toast("Listen to the invigilator first");
      return;
    }
    if (state.phase !== "awaitingPick" || !currentStep) return;
    const correct = currentStep.correctItemIds?.includes(item.id);
    if (!correct) {
      dispatch({ type: "WRONG_PICK", itemId: item.id });
      toast.error(
        currentStep.wrongFeedback?.[item.id] ??
          currentStep.defaultWrongFeedback ??
          "Not quite — try again.",
      );
      return;
    }
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    dispatch({
      type: "CORRECT_PICK",
      itemId: item.id,
      points: currentStep.points,
      x: item.position.x,
      y: item.position.y,
      firstTry: state.attemptsThisStep === 0,
    });
    toast.success(currentStep.successLine ?? "Correct!");
    advanceTimerRef.current = setTimeout(() => speakStep(state.stepIndex + 1), 700);
  };

  const handleInject = () => {
    if (state.phase !== "awaitingInject") return;
    dispatch({ type: "INJECT" });
  };

  const handleInjectDone = () => {
    if (!currentStep || !scenario) return;
    dispatch({
      type: "INJECT_DONE",
      points: currentStep.points,
      x: scenario.injectionSite.x,
      y: scenario.injectionSite.y,
    });
    toast.success("Injection administered safely!");
    if (currentStep.successLine) speak(currentStep.successLine);
    advanceTimerRef.current = setTimeout(() => finishStation(), 1800);
  };

  const handleRetry = () => {
    clearTimers();
    cancel();
    hasRecordedRef.current = false;
    setRemainingSec(scenario?.timeLimitSec ?? 600);
    dispatch({ type: "RESET" });
  };

  const handleReplay = () => {
    if (!currentStep || state.phase === "intro" || state.phase === "complete") return;
    speak(currentStep.invigilatorLine);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid, path: `/screens/practical/${topicId}/overview` },
    { id: "steps", label: "Steps", icon: Zap, path: `/screens/practical/${topicId}/steps` },
    { id: "cards", label: "Cards", icon: Brain, path: `/screens/practical/${topicId}/cards` },
    { id: "quiz", label: "Quiz", icon: FileQuestion, path: `/screens/practical/${topicId}/quiz` },
    { id: "sim", label: "Sim", icon: Syringe, path: `/screens/practical/${topicId}/simulation` },
  ];

  if (!scenario) {
    return (
      <div className="min-h-screen bg-[#eef0f7] dark:bg-slate-950">
        <TabNavigation tabs={tabs} />
        <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
          <h1 className="text-[26px] font-extrabold text-gray-900 dark:text-white">Station Simulation</h1>
          <p className="text-gray-500 text-[14px] mt-0.5 mb-6">{topic?.label ?? topicId}</p>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-300">Simulation coming soon for this station</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef0f7] dark:bg-slate-950">
      <TabNavigation tabs={tabs} />
      <div className="px-5 pt-6 pb-24 max-w-md mx-auto">
        <FadeIn direction="down" delay={0.05}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-extrabold text-gray-900 dark:text-white leading-tight">
                {scenario.title}
              </h1>
              <p className="text-gray-500 text-[13px] mt-0.5">{topic?.label} · OSCE Simulation</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleReplay}
                aria-label="Replay instruction"
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute invigilator" : "Mute invigilator"}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                {muted || !supported ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Score + timer */}
        <FadeIn delay={0.1}>
          <div className="flex items-center gap-2 mt-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rcsi-navy text-white text-[13px] font-bold px-3 py-1.5">
              <Trophy size={14} /> {state.score} / {maxScore}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[13px] font-bold text-gray-700 dark:text-gray-200 px-3 py-1.5">
              <Timer size={14} /> {formatTime(remainingSec)}
            </span>
          </div>
        </FadeIn>

        {state.phase === "intro" && (
          <ScaleIn>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
              <div className="text-xs font-bold text-rcsi-navy dark:text-rcsi-green uppercase tracking-wide mb-2">
                Station Brief
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{scenario.situation}</p>
              <p className="text-xs text-gray-400 mt-3">
                {supported
                  ? "The invigilator will speak — turn your sound on."
                  : "Voice is not supported in this browser — instructions will show as text."}
              </p>
              <button
                type="button"
                onClick={handleStart}
                className="mt-4 w-full rounded-full bg-rcsi-navy text-white font-bold py-3 active:scale-[0.98] transition-transform"
              >
                Start Station
              </button>
            </div>
          </ScaleIn>
        )}

        {state.phase !== "intro" && state.phase !== "complete" && (
          <>
            {/* Invigilator bubble */}
            <div className="flex items-start gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-rcsi-navy text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                INV
              </div>
              <div className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                <p className="text-[13px] text-gray-700 dark:text-gray-200 leading-relaxed">
                  {currentStep?.invigilatorLine}
                </p>
                {state.phase === "speaking" && (
                  <span className="text-[10px] font-semibold text-rcsi-green">Speaking…</span>
                )}
              </div>
            </div>

            <SimulationScene
              scenario={scenario}
              phase={state.phase}
              correctItemIds={currentStep?.correctItemIds ?? []}
              hintShown={state.hintShown}
              pickedItemIds={state.pickedItemIds}
              shake={state.shake}
              floatingPoints={state.floatingPoints}
              onPickItem={handlePickItem}
              onInject={handleInject}
              onInjectDone={handleInjectDone}
            />
          </>
        )}

        {state.phase === "complete" && (
          <ScaleIn>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-rcsi-mint/50 dark:bg-slate-700 flex items-center justify-center mb-3">
                <Trophy className="text-rcsi-navy dark:text-rcsi-green" size={30} />
              </div>
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                {state.timedOut ? "Time's Up" : "Station Complete"}
              </h2>
              <p className="text-3xl font-extrabold text-rcsi-navy dark:text-rcsi-green mt-2">
                {state.score} / {maxScore}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {state.firstTrySteps} of {scoringSteps.length} steps correct on the first try
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 w-full rounded-full bg-rcsi-navy text-white font-bold py-3 active:scale-[0.98] transition-transform"
              >
                Retry Station
              </button>
            </div>
          </ScaleIn>
        )}
      </div>
    </div>
  );
};

export default PracticalSimulation;
