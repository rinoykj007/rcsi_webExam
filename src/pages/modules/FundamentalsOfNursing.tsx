import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, RotateCw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRewardsStore } from "@/stores/useRewardsStore";
import {
  MUST_STEPS, MUST_SCORES, DIPSTICK_ROWS, CATHETER_SAMPLE_STEPS, CATHETER_CARE,
  WATERLOW_FACTORS, WATERLOW_SCORES, WATERLOW_PREVENTION, OSCE_STEPS,
  FON_FLASHCARDS, FON_QUIZ, MUST_VS_WATERLOW, DIPSTICK_VS_LAB,
} from "@/data/fonContent";

type Tab = "overview" | "steps" | "cards" | "quiz" | "compare";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "steps",    label: "OSCE Steps" },
  { id: "cards",    label: "Flashcards" },
  { id: "quiz",     label: "Quiz" },
  { id: "compare",  label: "Compare" },
];

// ── Overview ──────────────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 font-display font-bold text-rcsi-navy text-base"
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

const OverviewTab = () => (
  <div className="space-y-4">
    {/* MUST */}
    <Section title="MUST — Malnutrition Universal Screening Tool">
      <div className="space-y-3">
        {MUST_STEPS.map((s) => (
          <div key={s.label} className="rounded-xl bg-blue-50 border border-blue-100 p-3">
            <div className="font-semibold text-blue-700 text-sm">{s.label}</div>
            <div className="text-sm text-blue-600 mt-0.5">{s.detail}</div>
          </div>
        ))}
        <div className="mt-3 space-y-2">
          {MUST_SCORES.map((m) => (
            <div key={m.score} className="rounded-xl p-3 flex items-start gap-3" style={{ background: m.bg }}>
              <span className="font-display font-extrabold text-lg w-10 shrink-0 text-center" style={{ color: m.color }}>
                {m.score}
              </span>
              <div>
                <div className="font-semibold text-sm" style={{ color: m.color }}>{m.risk}</div>
                <div className="text-xs text-gray-600 mt-0.5">{m.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>

    {/* Urine Dipstick */}
    <Section title="Urine Dipstick Markers">
      <div className="space-y-2">
        {DIPSTICK_ROWS.map((r) => (
          <div key={r.marker} className="rounded-xl p-3 flex gap-3" style={{ background: r.bg }}>
            <span className="font-bold text-sm w-24 shrink-0" style={{ color: r.color }}>{r.marker}</span>
            <span className="text-sm text-gray-700">{r.indicates}</span>
          </div>
        ))}
      </div>
    </Section>

    {/* Catheter Sample */}
    <Section title="Catheter Sample Collection — Steps">
      <ol className="space-y-2">
        {CATHETER_SAMPLE_STEPS.map((s) => (
          <li key={s.step} className="flex gap-3 text-sm">
            <span className="h-6 w-6 rounded-full bg-rcsi-green/20 text-rcsi-green font-bold grid place-items-center shrink-0 text-xs">{s.step}</span>
            <span className="text-foreground">{s.title}</span>
          </li>
        ))}
      </ol>
    </Section>

    {/* Catheter Care */}
    <Section title="Catheter Care Principles">
      <ul className="space-y-2">
        {CATHETER_CARE.map((c, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground">
            <Check size={15} className="text-rcsi-green mt-0.5 shrink-0" />
            {c.text}
          </li>
        ))}
      </ul>
    </Section>

    {/* Waterlow */}
    <Section title="Waterlow Pressure Ulcer Risk Score">
      <div className="space-y-2 mb-3">
        {WATERLOW_FACTORS.map((f) => (
          <div key={f.factor} className="rounded-xl bg-red-50 border border-red-100 p-3">
            <div className="font-semibold text-red-700 text-sm">{f.factor}</div>
            <div className="text-xs text-red-600 mt-0.5">{f.detail}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-3">
        {WATERLOW_SCORES.map((s) => (
          <div key={s.range} className="rounded-xl p-3 flex gap-3 items-center" style={{ background: s.bg }}>
            <span className="font-bold text-sm w-16 shrink-0" style={{ color: s.color }}>{s.range}</span>
            <span className="font-semibold text-sm" style={{ color: s.color }}>{s.risk}</span>
          </div>
        ))}
      </div>
      <div className="bg-muted rounded-xl p-3">
        <div className="font-semibold text-sm text-foreground mb-2">Prevention Interventions</div>
        <ul className="space-y-1">
          {WATERLOW_PREVENTION.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80">
              <Check size={13} className="text-rcsi-green mt-0.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  </div>
);

// ── OSCE Steps ────────────────────────────────────────────────────────────────
const StepsTab = () => (
  <div className="space-y-3">
    {OSCE_STEPS.map((s, i) => (
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
  const card = FON_FLASHCARDS[idx];

  const next = () => {
    setFlipped(false);
    setTimeout(() => {
      if (idx + 1 >= FON_FLASHCARDS.length) { setDone(true); onComplete(); }
      else setIdx(idx + 1);
    }, 150);
  };

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display font-bold text-rcsi-navy text-xl mb-2">All cards reviewed!</h3>
        <p className="text-muted-foreground text-sm mb-6">You've gone through all {FON_FLASHCARDS.length} FON flashcards.</p>
        <Button onClick={() => { setIdx(0); setDone(false); setFlipped(false); }} variant="outline" className="rounded-full gap-2">
          <RotateCw size={16} /> Restart
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground px-1">
        <span className="font-semibold" style={{ color: card.categoryColor }}>{card.category}</span>
        <span>{idx + 1} / {FON_FLASHCARDS.length}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-rcsi-navy rounded-full transition-all" style={{ width: `${((idx + 1) / FON_FLASHCARDS.length) * 100}%` }} />
      </div>

      <div
        className="cursor-pointer select-none"
        style={{ perspective: "800px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: "preserve-3d", position: "relative", minHeight: "200px" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl p-6 shadow-card flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden", background: card.categoryBg, border: `2px solid ${card.categoryColor}20` }}
          >
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white w-fit" style={{ background: card.categoryColor }}>
              {card.category}
            </span>
            <p className="font-display font-bold text-rcsi-navy text-lg leading-snug">{card.question}</p>
            <p className="text-xs text-muted-foreground">Tap to reveal answer</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl p-6 shadow-card flex flex-col justify-between bg-rcsi-navy"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full text-rcsi-navy bg-white w-fit">Answer</span>
            <p className="text-white text-base leading-relaxed whitespace-pre-line">{card.answer}</p>
            <p className="text-white/50 text-xs">Tap to flip back</p>
          </div>
        </motion.div>
      </div>

      <Button onClick={next} className="w-full h-12 rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90 font-semibold">
        {idx + 1 >= FON_FLASHCARDS.length ? "Finish" : "Next Card"}
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

  const q = FON_QUIZ[idx];
  const revealed = selected !== null;

  const onSelect = (key: string) => {
    if (revealed) return;
    setSelected(key);
    if (key === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    if (idx + 1 >= FON_QUIZ.length) { setFinished(true); onComplete(); }
    else setIdx(idx + 1);
  };

  if (finished) {
    const pct = Math.round((score / FON_QUIZ.length) * 100);
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-28 w-28 rounded-full bg-rcsi-lavender grid place-items-center mb-4 shadow-elevated">
          <div>
            <div className="font-display font-extrabold text-3xl text-rcsi-navy">{pct}%</div>
            <div className="text-xs text-rcsi-navy/60">{score}/{FON_QUIZ.length}</div>
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
        <span className="font-bold text-rcsi-navy text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">{q.tag}</span>
        <span>Q{idx + 1}/{FON_QUIZ.length}</span>
      </div>

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
          {idx + 1 >= FON_QUIZ.length ? "Finish" : "Next Question"}
        </Button>
      )}
    </div>
  );
};

// ── Compare ───────────────────────────────────────────────────────────────────
const CompareTab = () => (
  <div className="space-y-6">
    {/* MUST vs Waterlow */}
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <div className="px-5 py-4 font-display font-bold text-rcsi-navy border-b">MUST vs Waterlow</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-32">Feature</th>
              <th className="text-left px-4 py-3 text-blue-700 font-semibold">MUST</th>
              <th className="text-left px-4 py-3 text-red-600 font-semibold">Waterlow</th>
            </tr>
          </thead>
          <tbody>
            {MUST_VS_WATERLOW.map((r, i) => (
              <tr key={r.feature} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="px-4 py-3 font-semibold text-rcsi-navy text-xs">{r.feature}</td>
                <td className="px-4 py-3 text-foreground">{r.must}</td>
                <td className="px-4 py-3 text-foreground">{r.waterlow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Dipstick vs Lab */}
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <div className="px-5 py-4 font-display font-bold text-rcsi-navy border-b">Dipstick vs Lab Urine Analysis</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-40">Feature</th>
              <th className="text-left px-4 py-3 text-purple-700 font-semibold">Dipstick</th>
              <th className="text-left px-4 py-3 text-blue-700 font-semibold">Lab (MC&S)</th>
            </tr>
          </thead>
          <tbody>
            {DIPSTICK_VS_LAB.map((r, i) => (
              <tr key={r.feature} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="px-4 py-3 font-semibold text-rcsi-navy text-xs">{r.feature}</td>
                <td className="px-4 py-3 text-foreground">{r.dipstick}</td>
                <td className="px-4 py-3 text-foreground">{r.lab}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const FundamentalsOfNursing = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const { user } = useAuthStore();
  const { awardBadge } = useRewardsStore();

  const handleFlashcardsComplete = () => {
    if (user?.id) awardBadge(user.id, "fon_flashcards");
  };
  const handleQuizComplete = () => {
    if (user?.id) awardBadge(user.id, "fon_quiz");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link to="/station/fundamentals"
            className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="text-[11px] text-muted-foreground font-semibold tracking-widest">STATION 2</div>
            <div className="font-display font-bold text-xl text-foreground">Fundamentals of Nursing</div>
          </div>
          <div className="ml-auto h-10 w-10 rounded-full bg-blue-100 grid place-items-center">
            <BookOpen size={18} className="text-blue-700" />
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
            {tab === "overview" && <OverviewTab />}
            {tab === "steps"    && <StepsTab />}
            {tab === "cards"    && <FlashcardsTab onComplete={handleFlashcardsComplete} />}
            {tab === "quiz"     && <QuizTab onComplete={handleQuizComplete} />}
            {tab === "compare"  && <CompareTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FundamentalsOfNursing;
