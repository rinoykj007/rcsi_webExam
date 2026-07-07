import type React from "react";
import type { z } from "zod";
import type { useSpeech } from "@/hooks/useSpeech";

/**
 * Core contracts for the OSCE station engine.
 *
 * These types map 1:1 onto the planned Supabase tables from the
 * OSCE Engine blueprint (stations, patients, station_steps, equipment,
 * checklist, attempts) so the static-seed phase can migrate to the DB
 * without reshaping data.
 */

/** Full blueprint plugin enum; the MVP registry implements 7 of these. */
export type PluginKey =
  | "voice.play"
  | "patient.card"
  | "equipment.select"
  | "mcq.question"
  | "injection.perform"
  | "documentation.form"
  | "timer.countdown"
  | "feedback.show"
  | "score.summary";

export type OsceDifficulty = "Easy" | "Medium" | "Hard";

/** Exam skill domains scored on the progress dashboard. */
export type SkillCategory =
  | "Communication"
  | "Safety"
  | "Clinical Technique"
  | "Documentation"
  | "Time Management";

export type OsceCategorySlug =
  | "medication-administration"
  | "vital-signs"
  | "cannulation"
  | "wound-dressing"
  | "catheterization"
  | "blood-transfusion"
  | "iv-medication"
  | "patient-communication"
  | "emergency-response"
  | "documentation";

/** → patients table */
export interface OscePatient {
  name: string;
  age: number;
  gender: "Male" | "Female";
  weightKg?: number;
  diagnosis?: string;
  prescription?: string;
  allergies?: string;
  history?: string;
}

/** → station_steps table ({plugin_key, plugin_version, config jsonb}) */
export interface OsceStep<C = unknown> {
  id: string;
  stationId: string;
  orderIndex: number;
  pluginKey: PluginKey;
  pluginVersion: number;
  config: C;
  /** Checklist analog this phase; splits into the checklist table later. */
  marksAvailable: number;
  /** Skill domain this step scores toward; overrides the plugin default. */
  skill?: SkillCategory;
}

/** → stations table */
export interface OsceStation {
  id: string;
  category: OsceCategorySlug;
  title: string;
  task: string;
  difficulty: OsceDifficulty;
  timeLimitSec: number;
  patient: OscePatient;
  steps: OsceStep[];
}

/** Light index entry for the catalog page. */
export interface OsceCatalogEntry {
  id: string;
  title: string;
  category: OsceCategorySlug;
  difficulty: OsceDifficulty;
}

/** → attempts.answers jsonb element */
export interface StepResult {
  stepId: string;
  pluginKey: PluginKey;
  marksAwarded: number;
  marksAvailable: number;
  critical: boolean;
  completed: boolean;
  /** Stamped by the engine from the step's skill tag. */
  skill?: SkillCategory;
  /** Seconds spent on this step, stamped by the engine. */
  timeTakenSec?: number;
  detail?: Record<string, unknown>;
}

export interface ScoreSummaryResult {
  marksAwarded: number;
  marksAvailable: number;
  pct: number;
  criticalFail: boolean;
  timedOut: boolean;
  passed: boolean;
}

/** → attempts table (not persisted this phase) */
export interface OsceAttempt {
  stationId: string;
  startedAt: string;
  finishedAt: string;
  results: StepResult[];
  score: ScoreSummaryResult;
}

export type EngineStatus = "idle" | "running" | "completed" | "timedOut";

export interface EngineState {
  status: EngineStatus;
  stepIndex: number;
  results: StepResult[];
  criticalFail: boolean;
  timerTotalSec: number | null;
  timerStartedAt: number | null;
}

export type EngineAction =
  | { type: "START" }
  | { type: "ARM_TIMER"; seconds: number }
  | { type: "STEP_COMPLETE"; result: StepResult; totalSteps: number; summaryIndex: number }
  | { type: "TIME_UP"; summaryIndex: number }
  | { type: "RESET" };

export type StepCompletion = Omit<
  StepResult,
  "stepId" | "pluginKey" | "skill" | "timeTakenSec"
>;

export interface StepPluginProps<C = unknown> {
  step: OsceStep<C>;
  station: OsceStation;
  /** Read-only results so far; score.summary renders the checklist from it. */
  results: StepResult[];
  remainingSec: number | null;
  engineStatus: EngineStatus;
  speech: ReturnType<typeof useSpeech>;
  onComplete: (result: StepCompletion) => void;
  onArmTimer: (seconds: number) => void;
  onRestart: () => void;
}

export interface StepPlugin<C = unknown> {
  key: PluginKey;
  version: number;
  Component: React.ComponentType<StepPluginProps<C>>;
  configSchema: z.ZodType<C>;
}
