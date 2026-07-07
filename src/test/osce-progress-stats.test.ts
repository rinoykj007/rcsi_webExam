import { describe, expect, it } from "vitest";
import {
  computeBadges,
  computeCategoryStats,
  computeMistakes,
  computeOverall,
  computeRecommendation,
  computeSkillStats,
  computeStreak,
  computeTrend,
  type StoredAttempt,
} from "@/lib/osceProgressStats";
import type {
  OsceCategorySlug,
  PluginKey,
  SkillCategory,
  StepResult,
} from "@/engine/types";

const step = (
  pluginKey: PluginKey,
  marksAwarded: number,
  marksAvailable: number,
  critical = false,
  skill?: SkillCategory,
): StepResult => ({
  stepId: `s-${pluginKey}`,
  pluginKey,
  marksAwarded,
  marksAvailable,
  critical,
  completed: true,
  skill,
});

let seq = 0;
const attempt = (over: {
  category?: OsceCategorySlug;
  pct?: number;
  passed?: boolean;
  finishedAt?: string;
  durationMin?: number;
  results?: StepResult[];
  stationId?: string;
  criticalFail?: boolean;
  timedOut?: boolean;
}): StoredAttempt => {
  const finishedAt = over.finishedAt ?? "2026-07-07T10:00:00.000Z";
  const durationMin = over.durationMin ?? 8;
  const pct = over.pct ?? 80;
  return {
    id: `a${seq++}`,
    stationId: over.stationId ?? "st-1",
    stationTitle: "IM Injection",
    category: over.category ?? "medication-administration",
    startedAt: new Date(
      new Date(finishedAt).getTime() - durationMin * 60_000,
    ).toISOString(),
    finishedAt,
    score: {
      marksAwarded: pct,
      marksAvailable: 100,
      pct,
      criticalFail: over.criticalFail ?? false,
      timedOut: over.timedOut ?? false,
      passed: over.passed ?? pct >= 70,
    },
    results: over.results ?? [],
  };
};

const NOW = new Date("2026-07-07T12:00:00.000Z");

describe("computeOverall", () => {
  it("returns zeros with no attempts", () => {
    const o = computeOverall([], NOW);
    expect(o.attempts).toBe(0);
    expect(o.averagePct).toBe(0);
    expect(o.streakDays).toBe(0);
  });

  it("aggregates pass/fail, unique stations and practice time", () => {
    const o = computeOverall(
      [
        attempt({ pct: 90, stationId: "st-1", durationMin: 10 }),
        attempt({ pct: 50, stationId: "st-1", durationMin: 5 }),
        attempt({ pct: 70, stationId: "st-2", durationMin: 6 }),
      ],
      NOW,
    );
    expect(o.attempts).toBe(3);
    expect(o.stationsTried).toBe(2);
    expect(o.passed).toBe(2);
    expect(o.failed).toBe(1);
    expect(o.averagePct).toBe(70);
    expect(o.practiceMinutes).toBe(21);
  });
});

describe("computeStreak", () => {
  it("counts consecutive days ending today", () => {
    const streak = computeStreak(
      [
        attempt({ finishedAt: "2026-07-07T09:00:00.000Z" }),
        attempt({ finishedAt: "2026-07-06T09:00:00.000Z" }),
        attempt({ finishedAt: "2026-07-05T09:00:00.000Z" }),
        attempt({ finishedAt: "2026-07-02T09:00:00.000Z" }),
      ],
      NOW,
    );
    expect(streak).toBe(3);
  });

  it("keeps the streak alive when today has no practice yet", () => {
    const streak = computeStreak(
      [attempt({ finishedAt: "2026-07-06T09:00:00.000Z" })],
      NOW,
    );
    expect(streak).toBe(1);
  });

  it("resets after a missed day", () => {
    const streak = computeStreak(
      [attempt({ finishedAt: "2026-07-04T09:00:00.000Z" })],
      NOW,
    );
    expect(streak).toBe(0);
  });
});

describe("computeCategoryStats", () => {
  it("averages per category, weakest first", () => {
    const stats = computeCategoryStats([
      attempt({ category: "vital-signs", pct: 90 }),
      attempt({ category: "cannulation", pct: 30 }),
      attempt({ category: "cannulation", pct: 50 }),
    ]);
    expect(stats[0]).toMatchObject({
      category: "cannulation",
      attempts: 2,
      averagePct: 40,
    });
    expect(stats[1]).toMatchObject({ category: "vital-signs", averagePct: 90 });
  });
});

