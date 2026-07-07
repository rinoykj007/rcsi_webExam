import type { EngineAction, EngineState } from "./types";

export const initialEngineState: EngineState = {
  status: "idle",
  stepIndex: 0,
  results: [],
  criticalFail: false,
  timerTotalSec: null,
  timerStartedAt: null,
};

export const engineReducer = (
  state: EngineState,
  action: EngineAction,
): EngineState => {
  switch (action.type) {
    case "START":
      return { ...initialEngineState, status: "running" };

    case "ARM_TIMER":
      return {
        ...state,
        timerTotalSec: action.seconds,
        timerStartedAt: Date.now(),
      };

    case "STEP_COMPLETE": {
      if (state.status !== "running") return state;
      const results = [...state.results, action.result];
      const criticalFail = state.criticalFail || action.result.critical;
      const nextIndex = state.stepIndex + 1;
      if (nextIndex >= action.totalSteps) {
        return { ...state, results, criticalFail, status: "completed" };
      }
      return { ...state, results, criticalFail, stepIndex: nextIndex };
    }

    case "TIME_UP":
      if (state.status !== "running") return state;
      return { ...state, status: "timedOut", stepIndex: action.summaryIndex };

    case "RESET":
      return { ...initialEngineState, status: "running" };

    default:
      return state;
  }
};
