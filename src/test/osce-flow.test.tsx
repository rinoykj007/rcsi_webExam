import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { OsceStation } from "@/engine/types";

const recordResult = vi.fn().mockResolvedValue(undefined);
const toastFns = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: toastFns,
}));

vi.mock("@/hooks/useSpeech", () => ({
  useSpeech: () => ({
    supported: false,
    speaking: false,
    muted: false,
    toggleMute: vi.fn(),
    // Instant advance: voice steps complete synchronously in tests.
    speak: (_text: string, onEnd?: () => void) => onEnd?.(),
    cancel: vi.fn(),
  }),
}));

vi.mock("@/stores/useAuthStore", () => ({
  useAuthStore: (selector: (s: unknown) => unknown) =>
    selector({ user: { id: "uid" }, loading: false }),
}));

vi.mock("@/stores/useProgressStore", () => ({
  useProgressStore: (selector: (s: unknown) => unknown) =>
    selector({ recordResult }),
}));

const fixtureStation: OsceStation = {
  id: "osce-001",
  category: "medication-administration",
  title: "Medication Administration Station 1",
  task: "Select the correct syringe.",
  difficulty: "Easy",
  timeLimitSec: 300,
  patient: { name: "John", age: 23, gender: "Male" },
  steps: [
    {
      id: "osce-001-s0",
      stationId: "osce-001",
      orderIndex: 0,
      pluginKey: "timer.countdown",
      pluginVersion: 1,
      config: { seconds: 300 },
      marksAvailable: 0,
    },
    {
      id: "osce-001-s1",
      stationId: "osce-001",
      orderIndex: 1,
      pluginKey: "voice.play",
      pluginVersion: 1,
      config: { transcript: "Station 1. Select the correct syringe." },
      marksAvailable: 0,
    },
    {
      id: "osce-001-s2",
      stationId: "osce-001",
      orderIndex: 2,
      pluginKey: "patient.card",
      pluginVersion: 1,
      config: { requireConfirm: true },
      marksAvailable: 1,
    },
    {
      id: "osce-001-s3",
      stationId: "osce-001",
      orderIndex: 3,
      pluginKey: "equipment.select",
      pluginVersion: 1,
      config: {
        prompt: "Select the correct equipment",
        options: [
          { id: "syringe_3ml", label: "3 ml Syringe", correct: true },
          {
            id: "insulin_syringe",
            label: "Insulin Syringe",
            correct: false,
            critical: true,
            feedback: "Critical error: wrong syringe type.",
          },
          { id: "bp_cuff", label: "BP Cuff", correct: false },
          { id: "aed", label: "AED", correct: false },
        ],
      },
      marksAvailable: 2,
    },
    {
      id: "osce-001-s4",
      stationId: "osce-001",
      orderIndex: 4,
      pluginKey: "injection.perform",
      pluginVersion: 1,
      config: {
        correctSite: "Deltoid",
        sites: [
          { site: "Deltoid", label: "Deltoid (upper arm)", x: 71, y: 26 },
          { site: "Abdomen", label: "Abdomen", x: 50, y: 44 },
        ],
      },
      marksAvailable: 2,
    },
    {
      id: "osce-001-s5",
      stationId: "osce-001",
      orderIndex: 5,
      pluginKey: "score.summary",
      pluginVersion: 1,
      config: { passMarkPct: 70 },
      marksAvailable: 0,
    },
  ],
};

vi.mock("@/data/osce/loadStations", () => ({
  OSCE_CATALOG: [
    {
      id: "osce-001",
      title: "Medication Administration Station 1",
      category: "medication-administration",
      difficulty: "Easy",
    },
  ],
  getCatalogEntry: (id: string) =>
    id === "osce-001"
      ? {
          id: "osce-001",
          title: "Medication Administration Station 1",
          category: "medication-administration",
          difficulty: "Easy",
        }
      : undefined,
  loadCategoryStations: () => Promise.resolve([fixtureStation]),
  loadStation: (id: string) =>
    Promise.resolve(id === "osce-001" ? fixtureStation : null),
}));

import OsceStationRunner from "@/pages/osce/OsceStationRunner";

const renderRunner = () =>
  render(
    <MemoryRouter initialEntries={["/osce/station/osce-001"]}>
      <Routes>
        <Route path="/osce/station/:stationId" element={<OsceStationRunner />} />
        <Route path="/osce" element={<div>catalog page</div>} />
      </Routes>
    </MemoryRouter>,
  );

/** Plays through timer + voice and confirms patient identity. */
const advanceToEquipment = async () => {
  // timer.countdown flashes for ~1.4s, then the mocked voice step completes
  // instantly, landing on the patient card.
  const confirmBtn = await screen.findByRole(
    "button",
    { name: /confirmed the patient/i },
    { timeout: 4000 },
  );
  fireEvent.click(confirmBtn);
  await screen.findByText(/Select the correct equipment/i);
};

describe("OSCE station flow", () => {
  beforeEach(() => {
    recordResult.mockClear();
    recordResult.mockResolvedValue(undefined);
    toastFns.error.mockClear();
    toastFns.success.mockClear();
    toastFns.warning.mockClear();
  });

  it("runs a full station and records the result once", async () => {
    renderRunner();

    await advanceToEquipment();
    fireEvent.click(screen.getByRole("button", { name: /Select 3 ml Syringe/i }));

    // injection step
    const site = await screen.findByRole("button", {
      name: /Inject at Deltoid/i,
    });
    fireEvent.click(site);

    // score summary: all 5 marks earned → pass
    await screen.findByText(/Station passed/i);
    expect(screen.getByText("5/5 (100%)")).toBeInTheDocument();

    await waitFor(() => expect(recordResult).toHaveBeenCalledTimes(1));
    expect(recordResult).toHaveBeenCalledWith("uid", "oral_drug", 5, 5);
  });

  it("picking the critical distractor causes a critical fail", async () => {
    renderRunner();

    await advanceToEquipment();
    // critical wrong pick first, then the correct item to advance
    fireEvent.click(
      screen.getByRole("button", { name: /Select Insulin Syringe/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Select 3 ml Syringe/i }));

    const site = await screen.findByRole("button", {
      name: /Inject at Deltoid/i,
    });
    fireEvent.click(site);

    await screen.findByText(/Critical error — automatic fail/i);
    await waitFor(() => expect(recordResult).toHaveBeenCalledTimes(1));
    // marks: patient 1 + equipment 0 (wrong first try) + injection 2 = 3
    expect(recordResult).toHaveBeenCalledWith("uid", "oral_drug", 3, 5);
  });

  it("shows an error toast when progress saving fails", async () => {
    recordResult.mockRejectedValueOnce(new Error("save failed"));
    renderRunner();

    await advanceToEquipment();
    fireEvent.click(screen.getByRole("button", { name: /Select 3 ml Syringe/i }));

    const site = await screen.findByRole("button", {
      name: /Inject at Deltoid/i,
    });
    fireEvent.click(site);

    await screen.findByText(/Station passed/i);
    await waitFor(() => expect(recordResult).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(toastFns.error).toHaveBeenCalledWith(
        "Could not save progress. Please try again.",
      ),
    );
    expect(toastFns.success).not.toHaveBeenCalledWith("Progress saved");
  });
});
