import { describe, expect, it } from "vitest";
import { PLUGIN_REGISTRY, resolvePlugin } from "@/engine/registry";

const MVP_KEYS = [
  "voice.play",
  "patient.card",
  "equipment.select",
  "mcq.question",
  "injection.perform",
  "timer.countdown",
  "score.summary",
] as const;

describe("plugin registry", () => {
  it("resolves all 7 MVP plugins at version 1", () => {
    for (const key of MVP_KEYS) {
      const plugin = resolvePlugin(key, 1);
      expect(plugin, key).not.toBeNull();
      expect(plugin!.key).toBe(key);
      expect(plugin!.Component).toBeTypeOf("function");
    }
  });

  it("returns null for blueprint keys without an MVP implementation", () => {
    expect(resolvePlugin("documentation.form", 1)).toBeNull();
    expect(resolvePlugin("feedback.show", 1)).toBeNull();
  });

  it("returns null for an unknown version", () => {
    expect(resolvePlugin("voice.play", 99)).toBeNull();
  });

  it("returns null for a completely unknown key", () => {
    expect(resolvePlugin("hologram.render", 1)).toBeNull();
  });

  it("every registered plugin's schema rejects a malformed config", () => {
    for (const plugin of Object.values(PLUGIN_REGISTRY)) {
      expect(
        plugin.configSchema.safeParse({ nonsense: true }).success,
        plugin.key,
      ).toBe(false);
    }
  });
});
