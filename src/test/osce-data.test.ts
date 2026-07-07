import { describe, expect, it } from "vitest";
import type { z } from "zod";
import catalog from "@/data/osce/catalog.json";
import medicationAdministration from "@/data/osce/stations/medication-administration.json";
import vitalSigns from "@/data/osce/stations/vital-signs.json";
import cannulation from "@/data/osce/stations/cannulation.json";
import woundDressing from "@/data/osce/stations/wound-dressing.json";
import catheterization from "@/data/osce/stations/catheterization.json";
import bloodTransfusion from "@/data/osce/stations/blood-transfusion.json";
import ivMedication from "@/data/osce/stations/iv-medication.json";
import patientCommunication from "@/data/osce/stations/patient-communication.json";
import emergencyResponse from "@/data/osce/stations/emergency-response.json";
import documentation from "@/data/osce/stations/documentation.json";
import {
  equipmentSelectConfigSchema,
  injectionPerformConfigSchema,
  mcqQuestionConfigSchema,
  patientCardConfigSchema,
  scoreSummaryConfigSchema,
  timerCountdownConfigSchema,
  voicePlayConfigSchema,
  type EquipmentSelectConfig,
} from "@/engine/configs";
import { OSCE_CATEGORIES } from "@/data/osce/categories";
import type { OsceStation, PluginKey } from "@/engine/types";

const CHUNKS: Record<string, OsceStation[]> = {
  "medication-administration": medicationAdministration as OsceStation[],
  "vital-signs": vitalSigns as OsceStation[],
  cannulation: cannulation as OsceStation[],
  "wound-dressing": woundDressing as OsceStation[],
  catheterization: catheterization as OsceStation[],
  "blood-transfusion": bloodTransfusion as OsceStation[],
  "iv-medication": ivMedication as OsceStation[],
  "patient-communication": patientCommunication as OsceStation[],
  "emergency-response": emergencyResponse as OsceStation[],
  documentation: documentation as OsceStation[],
};

const SCHEMAS: Partial<Record<PluginKey, z.ZodTypeAny>> = {
  "voice.play": voicePlayConfigSchema,
  "patient.card": patientCardConfigSchema,
  "equipment.select": equipmentSelectConfigSchema,
  "mcq.question": mcqQuestionConfigSchema,
  "injection.perform": injectionPerformConfigSchema,
  "timer.countdown": timerCountdownConfigSchema,
  "score.summary": scoreSummaryConfigSchema,
};

const allStations = Object.values(CHUNKS).flat();

describe("generated OSCE seed data", () => {
  it("catalog has 500 entries: 10 categories × 50", () => {
    expect(catalog).toHaveLength(500);
    for (const meta of OSCE_CATEGORIES) {
      expect(catalog.filter((e) => e.category === meta.slug)).toHaveLength(50);
    }
  });

  it("every catalog entry has a station in its category chunk", () => {
    for (const entry of catalog) {
      const station = CHUNKS[entry.category]?.find((s) => s.id === entry.id);
      expect(station, entry.id).toBeDefined();
    }
  });

  it("steps are order-contiguous, start with timer.countdown, end with score.summary", () => {
    for (const station of allStations) {
      station.steps.forEach((step, i) => {
        expect(step.orderIndex, station.id).toBe(i);
        expect(step.stationId).toBe(station.id);
      });
      expect(station.steps[0].pluginKey).toBe("timer.countdown");
      expect(station.steps.at(-1)!.pluginKey).toBe("score.summary");
    }
  });

  it("every step config passes its plugin schema", () => {
    for (const station of allStations) {
      for (const step of station.steps) {
        const schema = SCHEMAS[step.pluginKey];
        expect(schema, `${station.id}: no schema for ${step.pluginKey}`).toBeDefined();
        const parsed = schema!.safeParse(step.config);
        expect(parsed.success, `${step.id} (${step.pluginKey})`).toBe(true);
      }
    }
  });

  it("every equipment.select step has exactly one correct option", () => {
    for (const station of allStations) {
      for (const step of station.steps) {
        if (step.pluginKey !== "equipment.select") continue;
        const config = step.config as EquipmentSelectConfig;
        expect(config.options.filter((o) => o.correct), step.id).toHaveLength(1);
        expect(config.options.length).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it("critical-distractor categories always carry exactly one critical trap", () => {
    for (const slug of [
      "medication-administration",
      "blood-transfusion",
      "iv-medication",
      "cannulation",
      "catheterization",
    ]) {
      for (const station of CHUNKS[slug]) {
        const step = station.steps.find((s) => s.pluginKey === "equipment.select")!;
        const config = step.config as EquipmentSelectConfig;
        expect(config.options.filter((o) => o.critical), station.id).toHaveLength(1);
      }
    }
  });

  it("injection.perform appears only in medication-administration", () => {
    for (const [slug, stations] of Object.entries(CHUNKS)) {
      const hasInjection = stations.some((s) =>
        s.steps.some((step) => step.pluginKey === "injection.perform"),
      );
      expect(hasInjection, slug).toBe(slug === "medication-administration");
    }
  });

  it("time limits follow difficulty", () => {
    const expected = { Easy: 300, Medium: 240, Hard: 180 } as const;
    for (const station of allStations) {
      expect(station.timeLimitSec, station.id).toBe(expected[station.difficulty]);
    }
  });
});
