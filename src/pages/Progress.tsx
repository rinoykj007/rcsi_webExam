import { useEffect, useMemo, useState } from "react";
import { TOPICS } from "@/data/topics";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { useRewardsStore } from "@/stores/useRewardsStore";
import { motion } from "framer-motion";
import { Flame, CalendarCheck, BookOpenCheck, Target, Minus, Plus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Range = "week" | "month" | "year";

const Donut = ({ pct }: { pct: number }) => {
  const r = 76;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
      <circle cx="90" cy="90" r={r} stroke="hsl(var(--rcsi-purple-soft))" strokeWidth="18" fill="none" />
      <circle cx="90" cy="90" r={r} stroke="hsl(var(--rcsi-purple))" strokeWidth="18" fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }} />
    </svg>
  );
};

interface FlashcardRow { topic_id: string; known: boolean }

const Progress = () => {
  const { user } = useAuthStore();
  const { load, performance, totalCorrect, overallPct } = useProgressStore();
  const { load: loadRewards, loaded: rewardsLoaded, totalPoints, badges } = useRewardsStore();
  const [range, setRange] = useState<Range>("week");
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<{ id: string; topic_id: string }[]>([]);
  const [flashProgress, setFlashProgress] = useState<FlashcardRow[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(5);
  const [savingGoal, setSavingGoal] = useState(false);

  useEffect(() => { if (user?.id) load(user.id); }, [user?.id, load]);
  useEffect(() => { if (user?.id && !rewardsLoaded) loadRewards(user.id); }, [user?.id, rewardsLoaded, loadRewards]);

  // Load weekly goal
  useEffect(() => {
    if (!user?.id) return;
    supabase.from("weekly_goals").select("sessions_per_week").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data) setWeeklyGoal(data.sessions_per_week); });
  }, [user?.id]);

  const saveGoal = async (next: number) => {
    if (!user?.id) return;
    setWeeklyGoal(next);
    setSavingGoal(true);
    const { error } = await supabase.from("weekly_goals").upsert(
      { user_id: user.id, sessions_per_week: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    setSavingGoal(false);
    if (error) toast.error("Could not save goal");
    else toast.success(`Goal set to ${next} sessions / week`);
  };

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [{ data: tasks }, { data: cards }, { data: prog }] = await Promise.all([
        supabase.from("scheduled_tasks").select("scheduled_date").eq("user_id", user.id).eq("completed", true),
        supabase.from("flashcards").select("id, topic_id"),
        supabase.from("flashcard_progress").select("flashcard_id, known, reviewed_at").eq("user_id", user.id),
      ]);
      setCompletedDates((tasks ?? []).map((t) => t.scheduled_date));
      setFlashcards(cards ?? []);
      // Map flashcard_id -> topic_id to derive per-topic known/learning counts
      const cardTopic = new Map((cards ?? []).map((c) => [c.id, c.topic_id]));
      const rows: FlashcardRow[] = (prog ?? []).map((p) => ({
        topic_id: cardTopic.get(p.flashcard_id) ?? "",
        known: p.known,
      })).filter((r) => r.topic_id);
      setFlashProgress(rows);
    })();
  }, [user?.id]);

  const correct = totalCorrect();
  const pct = overallPct();
  const score = correct * 10;

  // Streak + days studied this month + this week
  const { streak, daysThisMonth, daysThisWeek } = useMemo(() => {
    const set = new Set(completedDates);
    const today = new Date();
    let s = 0;
    const cursor = new Date(today);
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!set.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (set.has(fmt(cursor))) { s++; cursor.setDate(cursor.getDate() - 1); }

    const m = today.getMonth(), y = today.getFullYear();
    const monthDays = new Set<string>();
    completedDates.forEach((d) => {
      const dt = new Date(d);
      if (dt.getMonth() === m && dt.getFullYear() === y) monthDays.add(d);
    });

    // Days this week (Mon-Sun)
    const weekStart = new Date(today);
    const dow = (weekStart.getDay() + 6) % 7; // 0 = Mon
    weekStart.setDate(weekStart.getDate() - dow);
    weekStart.setHours(0, 0, 0, 0);
    const weekDays = new Set<string>();
    completedDates.forEach((d) => {
      const dt = new Date(d);
      if (dt >= weekStart && dt <= today) weekDays.add(d);
    });

    return { streak: s, daysThisMonth: monthDays.size, daysThisWeek: weekDays.size };
  }, [completedDates]);

  // Flashcard counts per topic
  const flashByTopic = useMemo(() => {
    const total: Record<string, number> = {};
    flashcards.forEach((c) => { total[c.topic_id] = (total[c.topic_id] ?? 0) + 1; });
    const known: Record<string, number> = {};
    const learning: Record<string, number> = {};
    flashProgress.forEach((r) => {
      if (r.known) known[r.topic_id] = (known[r.topic_id] ?? 0) + 1;
      else learning[r.topic_id] = (learning[r.topic_id] ?? 0) + 1;
    });
    return { total, known, learning };
  }, [flashcards, flashProgress]);

  const totalKnown = Object.values(flashByTopic.known).reduce((a, b) => a + b, 0);
  const totalLearning = Object.values(flashByTopic.learning).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-3xl md:text-4xl text-rcsi-navy">Learning<br />Pathway Status</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rcsi-mint rounded-2xl p-5 shadow-soft">
          <div className="font-display text-3xl font-bold text-rcsi-navy">{correct}</div>
          <div className="text-sm text-rcsi-navy/70 mt-1">Achieved</div>
        </div>
        <div className="bg-rcsi-lavender rounded-2xl p-5 shadow-soft">
          <div className="text-xs text-rcsi-navy/60 font-semibold tracking-wide">FINAL</div>
          <div className="font-display text-3xl font-bold text-rcsi-navy mt-0.5">{pct}%</div>
          <div className="text-sm text-rcsi-navy/70">Score</div>
        </div>
      </div>

      {/* Total points + badges */}
      <div className="bg-card rounded-3xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Star className="text-yellow-500" size={18} />
          <h3 className="font-display font-bold text-foreground">Rewards & Achievements</h3>
          <div className="ml-auto bg-rcsi-navy text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {totalPoints} pts
          </div>
        </div>
        {badges.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No badges yet — complete quizzes and modules to earn them!
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => (
              <motion.div key={b.id}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center bg-muted rounded-2xl p-3 text-center gap-1">
                <span className="text-3xl">{b.emoji}</span>
                <span className="text-[11px] font-bold text-rcsi-navy leading-tight">{b.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(b.earnedAt).toLocaleDateString("en-IE", { day: "numeric", month: "short" })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Streak + days studied */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-rcsi-peach rounded-2xl p-5 shadow-soft flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white grid place-items-center">
            <Flame className="text-orange-500" size={22} />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-rcsi-navy">{streak}</div>
            <div className="text-xs text-rcsi-navy/70">Day{streak === 1 ? "" : "s"} streak</div>
          </div>
        </div>
        <div className="bg-rcsi-yellow rounded-2xl p-5 shadow-soft flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white grid place-items-center">
            <CalendarCheck className="text-rcsi-navy" size={22} />
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-rcsi-navy">{daysThisMonth}</div>
            <div className="text-xs text-rcsi-navy/70">Days studied this month</div>
          </div>
        </div>
      </div>

      {/* Weekly goal */}
      <div className="bg-card rounded-3xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-rcsi-purple" size={18} />
          <h3 className="font-display font-bold text-foreground">Weekly study goal</h3>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full"
            disabled={savingGoal || weeklyGoal <= 1}
            onClick={() => saveGoal(Math.max(1, weeklyGoal - 1))}>
            <Minus size={14} />
          </Button>
          <div className="flex-1 text-center">
            <div className="font-display font-extrabold text-3xl text-foreground">{weeklyGoal}</div>
            <div className="text-xs text-muted-foreground">sessions / week</div>
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full"
            disabled={savingGoal || weeklyGoal >= 14}
            onClick={() => saveGoal(Math.min(14, weeklyGoal + 1))}>
            <Plus size={14} />
          </Button>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-rcsi-purple rounded-full transition-all"
            style={{ width: `${Math.min(100, (daysThisWeek / weeklyGoal) * 100)}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {daysThisWeek} of {weeklyGoal} this week
          {daysThisWeek >= weeklyGoal && " — 🎯 goal reached!"}
        </div>
      </div>

      <div className="flex bg-card rounded-full p-1 shadow-soft w-fit">
        {(["week", "month", "year"] as Range[]).map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition ${
              range === r ? "bg-rcsi-navy text-primary-foreground" : "text-muted-foreground"
            }`}>{r}</button>
        ))}
      </div>

      <div className="bg-card rounded-3xl p-8 shadow-card flex flex-col items-center">
        <div className="relative">
          <Donut pct={pct} />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display font-extrabold text-4xl text-rcsi-navy">{score}</div>
              <div className="text-xs text-muted-foreground font-medium">Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard summary */}
      <div className="bg-card rounded-3xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <BookOpenCheck className="text-rcsi-purple" size={18} />
          <h3 className="font-display font-bold text-rcsi-navy">Flashcards</h3>
          <div className="ml-auto text-xs text-muted-foreground">
            <span className="text-rcsi-green font-semibold">{totalKnown} known</span>
            {" · "}
            <span className="text-orange-500 font-semibold">{totalLearning} learning</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {TOPICS.filter((t) => (flashByTopic.total[t.id] ?? 0) > 0).map((t) => {
            const total = flashByTopic.total[t.id] ?? 0;
            const known = flashByTopic.known[t.id] ?? 0;
            const learning = flashByTopic.learning[t.id] ?? 0;
            const knownPct = total ? (known / total) * 100 : 0;
            return (
              <div key={t.id} className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: t.dotColor }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-rcsi-navy font-medium truncate">{t.label}</span>
                    <span className="font-semibold tabular-nums text-xs text-muted-foreground">
                      <span className="text-rcsi-green">{known}</span> / <span className="text-orange-500">{learning}</span> / {total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-rcsi-green transition-all" style={{ width: `${knownPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
          {TOPICS.every((t) => (flashByTopic.total[t.id] ?? 0) === 0) && (
            <div className="text-sm text-muted-foreground text-center py-4">No flashcards reviewed yet.</div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-3xl p-5 shadow-card space-y-4">
        <h3 className="font-display font-bold text-rcsi-navy">Topic breakdown</h3>
        {TOPICS.map((t, i) => {
          const perf = performance[t.id];
          const acc = perf && perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
          return (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: t.dotColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-rcsi-navy font-medium truncate">{t.label}</span>
                  <span className="font-semibold tabular-nums" style={{ color: t.dotColor }}>{acc}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${acc}%`, background: t.dotColor }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;
