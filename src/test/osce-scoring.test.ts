import { describe, expect, it } from "vitest";
import { computeScore } from "@/engine/scoring";
import type { StepResult } from "@/engine/types";

const r = (
  marksAwarded: number,
  marksAvailable: number,
  critical = false,
): StepResult => ({
  stepId: "s",
  pluginKey: "mcq.question",
  marksAwarded,
  marksAvailable,
  critical,
  completed: true,
});

const opts = { timedOut: false, passMarkPct: 70 };

describe("computeScore", () => {
  it("passes at exactly the pass mark", () => {
    const score = computeScore([r(7, 10)], opts);
    expect(score.pct).toBe(70);
    expect(score.passed).toBe(true);
  });

  it("fails just below the pass mark", () => {
    const score = computeScore([r(69, 100)], opts);
    expect(score.pct).toBe(69);
    expect(score.passed).toBe(false);
  });

  it("critical error fails the attempt even at 100%", () => {
    const score = computeScore([r(5, 5, true), r(5, 5)], opts);
    expect(score.pct).toBe(100);
    expect(score.criticalFail).toBe(true);
    expect(score.passed).toBe(false);
  });

  it("timeout preserves earned marks but cannot pass", () => {
    const score = computeScore([r(8, 10)], { ...opts, timedOut: true });
    expect(score.marksAwarded).toBe(8);
    expect(score.pct).toBe(80);
    expect(score.timedOut).toBe(true);
    expect(score.passed).toBe(false);
  });

  it("handles zero available marks without dividing by zero", () => {
    const score = computeScore([r(0, 0)], opts);
    expect(score.pct).toBe(0);
    expect(score.passed).toBe(false);
  });
});