describe("computeSkillStats", () => {
  it("groups step marks into skill domains and ignores zero-mark steps", () => {
    const stats = computeSkillStats([
      attempt({
        results: [
          step("patient.card", 2, 2),
          step("documentation.form", 1, 4),
          step("timer.countdown", 0, 0),
        ],
      }),
      attempt({ results: [step("documentation.form", 3, 4)] }),
    ]);
    expect(stats[0]).toMatchObject({ skill: "Documentation", averagePct: 50 });
    expect(stats.find((s) => s.skill === "Safety")).toMatchObject({
      averagePct: 100,
    });
    expect(stats.find((s) => s.skill.includes("timer"))).toBeUndefined();
  });

  it("prefers a step's explicit skill tag over the plugin default", () => {
    const stats = computeSkillStats([
      attempt({
        results: [step("mcq.question", 1, 2, false, "Communication")],
      }),
    ]);
    expect(stats.find((s) => s.skill === "Communication")).toMatchObject({
      averagePct: 50,
    });
    expect(stats.find((s) => s.skill === "Clinical Technique")).toBeUndefined();
  });

  it("scores untagged MCQs in communication stations as Communication", () => {
    const stats = computeSkillStats([
      attempt({
        category: "patient-communication",
        results: [step("mcq.question", 2, 2)],
      }),
    ]);
    expect(stats.find((s) => s.skill === "Communication")).toMatchObject({
      averagePct: 100,
    });
  });

  it("derives Time Management from the share of runs finished in time", () => {
    const stats = computeSkillStats([
      attempt({}),
      attempt({}),
      attempt({ timedOut: true, passed: false }),
      attempt({ timedOut: true, passed: false }),
    ]);
    expect(stats.find((s) => s.skill === "Time Management")).toMatchObject({
      attempts: 4,
      averagePct: 50,
    });
  });
});

describe("computeMistakes", () => {
  it("counts lost-mark steps and ranks critical errors first", () => {
    const mistakes = computeMistakes([
      attempt({ results: [step("documentation.form", 1, 4)] }),
      attempt({ results: [step("documentation.form", 2, 4)] }),
      attempt({ results: [step("equipment.select", 0, 2, true)] }),
      attempt({ results: [step("patient.card", 2, 2)] }),
    ]);
    expect(mistakes[0]).toMatchObject({ critical: true, count: 1 });
    expect(mistakes[0].label).toContain("Critical error");
    expect(mistakes[1]).toMatchObject({ label: "Documentation", count: 2 });
    expect(mistakes).toHaveLength(2);
  });
});

describe("computeTrend", () => {
  it("buckets by ISO week, oldest first", () => {
    const trend = computeTrend([
      attempt({ finishedAt: "2026-06-23T09:00:00.000Z", pct: 60 }), // week of Jun 22
      attempt({ finishedAt: "2026-06-25T09:00:00.000Z", pct: 80 }),
      attempt({ finishedAt: "2026-07-01T09:00:00.000Z", pct: 90 }), // week of Jun 29
    ]);
    expect(trend).toHaveLength(2);
    expect(trend[0]).toMatchObject({ weekStart: "2026-06-22", averagePct: 70 });
    expect(trend[1]).toMatchObject({ weekStart: "2026-06-29", averagePct: 90 });
  });
});

describe("computeBadges", () => {
  it("earns first-station and perfect-score", () => {
    const badges = computeBadges(
      [attempt({ pct: 100, passed: true })],
      NOW,
    );
    const byId = Object.fromEntries(badges.map((b) => [b.id, b.earned]));
    expect(byId["first-station"]).toBe(true);
    expect(byId["perfect-score"]).toBe(true);
    expect(byId["ten-stations"]).toBe(false);
  });

  it("does not award perfect-score for a 100% critical fail", () => {
    const badges = computeBadges(
      [attempt({ pct: 100, passed: false, criticalFail: true })],
      NOW,
    );
    expect(badges.find((b) => b.id === "perfect-score")?.earned).toBe(false);
  });
});

describe("computeRecommendation", () => {
  it("targets the weakest category and skill", () => {
    const plan = computeRecommendation([
      attempt({ category: "cannulation", pct: 40, results: [step("documentation.form", 1, 4)] }),
      attempt({ category: "vital-signs", pct: 90, results: [step("patient.card", 2, 2)] }),
    ]);
    expect(plan.category).toBe("cannulation");
    expect(plan.skill).toBe("Documentation");
    expect(plan.estimatedMinutes).toBe(25);
    expect(plan.lines.some((l) => l.includes("Cannulation"))).toBe(true);
  });

  it("falls back to an onboarding message with no attempts", () => {
    const plan = computeRecommendation([]);
    expect(plan.category).toBeNull();
    expect(plan.lines).toHaveLength(1);
  });
});
