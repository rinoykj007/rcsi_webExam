import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface TopicPerf {
  correct: number;
  total: number;
  last_studied: string;
}

interface ProgressState {
  performance: Record<string, TopicPerf>;
  loaded: boolean;
  load: (userId: string) => Promise<void>;
  recordResult: (userId: string, topicId: string, correct: number, total: number) => Promise<void>;
  totalCorrect: () => number;
  totalAnswered: () => number;
  overallPct: () => number;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  performance: {},
  loaded: false,
  load: async (userId) => {
    const { data } = await supabase.from("topic_progress").select("*").eq("user_id", userId);
    const perf: Record<string, TopicPerf> = {};
    (data ?? []).forEach((row) => {
      perf[row.topic_id] = { correct: row.correct, total: row.total, last_studied: row.last_studied };
    });
    set({ performance: perf, loaded: true });
  },
  recordResult: async (userId, topicId, correct, total) => {
    const existing = get().performance[topicId];
    const next: TopicPerf = {
      correct: (existing?.correct ?? 0) + correct,
      total: (existing?.total ?? 0) + total,
      last_studied: new Date().toISOString(),
    };
    set({ performance: { ...get().performance, [topicId]: next } });
    await supabase.from("topic_progress").upsert(
      { user_id: userId, topic_id: topicId, correct: next.correct, total: next.total, last_studied: next.last_studied },
      { onConflict: "user_id,topic_id" },
    );
  },
  totalCorrect: () => Object.values(get().performance).reduce((s, p) => s + p.correct, 0),
  totalAnswered: () => Object.values(get().performance).reduce((s, p) => s + p.total, 0),
  overallPct: () => {
    const t = get().totalAnswered();
    return t === 0 ? 0 : Math.round((get().totalCorrect() / t) * 100);
  },
}));
