import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Check, X, RotateCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRewardsStore } from "@/stores/useRewardsStore";
import {
  ISBAR_COMPONENTS, CRITICAL_RULES, FULL_EXAMPLE, COMMON_MISTAKES,
  ISBAR_OSCE_STEPS, ISBAR_FLASHCARDS, ISBAR_QUIZ,
  PRACTICE_SCENARIOS, ISBAR_COMPARE_GOOD, ISBAR_COMPARE_POOR,
} from "@/data/isbarContent";

type Tab = "overview" | "steps" | "cards" | "quiz" | "practice" | "compare";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",  label: "Overview" },
  { id: "steps",     label: "OSCE Steps" },
  { id: "cards",     label: "Flashcards" },
  { id: "quiz",      label: "Quiz" },
  { id: "practice",  label: "Practice" },
  { id: "compare",   label: "Compare" },
];

// ── Overview ──────────────────────────────────────────────────────────────────
const OverviewTab = () => {
  const [expandedLetter, setExpandedLetter] = useState<string | null>("I");

  return (
    <div className="space-y-4">
      {/* ISBAR letter cards */}
      {ISBAR_COMPONENTS.map((comp) => (
        <div key={comp.letter} className="rounded-2xl overflow-hidden shadow-soft" style={{ border: `2px solid ${comp.color}20` }}>
          <button
            onClick={() => setExpandedLetter(expandedLetter === comp.letter ? null : comp.letter)}
            className="w-full flex items-center gap-4 px-5 py-4"
            style={{ background: comp.bg }}
          >
            <div className="h-11 w-11 rounded-xl grid place-items-center font-display font-extrabold text-xl text-white shrink-0"
              style={{ background: comp.color }}>
              {comp.letter}
            </div>
            <div className="text-left flex-1">
              <div className="font-display font-bold text-sm" style={{ color: comp.color }}>{comp.full}</div>
              <div className="text-xs text-gray-600">{comp.question}</div>
            </div>
          </button>

          <AnimatePresence>
            {expandedLetter === comp.letter && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                className="overflow-hidden bg-card px-5">
                <div className="py-4 space-y-3">
                  <ul className="space-y-1.5">
                    {comp.points.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <Check size={14} className="shrink-0 mt-0.5" style={{ color: comp.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-3 text-sm italic text-foreground/80" style={{ background: comp.bg }}>
                    {comp.example}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Full example */}
      <div className="bg-card rounded-2xl shadow-soft p-5">
        <h3 className="font-display font-bold text-rcsi-navy mb-2">Full Example</h3>
        <p className="text-sm text-muted-foreground mb-3 italic">{FULL_EXAMPLE.scenario}</p>
        <div className="space-y-2">
          {FULL_EXAMPLE.parts.map((p) => (
            <div key={p.letter} className="rounded-xl p-3 flex gap-3" style={{ background: p.bg }}>
              <span className="h-7 w-7 rounded-lg grid place-items-center font-display font-bold text-sm text-white shrink-0"
                style={{ background: p.color }}>{p.letter}</span>
              <p className="text-sm text-foreground/80 italic">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical rules */}
      <div className="bg-rcsi-navy rounded-2xl p-5">
        <h3 className="font-display font-bold text-white mb-3">Critical Rules</h3>
        <ul className="space-y-2">
          {CRITICAL_RULES.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/90">
              <span className="text-rcsi-mint shrink-0">✓</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Common mistakes */}
      <div className="bg-card rounded-2xl shadow-soft p-5">
        <h3 className="font-display font-bold text-rcsi-navy mb-3">Common OSCE Mistakes</h3>
        <div className="space-y-2.5">
          {COMMON_MISTAKES.map((m, i) => (
            <div key={i} className="rounded-xl bg-red-50 border border-red-100 p-3">
              <div className="flex gap-2 mb-1">
                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-sm text-red-700">{m.mistake}</span>
              </div>
              <p className="text-xs text-red-600 ml-5">{m.why}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── OSCE Steps ────────────────────────────────────────────────────────────────
const StepsTab = () => (
  <div className="space-y-3">
    {ISBAR_OSCE_STEPS.map((s, i) => (
      <motion.div key={s.id}
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
        className="bg-card rounded-2xl p-4 shadow-soft flex gap-4">
        <div className="h-9 w-9 rounded-xl bg-rcsi-navy text-primary-foreground grid place-items-center font-display font-bold text-sm shrink-0">{i + 1}</div>
        <div>
          <div className="font-display font-bold text-rcsi-navy text-sm">{s.title}</div>
          <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.detail}</div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ── Flashcards ────────────────────────────────────────────────────────────────
const FlashcardsTab = ({ onComplete }: { onComplete: () => void }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const card = ISBAR_FLASHCARDS[idx];

  const next = () => {
    setFlipped(false);
    setTimeout(() => {
      if (idx + 1 >= ISBAR_FLASHCARDS.length) { setDone(true); onComplete(); }
      else setIdx(idx + 1);
    }, 150);
  };

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display font-bold text-rcsi-navy text-xl mb-2">All cards reviewed!</h3>
        <p className="text-muted-foreground text-sm mb-6">You've completed all {ISBAR_FLASHCARDS.length} ISBAR flashcards.</p>
        <Button onClick={() => { setIdx(0); setDone(false); setFlipped(false); }} variant="outline" className="rounded-full gap-2">
          <RotateCw size={16} /> Restart
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground px-1">
        <span className="font-semibold text-xs px-2.5 py-1 rounded-full text-white" style={{ background: card.categoryColor }}>{card.category}</span>
        <span>{idx + 1} / {ISBAR_FLASHCARDS.length}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-rcsi-navy rounded-full transition-all" style={{ width: `${((idx + 1) / ISBAR_FLASHCARDS.length) * 100}%` }} />
      </div>

      <div className="cursor-pointer select-none" style={{ perspective: "800px" }} onClick={() => setFlipped((f) => !f)}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.4 }}
          style={{ transformStyle: "preserve-3d", position: "relative", minHeight: "200px" }}>
          <div className="absolute inset-0 rounded-3xl p-6 shadow-card flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden", background: card.categoryBg, border: `2px solid ${card.categoryColor}20` }}>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white w-fit" style={{ background: card.categoryColor }}>
              {card.category}
            </span>
            <p className="font-display font-bold text-rcsi-navy text-lg leading-snug">{card.question}</p>
            <p className="text-xs text-muted-foreground">Tap to reveal answer</p>
          </div>
          <div className="absolute inset-0 rounded-3xl p-6 shadow-card flex flex-col justify-between bg-rcsi-navy"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-rcsi-navy bg-white w-fit">Answer</span>
            <p className="text-white text-base leading-relaxed whitespace-pre-line">{card.answer}</p>
            <p className="text-white/50 text-xs">Tap to flip back</p>
          </div>
        </motion.div>
      </div>

      <Button onClick={next} className="w-full h-12 rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90 font-semibold">
        {idx + 1 >= ISBAR_FLASHCARDS.length ? "Finish" : "Next Card"}
      </Button>
    </div>
  );
};

// ── Quiz ──────────────────────────────────────────────────────────────────────
const QuizTab = ({ onComplete }: { onComplete: () => void }) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = ISBAR_QUIZ[idx];
  const revealed = selected !== null;

  const onSelect = (key: string) => {
    if (revealed) return;
    setSelected(key);
    if (key === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    if (idx + 1 >= ISBAR_QUIZ.length) { setFinished(true); onComplete(); }
    else setIdx(idx + 1);
  };

  if (finished) {
    const pct = Math.round((score / ISBAR_QUIZ.length) * 100);
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-28 w-28 rounded-full bg-rcsi-lavender grid place-items-center mb-4 shadow-elevated">
          <div>
            <div className="font-display font-extrabold text-3xl text-rcsi-navy">{pct}%</div>
            <div className="text-xs text-rcsi-navy/60">{score}/{ISBAR_QUIZ.length}</div>
          </div>
        </div>
        <h3 className="font-display font-bold text-rcsi-navy text-xl mb-2">
          {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good effort!" : "Keep practising!"}
        </h3>
        <Button onClick={() => { setIdx(0); setSelected(null); setScore(0); setFinished(false); }} variant="outline" className="mt-4 rounded-full gap-2">
          <RotateCw size={16} /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground px-1">
        <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700">{q.tag}</span>
        <span>Q{idx + 1}/{ISBAR_QUIZ.length}</span>
      </div>

      {q.scenario && (
        <div className="bg-rcsi-lavender rounded-2xl p-4">
          <div className="text-xs font-bold text-rcsi-navy mb-1">SCENARIO</div>
          <p className="text-sm text-rcsi-navy/80 leading-relaxed">{q.scenario}</p>
        </div>
      )}

      <div className="bg-card rounded-2xl p-5 shadow-card">
        <p className="font-display font-bold text-rcsi-navy leading-snug">{q.question}</p>
      </div>

      <div className="space-y-2.5">
        {q.options.map((opt) => {
          const isCorrect = opt.key === q.correct;
          const isSelected = opt.key === selected;
          let cls = "border-border bg-card hover:border-rcsi-purple";
          let icon = null;
          if (revealed) {
            if (isCorrect) { cls = "border-rcsi-green bg-rcsi-green/10"; icon = <Check size={16} className="text-rcsi-green shrink-0" />; }
            else if (isSelected) { cls = "border-destructive bg-destructive/10"; icon = <X size={16} className="text-destructive shrink-0" />; }
            else cls = "border-border bg-card opacity-50";
          }
          return (
            <button key={opt.key} onClick={() => onSelect(opt.key)} disabled={revealed}
              className={`w-full text-left rounded-2xl border-2 p-4 transition flex items-center gap-3 ${cls}`}>
              <div className="h-8 w-8 rounded-lg bg-muted grid place-items-center font-bold text-sm shrink-0">{opt.key}</div>
              <div className="flex-1 text-sm font-medium">{opt.text}</div>
              {icon}
            </button>
          );
        })}
      </div>

      {revealed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 ${selected === q.correct ? "bg-rcsi-green/10" : "bg-destructive/10"}`}>
          <div className="text-sm font-semibold text-foreground mb-1">
            {selected === q.correct ? "✓ Correct" : "✗ Incorrect"} — Rationale
          </div>
          <p className="text-sm text-foreground/80">{q.explanation}</p>
        </motion.div>
      )}

      {revealed && (
        <Button onClick={next} className="w-full h-12 rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90 font-semibold">
          {idx + 1 >= ISBAR_QUIZ.length ? "Finish" : "Next Question"}
        </Button>
      )}
    </div>
  );
};

// ── Practice Scenarios ────────────────────────────────────────────────────────
const PracticeTab = ({ onComplete }: { onComplete: () => void }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answers, setAnswers] = useState({ identify: "", situation: "", background: "", assessment: "", recommendation: "" });
  const [showModel, setShowModel] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const scenario = PRACTICE_SCENARIOS[scenarioIdx];
  const FIELDS: { key: keyof typeof answers; label: string; color: string }[] = [
    { key: "identify",       label: "I — Identify",       color: "#0284c7" },
    { key: "situation",      label: "S — Situation",      color: "#7c3aed" },
    { key: "background",     label: "B — Background",     color: "#16a34a" },
    { key: "assessment",     label: "A — Assessment",     color: "#D97706" },
    { key: "recommendation", label: "R — Recommendation", color: "#DC2626" },
  ];

  const handleReveal = () => {
    setShowModel(true);
    const next = new Set(completed).add(scenarioIdx);
    setCompleted(next);
    if (next.size >= PRACTICE_SCENARIOS.length) onComplete();
  };

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PRACTICE_SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => { setScenarioIdx(i); setShowModel(false); setAnswers({ identify: "", situation: "", background: "", assessment: "", recommendation: "" }); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border-2 transition ${
              scenarioIdx === i ? "bg-rcsi-navy text-white border-rcsi-navy" : "bg-card border-border text-muted-foreground"
            }`}>
            {s.title}
            {completed.has(i) && " ✓"}
          </button>
        ))}
      </div>

      {/* Urgency + context */}
      <div className="rounded-2xl p-4 border-l-4" style={{ background: `${scenario.urgencyColor}10`, borderColor: scenario.urgencyColor }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: scenario.urgencyColor }}>
            {scenario.urgency} Priority
          </span>
          <span className="font-display font-bold text-rcsi-navy">{scenario.title}</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{scenario.context}</p>
      </div>

      {/* Input fields */}
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-xs font-bold mb-1 block" style={{ color: f.color }}>{f.label}</label>
            <Textarea
              value={answers[f.key]}
              onChange={(e) => setAnswers({ ...answers, [f.key]: e.target.value })}
              placeholder={`Write your ${f.label.split(" — ")[1]} here...`}
              className="rounded-xl resize-none min-h-[80px] text-sm"
              style={{ borderColor: `${f.color}40` }}
            />
          </div>
        ))}
      </div>

      {!showModel && (
        <Button onClick={handleReveal} className="w-full h-12 rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90 font-semibold">
          Reveal Model Answer
        </Button>
      )}

      {/* Model answer */}
      {showModel && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h4 className="font-display font-bold text-rcsi-navy">Model Answer</h4>
          {FIELDS.map((f) => (
            <div key={f.key} className="rounded-xl p-4" style={{ background: `${f.color}10`, border: `1px solid ${f.color}20` }}>
              <div className="text-xs font-bold mb-1" style={{ color: f.color }}>{f.label}</div>
              <p className="text-sm text-foreground/80">{scenario.modelAnswer[f.key]}</p>
            </div>
          ))}
          <div className="bg-rcsi-mint rounded-xl p-3">
            <div className="font-semibold text-rcsi-navy text-xs mb-1.5">Key Points</div>
            <ul className="space-y-1">
              {scenario.keyPoints.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs text-rcsi-navy/80">
                  <Check size={12} className="text-rcsi-green mt-0.5 shrink-0" />{p}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ── Compare ───────────────────────────────────────────────────────────────────
const CompareTab = () => (
  <div className="space-y-4">
    {[ISBAR_COMPARE_GOOD, ISBAR_COMPARE_POOR].map((c) => (
      <div key={c.title} className="rounded-2xl overflow-hidden shadow-soft">
        <div className="px-5 py-3 font-display font-bold text-sm" style={{ background: c.bg, color: c.color }}>
          {c.title}
        </div>
        <div className="bg-card p-4 space-y-2">
          {c.script.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="h-7 w-7 rounded-lg grid place-items-center font-display font-bold text-xs text-white shrink-0"
                style={{ background: c.color }}>{s.label}</span>
              <p className="text-sm text-foreground/80 italic pt-0.5">{s.text}</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t">
            {"strengths" in c ? (
              <div>
                <div className="text-xs font-bold text-green-700 mb-1.5">What makes this good:</div>
                <ul className="space-y-1">
                  {(c as typeof ISBAR_COMPARE_GOOD).strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-xs text-green-700"><Check size={12} className="shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-red-700 mb-1.5">Errors in this example:</div>
                <ul className="space-y-1">
                  {(c as typeof ISBAR_COMPARE_POOR).errors.map((e, i) => (
                    <li key={i} className="flex gap-2 text-xs text-red-700"><X size={12} className="shrink-0 mt-0.5" />{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ISBARCommunication = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const { user } = useAuthStore();
  const { awardBadge } = useRewardsStore();

  const handleFlashcardsComplete = () => { if (user?.id) awardBadge(user.id, "isbar_flashcards"); };
  const handlePracticeComplete   = () => { if (user?.id) awardBadge(user.id, "isbar_practice"); };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link to="/station/isbar" className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold tracking-widest">STATION 3</div>
            <div className="font-display font-bold text-xl text-foreground">ISBAR Communication</div>
          </div>
          <div className="ml-auto h-10 w-10 rounded-full bg-red-100 grid place-items-center">
            <MessageSquare size={18} className="text-red-600" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto gap-1 bg-card rounded-2xl p-1 shadow-soft mb-6 scrollbar-hide">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-max px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                tab === t.id ? "bg-rcsi-navy text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === "overview"  && <OverviewTab />}
            {tab === "steps"     && <StepsTab />}
            {tab === "cards"     && <FlashcardsTab onComplete={handleFlashcardsComplete} />}
            {tab === "quiz"      && <QuizTab onComplete={() => {}} />}
            {tab === "practice"  && <PracticeTab onComplete={handlePracticeComplete} />}
            {tab === "compare"   && <CompareTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ISBARCommunication;
