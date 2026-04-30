import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { TOPICS, studyModuleRoute } from "@/data/topics";
import { toast } from "@/hooks/use-toast";

interface ScheduledTask {
  id: string;
  title: string;
  icon: string;
  color: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_min: number;
  topic_id: string | null;
  route: string | null;
  completed: boolean;
}

const COLOR_BG: Record<string, string> = {
  mint: "bg-rcsi-mint",
  lavender: "bg-rcsi-lavender",
  yellow: "bg-rcsi-yellow",
  peach: "bg-rcsi-peach",
};

const TASK_TYPES = [
  { id: "quiz", label: "MCQ Quiz", icon: "🧠", color: "mint", duration: 20, mode: "exam" as const },
  { id: "practice", label: "Practice Mode", icon: "🎙️", color: "lavender", duration: 30, mode: "practice" as const },
  { id: "study", label: "Study Module", icon: "📚", color: "yellow", duration: 25, mode: "study" as const },
  { id: "flashcards", label: "Flashcards", icon: "💡", color: "peach", duration: 15, mode: "flashcards" as const },
];

const fmtDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const Schedule = () => {
  const today = new Date();
  const nav = useNavigate();
  const { user } = useAuthStore();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(today.getDate());
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [topicId, setTopicId] = useState<string>(TOPICS[0].id);
  const [typeId, setTypeId] = useState<string>("quiz");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(20);

  const resetForm = () => {
    setEditingId(null);
    setTopicId(TOPICS[0].id);
    setTypeId("quiz");
    setTime("09:00");
    setDuration(20);
  };

  const openAdd = () => { resetForm(); setOpen(true); };

  const openEdit = (t: ScheduledTask) => {
    setEditingId(t.id);
    setTopicId(t.topic_id ?? TOPICS[0].id);
    // Best-effort reverse-map type from icon
    const matchedType = TASK_TYPES.find((x) => x.icon === t.icon)?.id ?? "quiz";
    setTypeId(matchedType);
    setTime(t.scheduled_time ? t.scheduled_time.slice(0, 5) : "09:00");
    setDuration(t.duration_min);
    setOpen(true);
  };

  const selectedDate = useMemo(
    () => new Date(view.y, view.m, selected),
    [view, selected],
  );
  const selectedDateStr = fmtDate(selectedDate);

  const loadTasks = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("scheduled_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_time", { nullsFirst: false });
    setTasks(data ?? []);
  };

  useEffect(() => { loadTasks(); }, [user?.id]);

  const dayTasks = tasks.filter((t) => t.scheduled_date === selectedDateStr);
  const taskDates = useMemo(() => {
    const s = new Set<string>();
    tasks
      .filter((t) => {
        const d = new Date(t.scheduled_date);
        return d.getFullYear() === view.y && d.getMonth() === view.m;
      })
      .forEach((t) => s.add(t.scheduled_date));
    return s;
  }, [tasks, view]);

  const first = new Date(view.y, view.m, 1).getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const monthName = new Date(view.y, view.m).toLocaleString("en", { month: "long" });
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const buildRoute = (tId: string, mode: typeof TASK_TYPES[number]["mode"]) => {
    if (mode === "exam") return `/quiz/${tId}?mode=exam`;
    if (mode === "practice") return `/quiz/${tId}`;
    if (mode === "study") return studyModuleRoute(tId);
    return studyModuleRoute(tId); // flashcards live inside the module
  };

  const saveTask = async () => {
    if (!user?.id) return;
    const type = TASK_TYPES.find((t) => t.id === typeId)!;
    const topic = TOPICS.find((t) => t.id === topicId)!;
    const payload = {
      title: `${topic.label} — ${type.label}`,
      icon: type.icon,
      color: type.color,
      scheduled_date: selectedDateStr,
      scheduled_time: time,
      duration_min: duration,
      topic_id: topic.id,
      route: buildRoute(topic.id, type.mode),
    };
    const { error } = editingId
      ? await supabase.from("scheduled_tasks").update(payload).eq("id", editingId)
      : await supabase.from("scheduled_tasks").insert({ ...payload, user_id: user.id });
    if (error) {
      toast({ title: "Could not save task", description: error.message, variant: "destructive" });
      return;
    }
    setOpen(false);
    resetForm();
    loadTasks();
  };

  const removeTask = async (id: string) => {
    await supabase.from("scheduled_tasks").delete().eq("id", id);
    loadTasks();
  };

  const startTask = async (t: ScheduledTask) => {
    await supabase.from("scheduled_tasks").update({ completed: true }).eq("id", t.id);
    if (t.route) nav(t.route);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-rcsi-navy">Schedule</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <Button size="sm" onClick={openAdd} className="rounded-full bg-rcsi-navy hover:bg-rcsi-navy/90 gap-1.5">
            <Plus size={16} /> Add task
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit task" : "New study task"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <div className="text-sm text-muted-foreground mt-1">{selectedDate.toDateString()}</div>
              </div>
              <div>
                <Label htmlFor="topic">Station</Label>
                <Select value={topicId} onValueChange={setTopicId}>
                  <SelectTrigger id="topic"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Activity</Label>
                <Select value={typeId} onValueChange={(v) => {
                  setTypeId(v);
                  const def = TASK_TYPES.find((x) => x.id === v)?.duration;
                  if (def && !editingId) setDuration(def);
                }}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((t) => <SelectItem key={t.id} value={t.id}>{t.icon} {t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" min={5} max={240} value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value || "0", 10))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={saveTask} className="bg-rcsi-navy hover:bg-rcsi-navy/90">
                {editingId ? "Save changes" : "Add to schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-3xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setView((v) => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted">
            <ChevronLeft size={18} />
          </button>
          <div className="font-display font-bold text-lg text-rcsi-navy">
            {monthName} <span className="text-muted-foreground font-medium">{view.y}</span>
          </div>
          <button onClick={() => setView((v) => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            const isToday = d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();
            const isSel = d === selected;
            const dateStr = d != null ? fmtDate(new Date(view.y, view.m, d)) : "";
            const hasTask = d != null && taskDates.has(dateStr);
            return (
              <button key={i} disabled={d == null}
                onClick={() => d && setSelected(d)}
                className={`aspect-square rounded-xl text-sm font-medium relative transition ${
                  d == null ? "" : isSel || isToday ? "bg-rcsi-navy text-primary-foreground" : "hover:bg-muted text-rcsi-navy"
                }`}>
                {d}
                {hasTask && !isSel && !isToday && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-rcsi-green" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-bold text-rcsi-navy">
          {selectedDateStr === fmtDate(today) ? "Today's tasks" : `Tasks · ${selectedDate.toDateString()}`}
        </h3>
        {dayTasks.length === 0 && (
          <div className="bg-card rounded-2xl p-6 text-center text-sm text-muted-foreground shadow-soft">
            No tasks scheduled. Tap <b>Add task</b> to plan a study session.
          </div>
        )}
        {dayTasks.map((t) => (
          <div key={t.id} className={`${COLOR_BG[t.color] ?? "bg-rcsi-mint"} rounded-2xl p-4 flex items-center gap-4 shadow-soft`}>
            <div className="h-12 w-12 rounded-xl bg-white grid place-items-center text-2xl shrink-0">{t.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-rcsi-navy text-sm truncate">{t.title}</div>
              <div className="text-xs text-rcsi-navy/60 mt-0.5">
                {t.scheduled_time ? t.scheduled_time.slice(0, 5) : "Anytime"} · {t.duration_min} min
                {t.completed && <span className="ml-2 inline-flex items-center gap-1 text-rcsi-green"><Check size={12} /> done</span>}
              </div>
            </div>
            <button onClick={() => openEdit(t)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/60 text-rcsi-navy/60" aria-label="Edit task">
              <Pencil size={14} />
            </button>
            <button onClick={() => removeTask(t.id)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/60 text-rcsi-navy/60" aria-label="Delete task">
              <Trash2 size={14} />
            </button>
            <Button size="sm" onClick={() => startTask(t)} className="bg-rcsi-navy hover:bg-rcsi-navy/90 rounded-full text-xs">
              {t.completed ? "Re-do" : "Start"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
