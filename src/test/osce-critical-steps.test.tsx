import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OsceEngine } from "@/engine/OsceEngine";
import { McqQuestion } from "@/engine/plugins/McqQuestion";
import { PatientCard } from "@/engine/plugins/PatientCard";
import { InjectionPerform } from "@/engine/plugins/InjectionPerform";
import type {
  OsceAttempt,
  OsceStation,
  OsceStep,
  PluginKey,
  SkillCategory,
  StepPluginProps,
} from "@/engine/types";

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}));

vi.mock("@/hooks/useSpeech", () => ({
  useSpeech: () => ({
    supported: false,
    speaking: false,
    muted: false,
    toggleMute: vi.fn(),
    speak: (_text: string, onEnd?: () => void) => onEnd?.(),
    cancel: vi.fn(),
  }),
}));

const mkStep = (
  pluginKey: PluginKey,
  config: unknown,
  marksAvailable: number,
  skill?: SkillCategory,
  orderIndex = 0,
): OsceStep => ({
  id: `st-1-s${orderIndex}`,
  stationId: "st-1",
  orderIndex,
  pluginKey,
  pluginVersion: 1,
  config,
  marksAvailable,
  skill,
});

const mkStation = (steps: OsceStep[]): OsceStation => ({
  id: "st-1",
  category: "medication-administration",
  title: "Test Station",
  task: "Do the thing safely.",
  difficulty: "Easy",
  timeLimitSec: 300,
  patient: { name: "John Smith", age: 52, gender: "Male" },
  steps,
});

const pluginProps = (
  step: OsceStep,
  onComplete: ReturnType<typeof vi.fn>,
): StepPluginProps => ({
  step,
  station: mkStation([step]),
  results: [],
  remainingSec: null,
  engineStatus: "running",
  speech: {} as never,
  onComplete,
  onArmTimer: vi.fn(),
  onRestart: vi.fn(),
});

describe("mcq.question criticalOnWrong", () => {
  const config = {
    question: "Recap the needle?",
    options: ["Yes", "No"],
    correctIndex: 1,
    criticalOnWrong: true,
  };

  it("flags a wrong answer as critical", () => {
    const onComplete = vi.fn();
    const step = mkStep("mcq.question", config, 2);
    render(<McqQuestion {...(pluginProps(step, onComplete) as never)} />);

    fireEvent.click(screen.getByRole("radio", { name: "Yes" }));
    fireEvent.click(screen.getByRole("button", { name: /Submit answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ marksAwarded: 0, critical: true }),
    );
  });

  it("keeps wrong answers non-critical without the flag", () => {
    const onComplete = vi.fn();
    const step = mkStep("mcq.question", { ...config, criticalOnWrong: undefined }, 2);
    render(<McqQuestion {...(pluginProps(step, onComplete) as never)} />);

    fireEvent.click(screen.getByRole("radio", { name: "Yes" }));
    fireEvent.click(screen.getByRole("button", { name: /Submit answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ marksAwarded: 0, critical: false }),
    );
  });
});

describe("patient.card decoys", () => {
  const config = {
    requireConfirm: true,
    decoys: [{ name: "Jane Doe", age: 47, gender: "Female" as const }],
  };

  it("confirming a decoy wristband is a critical wrong-patient fail", () => {
    const onComplete = vi.fn();
    const step = mkStep("patient.card", config, 2);
    render(<PatientCard {...(pluginProps(step, onComplete) as never)} />);

    fireEvent.click(screen.getByRole("button", { name: /Jane Doe/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        marksAwarded: 0,
        critical: true,
        detail: { wrongPatient: "Jane Doe" },
      }),
    );
  });

  it("confirming the real patient earns the marks", () => {
    const onComplete = vi.fn();
    const step = mkStep("patient.card", config, 2);
    render(<PatientCard {...(pluginProps(step, onComplete) as never)} />);

    fireEvent.click(screen.getByRole("button", { name: /John Smith/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ marksAwarded: 2, critical: false }),
    );
  });
});

describe("injection.perform criticalOnWrong", () => {
  const config = {
    correctSite: "Deltoid",
    criticalOnWrong: true,
    sites: [
      { site: "Deltoid", label: "Deltoid (upper arm)", x: 71, y: 26 },
      { site: "Abdomen", label: "Abdomen", x: 50, y: 44 },
    ],
  };

  it("latches a wrong-route critical fail after a wrong site", () => {
    const onComplete = vi.fn();
    const step = mkStep("injection.perform", config, 2);
    render(<InjectionPerform {...(pluginProps(step, onComplete) as never)} />);

    fireEvent.click(screen.getByRole("button", { name: /Inject at Abdomen/i }));
    fireEvent.click(screen.getByRole("button", { name: /Inject at Deltoid/i }));

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ marksAwarded: 0, critical: true }),
    );
  });
});

describe("engine result stamping", () => {
  it("stamps timeTakenSec and the step's skill tag onto each result", async () => {
    const onFinish = vi.fn<(attempt: OsceAttempt) => void>();
    const station = mkStation([
      mkStep(
        "mcq.question",
        { question: "Q?", options: ["A", "B"], correctIndex: 0 },
        2,
        "Communication",
        0,
      ),
      mkStep("score.summary", { passMarkPct: 70 }, 0, undefined, 1),
    ]);

    render(
      <MemoryRouter>
        <OsceEngine station={station} onFinish={onFinish} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: /Submit answer/i }));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    const attempt = onFinish.mock.calls[0][0];
    const mcqResult = attempt.results.find((r) => r.pluginKey === "mcq.question")!;
    expect(mcqResult.skill).toBe("Communication");
    expect(typeof mcqResult.timeTakenSec).toBe("number");
    expect(mcqResult.timeTakenSec).toBeGreaterThanOrEqual(0);
  });
});
