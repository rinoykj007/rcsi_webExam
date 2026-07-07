import type {
  OsceCategorySlug,
  PluginKey,
  ScoreSummaryResult,
  SkillCategory,
  StepResult,
} from "@/engine/types";

/**
 * Pure aggregation layer for the OSCE progress tracker.
 *
 * Everything here derives from stored attempts — no extra counters to keep
 * in sync. The same functions will run over rows from the future
 * `osce_attempts` table (see supabase/migrations/*_osce_attempts.sql);
 * StoredAttempt is shaped to match it column-for-column.
 */

/** → osce_attempts row. Station title/category denormalised so the
 * dashboard never has to load station chunks. */
export interface StoredAttempt {
  id: string;
  stationId: string;
  stationTitle: string;
  category: OsceCategorySlug;
  startedAt: string;
  finishedAt: string;
  score: ScoreSummaryResult;
  results: StepResult[];
}

/** Granular step labels used in the mistakes list — mirrors STEP_LABELS in
 * score.summary. */
export const SKILL_LABELS: Partial<Record<PluginKey, string>> = {
  "patient.card": "Patient identification",
  "equipment.select": "Equipment & medication safety",
  "mcq.question": "Clinical knowledge",
  "injection.perform": "Injection technique",
  "documentation.form": "Documentation",
};

/** Default skill domain per plugin; a step's explicit `skill` tag wins. */
export const SKILL_CATEGORY_BY_PLUGIN: Partial<
  Record<PluginKey, SkillCategory>
> = {
  "patient.card": "Safety",
  "equipment.select": "Safety",
  "mcq.question": "Clinical Technique",
  "injection.perform": "Clinical Technique",
  "documentation.form": "Documentation",
  "voice.play": "Communication",
};

/** Untagged MCQs in these station categories score their domain, not the
 * generic Clinical Technique default. */
const SKILL_BY_STATION_CATEGORY: Partial<
  Record<OsceCategorySlug, SkillCategory>
> = {
  "patient-communication": "Communication",
  documentation: "Documentation",
};

export interface OverallStats {
  attempts: number;
  stationsTried: number;
  passed: number;
  failed: number;
  averagePct: number;
  streakDays: number;
  practiceMinutes: number;
}

export interface CategoryStat {
  category: OsceCategorySlug;
  attempts: number;
  passed: number;
  averagePct: number;
}

export interface SkillStat {
  skill: string;
  attempts: number;
  averagePct: number;
}

export interface MistakeStat {
  label: string;
  critical: boolean;
  count: number;
}

export interface TrendPoint {
  /** ISO date (Monday) of the week bucket. */
  weekStart: string;
  attempts: number;
  averagePct: number;
}

export interface BadgeStat {
  id: string;
  label: string;
  earned: boolean;
}

export interface Recommendation {
  category: OsceCategorySlug | null;
  skill: string | null;
  lines: string[];
  estimatedMinutes: number;
}

const dayKey = (iso: string) => iso.slice(0, 10);

const avgPct = (attempts: StoredAttempt[]) =>
  attempts.length === 0
    ? 0
    : Math.round(attempts.reduce((s, a) => s + a.score.pct, 0) / attempts.length);

