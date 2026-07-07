import { beforeEach, describe, expect, it } from "vitest";
import { useOsceAttemptStore } from "@/stores/useOsceAttemptStore";
import type { OsceAttempt, OsceStation } from "@/engine/types";

const station: OsceStation = {
  id: "st-1",
  category: "medication-administration",
  title: "Station 1 — Oral Medication",
  task: "Administer the prescribed oral medication safely.",
  difficulty: "Easy",
  timeLimitSec: 480,
  patient: { name: "John Smith", age: 52, gender: "Male" },
  steps: [],
};

const attempt: OsceAttempt = {
  stationId: "st-1",
  startedAt: "2026-07-07T10:00:00.000Z",
  finishedAt: "2026-07-07T10:08:00.000Z",
  results: [],
  score: {
    marksAwarded: 8,
    marksAvailable: 10,
    pct: 80,
    criticalFail: false,
    timedOut: false,
    passed: true,
  },
};

describe("useOsceAttemptStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useOsceAttemptStore.setState({ attempts: [], loadedFor: null });
  });

  it("records an attempt with denormalised station info", () => {
    const stored = useOsceAttemptStore
      .getState()
      .recordAttempt("user-1", station, attempt);
    expect(stored.stationTitle).toBe(station.title);
    expect(stored.category).toBe("medication-administration");
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(1);
  });

  it("persists per user and reloads from storage", () => {
    useOsceAttemptStore.getState().recordAttempt("user-1", station, attempt);
    useOsceAttemptStore.setState({ attempts: [], loadedFor: null });

    useOsceAttemptStore.getState().load("user-1");
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(1);

    useOsceAttemptStore.getState().load("user-2");
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(0);
  });

  it("keeps guest attempts separate from user attempts", () => {
    useOsceAttemptStore.getState().recordAttempt(null, station, attempt);
    useOsceAttemptStore.getState().load("user-1");
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(0);
    useOsceAttemptStore.getState().load(null);
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(1);
  });

  it("survives corrupted storage", () => {
    localStorage.setItem("osce-attempts:user-1", "{not json");
    useOsceAttemptStore.getState().load("user-1");
    expect(useOsceAttemptStore.getState().attempts).toEqual([]);
  });

  it("clear wipes memory and storage", () => {
    useOsceAttemptStore.getState().recordAttempt("user-1", station, attempt);
    useOsceAttemptStore.getState().clear("user-1");
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(0);
    useOsceAttemptStore.getState().load("user-1");
    expect(useOsceAttemptStore.getState().attempts).toHaveLength(0);
  });
});
