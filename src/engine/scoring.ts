import type { ScoreSummaryResult, StepResult } from "./types";

export const DEFAULT_PASS_MARK_PCT = 70;

/**
 * Blueprint scoring rules, MVP form:
 * - marks are summed across step results;
 * - any critical error (wrong patient/medication/set) fails the attempt
 *   regardless of marks;
 * - a timed-out attempt keeps the marks earned so far but cannot pass.
 */
export const computeScore = (
  results: StepResult[],
  opts: { timedOut: boolean; passMarkPct: number },
): ScoreSummaryResult => {
  const marksAwarded = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const marksAvailable = results.reduce((sum, r) => sum + r.marksAvailable, 0);
  const pct =
    marksAvailable === 0 ? 0 : Math.round((marksAwarded / marksAvailable) * 100);
  const criticalFail = results.some((r) => r.critical);
  return {
    marksAwarded,
    marksAvailable,
    pct,
    criticalFail,
    timedOut: opts.timedOut,
    passed: pct >= opts.passMarkPct && !criticalFail && !opts.timedOut,
  };
};
