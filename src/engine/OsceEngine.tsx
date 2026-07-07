import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/useSpeech";
import { getCategoryBySlug } from "@/data/osce/categories";
import { engineReducer, initialEngineState } from "./engineReducer";
import { resolvePlugin } from "./registry";
import { computeScore, DEFAULT_PASS_MARK_PCT } from "./scoring";
import type {
  OsceAttempt,
  OsceStation,
  OsceStep,
  StepCompletion,
} from "./types";
import type { ScoreSummaryConfig } from "./configs";

interface OsceEngineProps {
  station: OsceStation;
  onFinish: (attempt: OsceAttempt) => void;
}

const formatClock = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

/**
 * Generic station runner: sorts the station's steps, validates each config
 * against its plugin schema, and renders the current step via the plugin
 * registry. Steps with an unknown plugin key/version or an invalid config
 * are skipped (never crash on newer data). Fires onFinish exactly once per
 * run when the station completes or times out.
 */
export const OsceEngine = ({ station, onFinish }: OsceEngineProps) => {
  const speech = useSpeech();

  const steps = useMemo(() => {
    const sorted = [...station.steps].sort((a, b) => a.orderIndex - b.orderIndex);
    return sorted.filter((step) => {
      const plugin = resolvePlugin(step.pluginKey, step.pluginVersion);
      if (!plugin) {
        console.warn(
          `Skipping step ${step.id}: no plugin for ${step.pluginKey}@${step.pluginVersion}`,
        );
        return false;
      }
      const parsed = plugin.configSchema.safeParse(step.config);
      if (!parsed.success) {
        console.warn(`Skipping step ${step.id}: invalid config`, parsed.error);
        return false;
      }
      return true;
    });
  }, [station.steps]);

  const summaryIndex = useMemo(() => {
    const i = steps.findIndex((s) => s.pluginKey === "score.summary");
    return i === -1 ? steps.length - 1 : i;
  }, [steps]);

  const [state, dispatch] = useReducer(engineReducer, {
    ...initialEngineState,
    status: "running",
  });
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const startedAtRef = useRef(new Date().toISOString());
  const stepStartedAtRef = useRef(Date.now());
  const finishedRef = useRef(false);

  // Countdown: derives remaining time from the armed timer; dispatches
  // TIME_UP once at zero (reducer ignores it after completion).
  useEffect(() => {
    if (state.timerTotalSec === null || state.timerStartedAt === null) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - state.timerStartedAt!) / 1000);
      const left = Math.max(0, state.timerTotalSec! - elapsed);
      setRemainingSec(left);
      if (left === 0) dispatch({ type: "TIME_UP", summaryIndex });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [state.timerTotalSec, state.timerStartedAt, summaryIndex]);

  useEffect(() => {
    if (state.status === "timedOut") {
      speech.cancel();
      toast.error("Time is up!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  // Fire onFinish exactly once when the run ends.
  useEffect(() => {
    if (state.status !== "completed" && state.status !== "timedOut") return;
    if (finishedRef.current) return;
    finishedRef.current = true;
    const passMarkPct =
      (steps[summaryIndex]?.config as ScoreSummaryConfig | undefined)
        ?.passMarkPct ?? DEFAULT_PASS_MARK_PCT;
    onFinish({
      stationId: station.id,
      startedAt: startedAtRef.current,
      finishedAt: new Date().toISOString(),
      results: state.results,
      score: computeScore(state.results, {
        timedOut: state.status === "timedOut",
        passMarkPct,
      }),
    });
  }, [state.status, state.results, steps, summaryIndex, station.id, onFinish]);

  const currentStep: OsceStep | undefined =
    steps[Math.min(state.stepIndex, steps.length - 1)];

  const handleComplete = useCallback(
    (completion: StepCompletion) => {
      if (!currentStep) return;
      dispatch({
        type: "STEP_COMPLETE",
        result: {
          ...completion,
          stepId: currentStep.id,
          pluginKey: currentStep.pluginKey,
          skill: currentStep.skill,
          timeTakenSec: Math.round(
            (Date.now() - stepStartedAtRef.current) / 1000,
          ),
        },
        totalSteps: steps.length,
        summaryIndex,
      });
      stepStartedAtRef.current = Date.now();
    },
    [currentStep, steps.length, summaryIndex],
  );

  const handleArmTimer = useCallback((seconds: number) => {
    dispatch({ type: "ARM_TIMER", seconds });
  }, []);

  const handleRestart = useCallback(() => {
    finishedRef.current = false;
    startedAtRef.current = new Date().toISOString();
    stepStartedAtRef.current = Date.now();
    setRemainingSec(null);
    speech.cancel();
    dispatch({ type: "RESET" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentStep) return null;

  const plugin = resolvePlugin(currentStep.pluginKey, currentStep.pluginVersion)!;
  const StepComponent = plugin.Component;
  const category = getCategoryBySlug(station.category);
  const scoringSteps = steps.filter((s) => s.marksAvailable > 0).length;
  const doneScoring = state.results.filter((r) => r.marksAvailable > 0).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-lg font-semibold">{station.title}</h1>
        {category && <Badge variant="secondary">{category.label}</Badge>}
        {remainingSec !== null && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium tabular-nums",
              remainingSec <= 30
                ? "border-destructive/60 text-destructive"
                : "text-muted-foreground",
            )}
          >
            <Clock size={14} /> {formatClock(remainingSec)}
          </span>
        )}
      </div>
      <Progress
        value={scoringSteps === 0 ? 0 : (doneScoring / scoringSteps) * 100}
        className="h-1.5"
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep.id}-${state.status}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          <StepComponent
            step={currentStep}
            station={station}
            results={state.results}
            remainingSec={remainingSec}
            engineStatus={state.status}
            speech={speech}
            onComplete={handleComplete}
            onArmTimer={handleArmTimer}
            onRestart={handleRestart}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