/** Consecutive practice days ending today or yesterday. */
export const computeStreak = (attempts: StoredAttempt[], now = new Date()): number => {
  const days = new Set(attempts.map((a) => dayKey(a.finishedAt)));
  if (days.size === 0) return 0;
  const cursor = new Date(now);
  // A streak survives until a full day is missed, so it may start yesterday.
  if (!days.has(dayKey(cursor.toISOString()))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor.toISOString()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const computeOverall = (
  attempts: StoredAttempt[],
  now = new Date(),
): OverallStats => {
  const passed = attempts.filter((a) => a.score.passed).length;
  const practiceMs = attempts.reduce((s, a) => {
    const ms = new Date(a.finishedAt).getTime() - new Date(a.startedAt).getTime();
    return s + Math.max(0, ms);
  }, 0);
  return {
    attempts: attempts.length,
    stationsTried: new Set(attempts.map((a) => a.stationId)).size,
    passed,
    failed: attempts.length - passed,
    averagePct: avgPct(attempts),
    streakDays: computeStreak(attempts, now),
    practiceMinutes: Math.round(practiceMs / 60_000),
  };
};

export const computeCategoryStats = (attempts: StoredAttempt[]): CategoryStat[] => {
  const byCategory = new Map<OsceCategorySlug, StoredAttempt[]>();
  attempts.forEach((a) => {
    byCategory.set(a.category, [...(byCategory.get(a.category) ?? []), a]);
  });
  return [...byCategory.entries()]
    .map(([category, list]) => ({
      category,
      attempts: list.length,
      passed: list.filter((a) => a.score.passed).length,
      averagePct: avgPct(list),
    }))
    .sort((a, b) => a.averagePct - b.averagePct);
};

export const computeSkillStats = (attempts: StoredAttempt[]): SkillStat[] => {
  const bySkill = new Map<string, { awarded: number; available: number; n: number }>();
  attempts.forEach((a) =>
    a.results.forEach((r) => {
      const skill =
        r.skill ??
        (r.pluginKey === "mcq.question"
          ? SKILL_BY_STATION_CATEGORY[a.category]
          : undefined) ??
        SKILL_CATEGORY_BY_PLUGIN[r.pluginKey];
      if (!skill || r.marksAvailable === 0) return;
      const acc = bySkill.get(skill) ?? { awarded: 0, available: 0, n: 0 };
      acc.awarded += r.marksAwarded;
      acc.available += r.marksAvailable;
      acc.n += 1;
      bySkill.set(skill, acc);
    }),
  );
  const stats: SkillStat[] = [...bySkill.entries()].map(
    ([skill, { awarded, available, n }]) => ({
      skill,
      attempts: n,
      averagePct: available === 0 ? 0 : Math.round((awarded / available) * 100),
    }),
  );
  // Time Management is attempt-level: the share of runs finished in time.
  if (attempts.length > 0) {
    const onTime = attempts.filter((a) => !a.score.timedOut).length;
    stats.push({
      skill: "Time Management",
      attempts: attempts.length,
      averagePct: Math.round((onTime / attempts.length) * 100),
    });
  }
  return stats.sort((a, b) => a.averagePct - b.averagePct);
};

export const computeMistakes = (attempts: StoredAttempt[]): MistakeStat[] => {
  const counts = new Map<string, MistakeStat>();
  attempts.forEach((a) =>
    a.results.forEach((r) => {
      const lostMarks = r.marksAwarded < r.marksAvailable;
      if (!lostMarks && !r.critical) return;
      const skill = SKILL_LABELS[r.pluginKey] ?? r.pluginKey;
      const label = r.critical ? `Critical error — ${skill}` : skill;
      const existing = counts.get(label);
      if (existing) existing.count += 1;
      else counts.set(label, { label, critical: r.critical, count: 1 });
    }),
  );
  return [...counts.values()].sort(
    (a, b) => Number(b.critical) - Number(a.critical) || b.count - a.count,
  );
};

const mondayOf = (iso: string): string => {
  const d = new Date(`${dayKey(iso)}T00:00:00Z`);
  const shift = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - shift);
  return dayKey(d.toISOString());
};

/** Weekly average score, oldest week first, last `weeks` buckets with data. */
export const computeTrend = (attempts: StoredAttempt[], weeks = 4): TrendPoint[] => {
  const byWeek = new Map<string, StoredAttempt[]>();
  attempts.forEach((a) => {
    const key = mondayOf(a.finishedAt);
    byWeek.set(key, [...(byWeek.get(key) ?? []), a]);
  });
  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-weeks)
    .map(([weekStart, list]) => ({
      weekStart,
      attempts: list.length,
      averagePct: avgPct(list),
    }));
};

export const computeBadges = (
  attempts: StoredAttempt[],
  now = new Date(),
): BadgeStat[] => {
  const overall = computeOverall(attempts, now);
  const bestCategory = computeCategoryStats(attempts)
    .filter((c) => c.passed >= 5)
    .sort((a, b) => b.averagePct - a.averagePct)[0];
  return [
    { id: "first-station", label: "First station", earned: overall.attempts >= 1 },
    { id: "ten-stations", label: "10 stations completed", earned: overall.attempts >= 10 },
    { id: "fifty-stations", label: "50 stations completed", earned: overall.attempts >= 50 },
    {
      id: "perfect-score",
      label: "Perfect score",
      earned: attempts.some((a) => a.score.passed && a.score.pct === 100),
    },
    { id: "streak-5", label: "5 day streak", earned: overall.streakDays >= 5 },
    {
      id: "category-expert",
      label: "Category expert",
      earned: bestCategory !== undefined && bestCategory.averagePct >= 80,
    },
  ];
};

/** Turns the weakest category + skill into a concrete daily study plan. */
export const computeRecommendation = (attempts: StoredAttempt[]): Recommendation => {
  if (attempts.length === 0) {
    return {
      category: null,
      skill: null,
      lines: ["Run your first OSCE station to unlock a personalised plan."],
      estimatedMinutes: 10,
    };
  }
  const weakestCategory = computeCategoryStats(attempts)[0] ?? null;
  const weakestSkill = computeSkillStats(attempts)[0] ?? null;
  const lines: string[] = [];
  let minutes = 0;
  if (weakestCategory) {
    lines.push(
      `Practice 2 ${categoryLabel(weakestCategory.category)} stations (current average ${weakestCategory.averagePct}%)`,
    );
    minutes += 20;
  }
  if (weakestSkill) {
    lines.push(`Review the ${weakestSkill.skill.toLowerCase()} checklist before you start`);
    minutes += 5;
  }
  return {
    category: weakestCategory?.category ?? null,
    skill: weakestSkill?.skill ?? null,
    lines,
    estimatedMinutes: minutes,
  };
};

/** Local label fallback so the stats layer stays free of UI imports. */
export const categoryLabel = (slug: OsceCategorySlug): string =>
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
