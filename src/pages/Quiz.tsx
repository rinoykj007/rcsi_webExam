import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getTopicById } from "@/data/topics";
import { fetchAllQuestions, fetchQuestions } from "@/lib/data";
import type { Question } from "@/data/questions";
import { formatTime, shuffle } from "@/lib/quiz";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useRewardsStore } from "@/stores/useRewardsStore";

const Quiz = () => {
  const { topicId = "" } = useParams();
  const [params] = useSearchParams();
  const mode = params.get("mode"); // "exam" | "practice" | null
  const isMock = topicId === "mock";
  const isExam = mode === "exam" || (isMock && mode !== "practice");
  const nav = useNavigate();
  const topic = isMock ? null : getTopicById(topicId);
  const { user } = useAuthStore();
  const { recordResult } = useProgressStore();
  const { addPoints, awardBadge, hasBadge, load: loadRewards, loaded: rewardsLoaded } = useRewardsStore();

  const examDuration = isMock ? 30 * 60 : 10 * 60; // 30 min mock, 10 min topic exam

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    const loader = isMock ? fetchAllQuestions(245) : fetchQuestions(topicId);
    loader.then((qs) => {
      if (!active) return;
      setQuestions(shuffle(qs));
      setLoading(false);
    });
    return () => { active = false; };
  }, [topicId, isMock]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; topicId: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const recordedRef = useRef(false);

  const retry = () => {
    setQuestions((qs) => shuffle(qs));
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setTimeLeft(examDuration);
    setFinished(false);
    setStartTime(Date.now());
    recordedRef.current = false;
  };

  // exam timer
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimeLeft((s) => {
      if (s <= 1) { setFinished(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [isExam, finished]);

  // Load rewards once the user is known
  useEffect(() => {
    if (user?.id && !rewardsLoaded) loadRewards(user.id);
  }, [user?.id, rewardsLoaded, loadRewards]);

  // record + gamification + navigate to results when finishing
  useEffect(() => {
    if (!finished || recordedRef.current) return;
    recordedRef.current = true;
    const total = questions.length;
    const correctCount = answers.filter((a) => a.correct).length;
    const incorrectCount = answers.filter((a) => !a.correct).length;
    const unansweredCount = total - answers.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    const passMarkPct = 65;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    if (user?.id) {
      const grouped: Record<string, { correct: number; total: number }> = {};
      answers.forEach((a) => {
        const g = grouped[a.topicId] ?? { correct: 0, total: 0 };
        g.total += 1;
        if (a.correct) g.correct += 1;
        grouped[a.topicId] = g;
      });
      Object.entries(grouped).forEach(([tid, g]) => recordResult(user.id, tid, g.correct, g.total));
      if (correctCount > 0) addPoints(user.id, correctCount * 10);
      if (!hasBadge("first_quiz")) awardBadge(user.id, "first_quiz");
      if (isMock && !hasBadge("mock_exam")) awardBadge(user.id, "mock_exam");
      if (pct === 100 && !hasBadge("perfect_score")) awardBadge(user.id, "perfect_score");
      if (!isMock && topicId && pct >= 80) {
        const badgeMap: Record<string, string> = {
          infection_control: "score_infection",
          fundamentals: "score_fundamentals",
          isbar: "score_isbar",
          acute_management: "score_acute",
          sepsis: "score_sepsis",
        };
        const bid = badgeMap[topicId];
        if (bid && !hasBadge(bid)) awardBadge(user.id, bid);
      }
    }

    // Build domain breakdown from grouped answers
    const domainGrouped: Record<string, { correct: number; total: number }> = {};
    answers.forEach((a) => {
      const g = domainGrouped[a.topicId] ?? { correct: 0, total: 0 };
      g.total += 1;
      if (a.correct) g.correct += 1;
      domainGrouped[a.topicId] = g;
    });
    const domains = Object.entries(domainGrouped).map(([tid, g]) => ({
      name: getTopicById(tid)?.label ?? tid,
      correct: g.correct,
      total: g.total,
      passMarkPct,
    }));

    // Format duration
    const hrs = Math.floor(timeSpent / 3600);
    const mins = Math.floor((timeSpent % 3600) / 60);
    const duration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

    // Format submitted date
    const submittedDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });

    // Per-question result grid
    const questionResults = questions.map((_, i) => ({
      number: i + 1,
      status: i >= answers.length ? "skipped" : answers[i].correct ? "correct" : "incorrect",
    }));

    nav("/exam-results", {
      state: {
        total,
        correct: correctCount,
        incorrect: incorrectCount,
        unanswered: unansweredCount,
        percentage: pct,
        passMarkPct,
        passed: pct >= passMarkPct,
        duration,
        submittedDate,
        domains,
        questions: questionResults,
      },
    });
  }, [finished, answers, questions, user?.id, recordResult, addPoints, awardBadge, hasBadge, isMock, topicId, startTime, nav]);

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-rcsi-purple border-t-transparent animate-spin" />
      </div>
    );
  }
  const q = questions[idx];
  const accent = topic?.dotColor ?? getTopicById(q.topicId)?.dotColor ?? "#7c6aef";
  const progress = ((idx + (revealed ? 1 : 0)) / questions.length) * 100;

  const onSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === q.correct;
    setAnswers((a) => [...a, { correct, topicId: q.topicId }]);
  };

  const next = () => {
    setSelected(null); setRevealed(false);
    if (idx + 1 >= questions.length) setFinished(true);
    else setIdx(idx + 1);
  };


  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => nav(-1)} className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-muted-foreground font-semibold tracking-widest">
              {isMock ? "MOCK EXAM" : `STATION ${topic?.station_id ?? ""}`}
            </div>
            <div className="font-display font-bold text-foreground truncate">
              {isMock ? "RCSI Simulated Exam" : topic?.label ?? ""}
            </div>
          </div>
          <div className={`text-sm font-bold tabular-nums px-3 py-1.5 rounded-full ${timeLeft < 120 ? "bg-destructive text-destructive-foreground" : "bg-card shadow-soft text-foreground"}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
          <div className="h-full bg-rcsi-green rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-card rounded-3xl p-6 shadow-card mb-4">
            <span className="inline-block text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-full text-white mb-4"
              style={{ background: accent }}>
              {q.tag.toUpperCase()}
            </span>
            {q.image_url && (
              <img
                src={q.image_url}
                alt="Question reference"
                loading="lazy"
                className="w-full max-h-80 object-contain rounded-2xl bg-muted mb-4"
              />
            )}
            <h2 className="font-display font-bold text-xl text-foreground leading-snug">{q.question}</h2>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isSelected = i === selected;
            let cls = "border-border bg-card hover:border-rcsi-purple hover:bg-rcsi-purple-soft/40";
            if (revealed) {
              cls = isSelected
                ? "border-rcsi-purple bg-rcsi-purple-soft/50"
                : "border-border bg-card opacity-60";
            } else if (isSelected) {
              cls = "border-rcsi-purple bg-rcsi-purple-soft/50";
            }
            return (
              <button key={i} onClick={() => onSelect(i)} disabled={revealed}
                className={`w-full text-left rounded-2xl border-2 p-4 transition flex items-center gap-3 ${cls}`}>
                <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center font-bold text-sm shrink-0">{opt.key}</div>
                <div className="flex-1 text-sm font-medium">{opt.text}</div>
              </button>
            );
          })}
        </div>

        {revealed && (
          <Button onClick={next} className="w-full mt-4 h-12 rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90 font-semibold">
            {idx + 1 >= questions.length ? "Finish" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
