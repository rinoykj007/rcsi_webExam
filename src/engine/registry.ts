import type React from "react";
import {
  equipmentSelectConfigSchema,
  injectionPerformConfigSchema,
  mcqQuestionConfigSchema,
  patientCardConfigSchema,
  scoreSummaryConfigSchema,
  timerCountdownConfigSchema,
  voicePlayConfigSchema,
} from "./configs";
import type { PluginKey, StepPlugin, StepPluginProps } from "./types";
import { EquipmentSelect } from "./plugins/EquipmentSelect";
import { InjectionPerform } from "./plugins/InjectionPerform";
import { McqQuestion } from "./plugins/McqQuestion";
import { PatientCard } from "./plugins/PatientCard";
import { ScoreSummary } from "./plugins/ScoreSummary";
import { TimerCountdown } from "./plugins/TimerCountdown";
import { VoicePlay } from "./plugins/VoicePlay";

/**
 * Plugin registry — the engine renders steps purely by looking up
 * (plugin_key, plugin_version) here. documentation.form and feedback.show
 * are blueprint keys with no MVP implementation; steps using them are
 * skipped gracefully rather than crashing (forward compatibility with
 * newer station data).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PLUGIN_REGISTRY: Partial<Record<PluginKey, StepPlugin<any>>> = {
  "voice.play": {
    key: "voice.play",
    version: 1,
    Component: VoicePlay,
    configSchema: voicePlayConfigSchema,
  },
  "patient.card": {
    key: "patient.card",
    version: 1,
    Component: PatientCard,
    configSchema: patientCardConfigSchema,
  },
  "equipment.select": {
    key: "equipment.select",
    version: 1,
    Component: EquipmentSelect,
    configSchema: equipmentSelectConfigSchema,
  },
  "mcq.question": {
    key: "mcq.question",
    version: 1,
    Component: McqQuestion,
    configSchema: mcqQuestionConfigSchema,
  },
  "injection.perform": {
    key: "injection.perform",
    version: 1,
    Component: InjectionPerform,
    configSchema: injectionPerformConfigSchema,
  },
  "timer.countdown": {
    key: "timer.countdown",
    version: 1,
    Component: TimerCountdown,
    configSchema: timerCountdownConfigSchema,
  },
  "score.summary": {
    key: "score.summary",
    version: 1,
    Component: ScoreSummary,
    configSchema: scoreSummaryConfigSchema,
  },
};

export const resolvePlugin = (
  key: PluginKey | string,
  version: number,
): StepPlugin<unknown> | null => {
  const plugin = PLUGIN_REGISTRY[key as PluginKey];
  if (!plugin || plugin.version !== version) return null;
  return plugin as StepPlugin<unknown>;
};

export type { StepPlugin, StepPluginProps, PluginKey };
export type StepPluginComponent = React.ComponentType<StepPluginProps>;
