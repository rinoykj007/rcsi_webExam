import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CalendarDays,
  TrendingUp,
  LayoutGrid,
  Plus,
  Timer,
  X,
  Check,
  Brain,
  Zap,
  Clock,
  Stethoscope,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { TOPICS, type Topic } from "@/data/topics";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProgressStore } from "@/stores/useProgressStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroIllustration from "@/assets/hero-study.png";

/* ─── Stat card ─────────────────────────────────────────────────── */
const StatCard = ({
  icon,
  label,
  value,
  sub,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  bg: string;
}) => (
  <div className={`rounded-2xl p-3 sm:p-4 ${bg}`}>
    <div className="flex items-center gap-2 mb-2 sm:mb-3">
      <div className="h-7 w-7 rounded-lg bg-white/70 grid place-items-center shrink-0">
        {icon}
      </div>
      <span className="text-[11px] sm:text-xs font-semibold text-foreground/60 uppercase tracking-wide truncate">
        {label}
      </span>
    </div>
    <div className="font-display font-extrabold text-xl sm:text-2xl text-foreground">
      {value}
    </div>
    <div className="text-[10px] sm:text-xs text-foreground/55 mt-0.5">
      {sub}
    </div>
  </div>
);

/* ─── Station card ───────────────────────────────────────────────── */
const StationCard = ({
  topic,
  accuracy,
}: {
  topic: Topic;
  accuracy: number;
}) => (
  <Link
    to={`/station/${topic.id}`}
    className="group block w-[155px] sm:w-[185px] shrink-0 rounded-2xl bg-card border border-border hover:shadow-card transition overflow-hidden"
  >
    <div
      className="relative h-[90px] grid place-items-center overflow-hidden"
      style={{ background: topic.tint }}
    >
      <div
        className="h-11 w-11 rounded-xl bg-white shadow-soft grid place-items-center group-hover:scale-105 transition"
        style={{ color: topic.dotColor }}
      >
        <BookOpen size={18} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50">
        <div
          className="h-full transition-all"
          style={{
            width: `${Math.round(accuracy * 100)}%`,
            background: topic.dotColor,
          }}
        />
      </div>
    </div>
    <div className="p-3">
      <div className="text-[10px] font-bold tracking-widest text-muted-foreground">
        S{topic.station_id}
      </div>
      <div className="font-display font-bold text-sm leading-tight truncate mt-0.5">
        {topic.label}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-muted-foreground">Progress</span>
        <span
          className="text-[11px] font-bold"
          style={{ color: topic.dotColor }}
        >
          {Math.round(accuracy * 100)}%
        </span>
      </div>
    </div>
  </Link>
);

/* ─── Task row ───────────────────────────────────────────────────── */
const TaskRow = ({
  title,
  date,
  onComplete,
}: {
  title: string;
  date: string;
  onComplete: () => void;
}) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
    <button
      onClick={onComplete}
      className="h-8 w-8 rounded-lg bg-rcsi-lavender grid place-items-center shrink-0 hover:bg-rcsi-green/20 transition"
    >
      <Timer size={14} className="text-rcsi-purple" />
    </button>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-foreground truncate">
        {title}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">Due {date}</div>
    </div>
    <button
      onClick={onComplete}
      className="h-7 w-7 rounded-lg border border-border grid place-items-center text-muted-foreground hover:bg-rcsi-green hover:text-white hover:border-rcsi-green transition shrink-0"
    >
      <Check size={12} />
    </button>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────── */
