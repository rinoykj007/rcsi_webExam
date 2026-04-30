import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  topicId: string;
  section: string;
  earnedAt: string;
}

// Static badge definitions — each has a unique id used to prevent duplicates
export const BADGE_DEFS: Record<string, { label: string; emoji: string; topicId: string; section: string }> = {
  first_quiz:            { label: "First Quiz",          emoji: "🎯", topicId: "any",              section: "quiz" },
  perfect_score:         { label: "Perfect Score",       emoji: "⭐", topicId: "any",              section: "quiz" },
  streak_3:              { label: "3-Day Streak",        emoji: "🔥", topicId: "any",              section: "progress" },
  // per-topic 80%+ badges
  score_infection:       { label: "Infection Expert",    emoji: "🦠", topicId: "infection_control", section: "quiz" },
  score_fundamentals:    { label: "FON Master",          emoji: "🏥", topicId: "fundamentals",      section: "quiz" },
  score_isbar:           { label: "ISBAR Pro",           emoji: "📋", topicId: "isbar",             section: "quiz" },
  score_acute:           { label: "Acute Ace",           emoji: "🚨", topicId: "acute_management",  section: "quiz" },
  score_sepsis:          { label: "Sepsis Guardian",     emoji: "⚕️", topicId: "sepsis",            section: "quiz" },
  // module-completion badges
  fon_flashcards:        { label: "FON Cards Done",      emoji: "📚", topicId: "fundamentals",      section: "cards" },
  fon_quiz:              { label: "FON Quiz Done",       emoji: "✅", topicId: "fundamentals",      section: "quiz" },
  isbar_flashcards:      { label: "ISBAR Cards Done",    emoji: "📝", topicId: "isbar",             section: "cards" },
  isbar_practice:        { label: "ISBAR Practice Done", emoji: "💬", topicId: "isbar",             section: "practice" },
  mock_exam:             { label: "Mock Exam Taken",     emoji: "🎓", topicId: "any",              section: "quiz" },
};

interface RewardsState {
  totalPoints: number;
  badges: Badge[];
  loaded: boolean;
  load: (userId: string) => Promise<void>;
  addPoints: (userId: string, points: number) => Promise<void>;
  awardBadge: (userId: string, badgeId: string) => Promise<void>;
  hasBadge: (badgeId: string) => boolean;
  reset: () => void;
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  totalPoints: 0,
  badges: [],
  loaded: false,

  load: async (userId) => {
    const { data } = await supabase
      .from("user_rewards")
      .select("total_points, badges")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      set({
        totalPoints: data.total_points ?? 0,
        badges: (data.badges as Badge[]) ?? [],
        loaded: true,
      });
    } else {
      set({ loaded: true });
    }
  },

  addPoints: async (userId, points) => {
    const next = get().totalPoints + points;
    set({ totalPoints: next });
    await supabase.from("user_rewards").upsert(
      { user_id: userId, total_points: next, badges: get().badges as unknown as string, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  },

  awardBadge: async (userId, badgeId) => {
    if (get().hasBadge(badgeId)) return;
    const def = BADGE_DEFS[badgeId];
    if (!def) return;
    const badge: Badge = { id: badgeId, ...def, earnedAt: new Date().toISOString() };
    const nextBadges = [...get().badges, badge];
    set({ badges: nextBadges });
    await supabase.from("user_rewards").upsert(
      { user_id: userId, total_points: get().totalPoints, badges: nextBadges as unknown as string, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
    toast.success(`${badge.emoji} Badge earned: ${badge.label}!`, { duration: 4000 });
  },

  hasBadge: (badgeId) => get().badges.some((b) => b.id === badgeId),

  reset: () => set({ totalPoints: 0, badges: [], loaded: false }),
}));
