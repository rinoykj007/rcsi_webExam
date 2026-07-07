import type { OsceCatalogEntry, OsceCategorySlug, OsceStation } from "@/engine/types";
import catalogJson from "./catalog.json";
import { DEMO_STATIONS, getDemoStation } from "./demoStations";

/**
 * Station data is chunked per category (10 files × 50 stations) and loaded
 * via dynamic import so Vite code-splits each chunk — running one station
 * downloads ~1/10 of the seed data.
 */
const loaders: Record<OsceCategorySlug, () => Promise<{ default: OsceStation[] }>> = {
  "medication-administration": () =>
    import("./stations/medication-administration.json") as never,
  "vital-signs": () => import("./stations/vital-signs.json") as never,
  cannulation: () => import("./stations/cannulation.json") as never,
  "wound-dressing": () => import("./stations/wound-dressing.json") as never,
  catheterization: () => import("./stations/catheterization.json") as never,
  "blood-transfusion": () => import("./stations/blood-transfusion.json") as never,
  "iv-medication": () => import("./stations/iv-medication.json") as never,
  "patient-communication": () =>
    import("./stations/patient-communication.json") as never,
  "emergency-response": () => import("./stations/emergency-response.json") as never,
  documentation: () => import("./stations/documentation.json") as never,
};

/** Hand-authored demo stations listed first, then the 500 generated ones. */
export const OSCE_CATALOG: OsceCatalogEntry[] = [
  ...DEMO_STATIONS.map(({ id, title, category, difficulty }) => ({
    id,
    title,
    category,
    difficulty,
  })),
  ...(catalogJson as OsceCatalogEntry[]),
];

export const getCatalogEntry = (stationId: string): OsceCatalogEntry | undefined =>
  OSCE_CATALOG.find((e) => e.id === stationId);

export const loadCategoryStations = async (
  slug: OsceCategorySlug,
): Promise<OsceStation[]> => (await loaders[slug]()).default;

export const loadStation = async (
  stationId: string,
): Promise<OsceStation | null> => {
  const demo = getDemoStation(stationId);
  if (demo) return demo;
  const entry = getCatalogEntry(stationId);
  if (!entry) return null;
  const stations = await loadCategoryStations(entry.category);
  return stations.find((s) => s.id === stationId) ?? null;
};
