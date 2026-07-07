import { z } from "zod";

/**
 * Per-plugin config shapes + zod schemas.
 *
 * The schemas are shared by the runtime registry (validate before render)
 * and the seed generator script (validate before write), so generated data
 * and the engine can never drift apart.
 */

export const voicePlayConfigSchema = z.object({
  transcript: z.string().min(1),
});
export type VoicePlayConfig = z.infer<typeof voicePlayConfigSchema>;

export const patientCardConfigSchema = z.object({
  requireConfirm: z.boolean(),
  /** Also require an explicit allergy check before continuing. */
  checkAllergies: z.boolean().optional(),
  /** Decoy identities shown alongside the real patient; confirming one is a
   * wrong-patient error → critical fail. */
  decoys: z
    .array(
      z.object({
        name: z.string().min(1),
        age: z.number().int().positive(),
        gender: z.enum(["Male", "Female"]),
      }),
    )
    .optional(),
});
export type PatientCardConfig = z.infer<typeof patientCardConfigSchema>;

export const equipmentOptionSchema = z.object({
  /** Stable slug, future equipment table row id. */
  id: z.string().min(1),
  label: z.string().min(1),
  correct: z.boolean(),
  /** Wrong-medication/wrong-set class error → critical fail when picked. */
  critical: z.boolean().optional(),
  feedback: z.string().optional(),
});
export type EquipmentOption = z.infer<typeof equipmentOptionSchema>;

export const equipmentSelectConfigSchema = z.object({
  prompt: z.string().min(1),
  options: z.array(equipmentOptionSchema).min(2),
  /** When true, every `correct` option must be placed on the tray. */
  allowMultiple: z.boolean().optional(),
});
export type EquipmentSelectConfig = z.infer<typeof equipmentSelectConfigSchema>;

export const mcqQuestionConfigSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().optional(),
  /** Wrong answer is a wrong-procedure/sterile-technique class error →
   * critical fail. */
  criticalOnWrong: z.boolean().optional(),
});
export type McqQuestionConfig = z.infer<typeof mcqQuestionConfigSchema>;

export const injectionSiteSchema = z.object({
  site: z.string().min(1),
  label: z.string().min(1),
  /** %-coordinates of the drop zone on the 2D body figure. */
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});
export type InjectionSite = z.infer<typeof injectionSiteSchema>;

export const injectionPerformConfigSchema = z.object({
  correctSite: z.enum(["Deltoid", "Vastus Lateralis", "Abdomen"]),
  sites: z.array(injectionSiteSchema).min(2),
  /** Injecting at a wrong site is a wrong-route error → critical fail. */
  criticalOnWrong: z.boolean().optional(),
});
export type InjectionPerformConfig = z.infer<typeof injectionPerformConfigSchema>;

export const timerCountdownConfigSchema = z.object({
  seconds: z.number().int().positive(),
});
export type TimerCountdownConfig = z.infer<typeof timerCountdownConfigSchema>;

export const scoreSummaryConfigSchema = z.object({
  passMarkPct: z.number().min(0).max(100),
});
export type ScoreSummaryConfig = z.infer<typeof scoreSummaryConfigSchema>;
