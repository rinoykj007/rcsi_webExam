import { useState } from "react";
import { useParams } from "react-router-dom";
import TabNavigation from "@/components/TabNavigation";
import {
  LayoutGrid,
  Zap,
  Brain,
  FileQuestion,
  GitCompare,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { PageEnter, FadeIn } from "@/components/animations";
import { getPracticalContent } from "@/data/practicalContent";

const PracticalQuiz = () => {
  const { topicId = "" } = useParams();
  const content = getPracticalContent(topicId);
  const questions = content?.quiz ?? [];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid, path: `/screens/practical/${topicId}/overview` },
    { id: "steps", label: "Steps", icon: Zap, path: `/screens/practical/${topicId}/steps` },
    { id: "cards", label: "Cards", icon: Brain, path: `/screens/practical/${topicId}/cards` },
    { id: "quiz", label: "Quiz", icon: FileQuestion, path: `/screens/practical/${topicId}/quiz` },
    { id: "compare", label: "Compare", icon: GitCompare, path: `/screens/practical/${topicId}/compare` },
  ];

  const question = questions[current];
  const answered = selected !== null;

  const handleSelect = (key: string) => {
    if (answered || !question) return;
    setSelected(key);
    if (key === question.correct) {
      setScore((s) => s + 1);
      toast.success("Correct!");
    } else {
      toast.error(`Not quite — the answer is ${question.correct}`);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const optionClasses = (key: string) => {
    const base =
      "w-full flex items-start gap-3 text-left rounded-xl border p-3 sm:p-4 transition text-sm sm:text-base";
    if (!answered) {
      return `${base} bg-card border-border hover:border-rcsi-navy/40 hover:shadow-md cursor-pointer`;
    }
    if (key === question.correct) {
      return `${base} bg-green-50 border-green-400 text-green-900`;
    }
    if (key === selected) {
      return `${base} bg-red-50 border-red-400 text-red-900`;
    }
    return `${base} bg-card border-border opacity-60`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TabNavigation tabs={tabs} />
      <PageEnter>
        <div className="mx-auto w-full max-w-2xl px-3 sm:px-5 py-2 sm:py-4 md:py-6">
          <FadeIn direction="down" delay={0.1}>
            <div className="mb-3 sm:mb-4">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-rcsi-navy mb-1">
                Station Quiz
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Scenario-based questions to test what the examiner will test
              </p>
            </div>
          </FadeIn>

          {questions.length === 0 ? (
            <div className="bg-card rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-soft border border-border">
              <p className="text-muted-foreground text-sm">
                Quiz questions for this station are coming soon
              </p>
            </div>
          ) : finished ? (
            <FadeIn>
              <div className="bg-card rounded-2xl p-6 sm:p-8 text-center shadow-soft border border-border">
                <div className="text-5xl mb-3">
                  {score === questions.length ? "🏆" : score >= questions.length / 2 ? "🎉" : "📖"}
                </div>
                <h2 className="font-display font-bold text-rcsi-navy text-xl sm:text-2xl mb-1">
                  You scored {score} / {questions.length}
                </h2>
                <p className="text-muted-foreground text-sm mb-5">
                  {score === questions.length
                    ? "Perfect — you're exam ready for this station."
                    : score >= questions.length / 2
                      ? "Good work — review the ones you missed and go again."
                      : "Revisit the steps and checklist, then try again."}
                </p>
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rcsi-navy text-white text-sm font-semibold shadow-soft hover:shadow-md transition"
                >
                  <RotateCcw size={16} strokeWidth={2} /> Try Again
                </button>
              </div>
            </FadeIn>
          ) : (
            <>
              {/* Progress */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground tracking-wide">
                  QUESTION {current + 1} OF {questions.length}
                </span>
                <span className="text-xs font-bold text-rcsi-navy bg-blue-50 px-2.5 py-1 rounded-full">
                  {question.tag}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-rcsi-navy rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>

              <FadeIn key={question.id}>
                <div className="bg-card rounded-2xl p-4 sm:p-5 shadow-soft border border-border mb-3">
                  <h2 className="font-display font-bold text-rcsi-navy text-base sm:text-lg leading-snug">
                    {question.question}
                  </h2>
                </div>

                <div className="space-y-2">
                  {question.options.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelect(opt.key)}
                      disabled={answered}
                      className={optionClasses(opt.key)}
                    >
                      <span className="font-bold flex-shrink-0">{opt.key}.</span>
                      <span className="flex-1">{opt.text}</span>
                      {answered && opt.key === question.correct && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
                      )}
                      {answered && opt.key === selected && opt.key !== question.correct && (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" strokeWidth={2} />
                      )}
                    </button>
                  ))}
                </div>

                {answered && (
                  <FadeIn>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mt-3">
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">
                        Explanation
                      </p>
                      <p className="text-blue-900 text-xs sm:text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 mt-4 px-5 py-3 rounded-xl bg-rcsi-navy text-white text-sm font-semibold shadow-soft hover:shadow-md transition"
                    >
                      {current + 1 >= questions.length ? "See Results" : "Next Question"}
                      <ArrowRight size={16} strokeWidth={2} />
                    </button>
                  </FadeIn>
                )}
              </FadeIn>
            </>
          )}
        </div>
      </PageEnter>
    </div>
  );
};

export default PracticalQuiz;
