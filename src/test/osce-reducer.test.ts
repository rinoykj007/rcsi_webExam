import { describe, expect, it } from "vitest";
import { engineReducer, initialEngineState } from "@/engine/engineReducer";
import type { EngineState, StepResult } from "@/engine/types";

const result = (overrides: Partial<StepResult> = {}): StepResult => ({
  stepId: "s1",
  pluginKey: "mcq.question",
  marksAwarded: 2,
  marksAvailable: 2,
  critical: false,
  completed: true,
  ...overrides,
});

const running: EngineState = { ...initialEngineState, status: "running" };

describe("engineReducer", () => {
  it("START moves idle → running with a clean slate", () => {
    const state = engineReducer(initialEngineState, { type: "START" });
    expect(state.status).toBe("running");
    expect(state.results).toEqual([]);
    expect(state.stepIndex).toBe(0);
  });

  it("ARM_TIMER sets the timer fields", () => {
    const state = engineReducer(running, { type: "ARM_TIMER", seconds: 300 });
    expect(state.timerTotalSec).toBe(300);
    expect(state.timerStartedAt).toBeTypeOf("number");
  });

  it("STEP_COMPLETE appends the result and advances", () => {
    const state = engineReducer(running, {
      type: "STEP_COMPLETE",
      result: result(),
      totalSteps: 3,
      summaryIndex: 2,
    });
    expect(state.results).toHaveLength(1);
    expect(state.stepIndex).toBe(1);
    expect(state.status).toBe("running");
  });

  it("a critical result latches criticalFail across later steps", () => {
    let state = engineReducer(running, {
      type: "STEP_COMPLETE",
      result: result({ critical: true, marksAwarded: 0 }),
      totalSteps: 3,
      summaryIndex: 2,
    });
    state = engineReducer(state, {
      type: "STEP_COMPLETE",
      result: result({ stepId: "s2" }),
      totalSteps: 3,
      summaryIndex: 2,
    });
    expect(state.criticalFail).toBe(true);
  });

  it("completing the last step sets status completed", () => {
    const state = engineReducer(
      { ...running, stepIndex: 2 },
      { type: "STEP_COMPLETE", result: result(), totalSteps: 3, summaryIndex: 2 },
    );
    expect(state.status).toBe("completed");
    expect(state.stepIndex).toBe(2);
  });

  it("TIME_UP jumps to the summary step with timedOut status", () => {
    const state = engineReducer(
      { ...running, stepIndex: 1 },
      { type: "TIME_UP", summaryIndex: 5 },
    );
    expect(state.status).toBe("timedOut");
    expect(state.stepIndex).toBe(5);
  });

  it("TIME_UP after completion is a no-op", () => {
    const done: EngineState = { ...running, status: "completed" };
    expect(engineReducer(done, { type: "TIME_UP", summaryIndex: 5 })).toBe(done);
  });

  it("STEP_COMPLETE while not running is a no-op", () => {
    const timedOut: EngineState = { ...running, status: "timedOut" };
    const state = engineReducer(timedOut, {
      type: "STEP_COMPLETE",
      result: result(),
      totalSteps: 3,
      summaryIndex: 2,
    });
    expect(state).toBe(timedOut);
  });

  it("RESET returns to a running clean slate", () => {
    const dirty: EngineState = {
      status: "completed",
      stepIndex: 4,
      results: [result()],
      criticalFail: true,
      timerTotalSec: 300,
      timerStartedAt: 123,
    };
    const state = engineReducer(dirty, { type: "RESET" });
    expect(state).toEqual({ ...initialEngineState, status: "running" });
  });
});