const Home = () => {
  const { user, profile } = useAuthStore();
  const { load, performance } = useProgressStore();
  const [pendingTasks, setPendingTasks] = useState<
    { id: string; title: string; scheduled_date: string }[]
  >([]);
  const [upcomingCount, setUpcomingCount] = useState(0);

  /* Calendar state */
  const [calView, setCalView] = useState<"weekly" | "monthly">("weekly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  const name = profile?.name ?? user?.email?.split("@")[0] ?? "there";
  const initial = name.charAt(0).toUpperCase();
  const avatarUrl =
    (user?.user_metadata as Record<string, any> | undefined)?.avatar_url ??
    (user?.user_metadata as Record<string, any> | undefined)?.picture;

  const fetchTasks = () => {
    if (!user?.id) return;
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("scheduled_tasks")
      .select("id, title, scheduled_date")
      .eq("user_id", user.id)
      .eq("completed", false)
      .lte("scheduled_date", today)
      .order("scheduled_date", { ascending: true })
      .limit(5)
      .then(({ data }) => setPendingTasks(data ?? []));
    supabase
      .from("scheduled_tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", false)
      .gt("scheduled_date", today)
      .then(({ count }) => setUpcomingCount(count ?? 0));
  };

  useEffect(() => {
    if (user?.id) load(user.id);
  }, [user?.id, load]);
  useEffect(() => {
    fetchTasks();
  }, [user?.id]);

  /* Mark task complete */
  const markComplete = async (id: string) => {
    await supabase
      .from("scheduled_tasks")
      .update({ completed: true })
      .eq("id", id);
    setPendingTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task completed!");
  };

  /* Add note */
  const handleAddNote = async () => {
    if (!noteText.trim() || !user?.id) return;
    setSaving(true);
    const { error } = await supabase.from("scheduled_tasks").insert({
      user_id: user.id,
      title: noteText.trim(),
      scheduled_date: selectedDate.toISOString().slice(0, 10),
      icon: "📝",
      color: "mint",
      duration_min: 0,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to save note");
      return;
    }
    toast.success("Note saved!");
    setNoteText("");
    setNoteOpen(false);
    fetchTasks();
  };

  const studiedCount = useMemo(
    () => TOPICS.filter((t) => (performance[t.id]?.total ?? 0) > 0).length,
    [performance],
  );

  const avgScore = useMemo(() => {
    const studied = TOPICS.filter((t) => (performance[t.id]?.total ?? 0) > 0);
    if (!studied.length) return 0;
    const sum = studied.reduce((acc, t) => {
      const p = performance[t.id];
      return acc + (p ? p.correct / p.total : 0);
    }, 0);
    return Math.round((sum / studied.length) * 100);
  }, [performance]);

  const continueList = useMemo(() => {
    const attempted = TOPICS.filter((t) => (performance[t.id]?.total ?? 0) > 0);
    return (attempted.length ? attempted : TOPICS.slice(0, 8)).map((t) => {
      const p = performance[t.id];
      return { topic: t, accuracy: p && p.total ? p.correct / p.total : 0 };
    });
  }, [performance]);

  /* Weekly days */
  const weekDays = useMemo(() => {
    const today = new Date();
    const dow = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        day,
        d,
        isToday: d.toDateString() === today.toDateString(),
        isSelected: d.toDateString() === selectedDate.toDateString(),
      };
    });
  }, [selectedDate]);

  /* Monthly grid */
  const monthDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDow = (first.getDay() + 6) % 7;
    const cells: (Date | null)[] = Array(startDow).fill(null);
    for (let d = 1; d <= last.getDate(); d++)
      cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [selectedDate]);

  const monthLabel = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const monthYearLabel = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) =>
    scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-7">
        <div>
          <p className="text-sm text-muted-foreground leading-none mb-1">
            Welcome back,
          </p>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden md:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="Search…"
              className="h-10 w-44 lg:w-56 pl-9 pr-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <ThemeToggle />
          <button className="relative h-10 w-10 rounded-xl bg-card border border-border grid place-items-center text-foreground hover:bg-muted transition">
            <Bell size={17} />
            {pendingTasks.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rcsi-green text-white text-[10px] font-bold grid place-items-center">
                {pendingTasks.length}
              </span>
            )}
          </button>
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-rcsi-purple-soft grid place-items-center font-display font-bold text-rcsi-navy text-sm shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-5">
        {/* LEFT ── */}
        <div className="space-y-5 min-w-0">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#2c5f2e] text-white p-5 sm:p-6 min-h-[160px]">
              <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-white/5" />
              <div className="relative z-10 max-w-[100%] sm:max-w-[58%]">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl leading-tight mb-2">
                  Learn today, succeed tomorrow!
                </h2>
                <p className="text-sm opacity-75 mb-4 leading-relaxed">
                  Practice all 14 RCSI clinical stations and track your
                  progress.
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/question-bank"
                    className="inline-flex items-center gap-1.5 bg-white text-[#2c5f2e] rounded-full px-4 py-2 text-sm font-bold hover:bg-white/90 transition"
                  >
                    <Brain size={14} /> MCQ
                  </Link>
                  <a
                    href="#stations"
                    className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/40 rounded-full px-4 py-2 text-sm font-bold hover:bg-white/30 transition"
                  >
                    <Stethoscope size={14} /> Practical
                  </a>
                </div>
              </div>
              <img
                src={heroIllustration}
                alt=""
                className="hidden sm:block absolute right-1 bottom-0 h-[145px] sm:h-[160px] w-auto object-contain pointer-events-none select-none"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              icon={<LayoutGrid size={13} className="text-yellow-600" />}
              label="Topics"
              value={`+${studiedCount}`}
              sub="stations studied"
              bg="bg-yellow-50"
            />
            <StatCard
              icon={<TrendingUp size={13} className="text-teal-600" />}
              label="Avg Score"
              value={`${avgScore}%`}
              sub="of your quizzes"
              bg="bg-teal-50"
            />
            <StatCard
              icon={<CalendarDays size={13} className="text-purple-600" />}
              label="Sessions"
              value={`${upcomingCount}`}
              sub="sessions upcoming"
              bg="bg-purple-50"
            />
          </div>

          {/* Station cards */}
          <div id="stations">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  Active stations
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {continueList.length} stations
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => scrollBy(-200)}
                  className="h-8 w-8 rounded-lg bg-card border border-border grid place-items-center text-foreground hover:bg-muted transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollBy(200)}
                  className="h-8 w-8 rounded-lg bg-card border border-border grid place-items-center text-foreground hover:bg-muted transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div
              ref={scrollerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 snap-x"
            >
              {continueList.map(({ topic, accuracy }) => (
                <div key={topic.id} className="snap-start">
                  <StationCard topic={topic} accuracy={accuracy} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT ── */}
        <div className="space-y-4">
          {/* Calendar card */}
          <div className="rounded-2xl bg-card border border-border p-4">
            {/* Toggle */}
            <div className="flex gap-1 mb-4 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setCalView("weekly")}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${calView === "weekly" ? "bg-rcsi-navy text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setCalView("monthly")}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition ${calView === "monthly" ? "bg-rcsi-navy text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Monthly
              </button>
            </div>

            {/* Date label */}
            <div className="font-display font-extrabold text-2xl text-foreground mb-3">
              {calView === "weekly" ? monthLabel : monthYearLabel}
            </div>

            {/* Weekly view */}
            {calView === "weekly" && (
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(({ day, d, isToday, isSelected }) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(d)}
                    className={`rounded-xl py-2 text-center transition ${
                      isSelected
                        ? "bg-rcsi-navy text-white"
                        : isToday
                          ? "bg-rcsi-navy/10 text-rcsi-navy font-bold"
                          : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="text-[10px] font-semibold">{day}</div>
                    <div className="text-xs font-bold mt-0.5">
                      {d.getDate()}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Monthly view */}
            {calView === "monthly" && (
              <div className="mb-4">
                <div className="grid grid-cols-7 mb-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div
                      key={i}
                      className="text-center text-[10px] font-semibold text-muted-foreground py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {monthDays.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const isToday =
                      d.toDateString() === new Date().toDateString();
                    const isSelected =
                      d.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        className={`rounded-lg py-1.5 text-xs text-center transition ${
                          isSelected
                            ? "bg-rcsi-navy text-white font-bold"
                            : isToday
                              ? "bg-rcsi-navy/10 text-rcsi-navy font-bold"
                              : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add note form */}
            <AnimatePresence>
              {noteOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 overflow-hidden"
                >
                  <div className="bg-muted rounded-xl p-3">
                    <input
                      autoFocus
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                      placeholder={`Note for ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}…`}
                      className="w-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setNoteOpen(false);
                          setNoteText("");
                        }}
                        className="flex-1 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-card transition flex items-center justify-center gap-1"
                      >
                        <X size={11} /> Cancel
                      </button>
                      <button
                        onClick={handleAddNote}
                        disabled={saving || !noteText.trim()}
                        className="flex-1 py-1.5 text-xs rounded-lg bg-rcsi-navy text-white font-medium hover:bg-rcsi-navy/90 transition disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <Check size={11} /> {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setNoteOpen((v) => !v)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-sm text-foreground font-medium hover:bg-muted transition"
              >
                <Plus size={13} /> Add note
              </button>
              <Link
                to="/dashboard/schedule"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rcsi-navy text-white text-sm font-semibold hover:bg-rcsi-navy/90 transition"
              >
                <Plus size={13} /> New event
              </Link>
            </div>
          </div>

          {/* Pending tasks */}
          <div className="rounded-2xl bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-bold text-base text-foreground">
                Pending tasks
              </h3>
              <Link
                to="/dashboard/schedule"
                className="text-xs text-rcsi-purple font-semibold hover:underline"
              >
                View all
              </Link>
            </div>
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                You're all caught up! 🎉
              </p>
            ) : (
              pendingTasks
                .slice(0, 4)
                .map((t) => (
                  <TaskRow
                    key={t.id}
                    title={t.title}
                    date={t.scheduled_date}
                    onComplete={() => markComplete(t.id)}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
