import type { OsceCategorySlug, OsceDifficulty } from "@/engine/types";
import type { InjectionSite } from "@/engine/configs";

/**
 * Category metadata shared by the engine pages and the seed generator
 * (scripts/convert-osce-stations.ts). Slugs and equipment ids are stable —
 * they become rows in the future Supabase categories/equipment tables.
 */

export interface OsceCategoryMeta {
  slug: OsceCategorySlug;
  /** Exact category string used in OSCE_500_Stations.xlsx. */
  xlsxLabel: string;
  label: string;
  /** Existing topic id from src/data/topics.ts used for progress recording. */
  topicId: string;
  /** Tailwind classes for the catalog badge dot/tint. */
  dotColor: string;
  tint: string;
}

export const OSCE_CATEGORIES: OsceCategoryMeta[] = [
  {
    slug: "medication-administration",
    xlsxLabel: "Medication Administration",
    label: "Medication Administration",
    topicId: "oral_drug",
    dotColor: "bg-rcsi-green",
    tint: "bg-rcsi-mint/40",
  },
  {
    slug: "vital-signs",
    xlsxLabel: "Vital Signs",
    label: "Vital Signs",
    topicId: "fundamentals",
    dotColor: "bg-rcsi-navy",
    tint: "bg-rcsi-lavender/40",
  },
  {
    slug: "cannulation",
    xlsxLabel: "Cannulation",
    label: "Cannulation",
    topicId: "iv_infusion",
    dotColor: "bg-rcsi-purple",
    tint: "bg-rcsi-lavender/40",
  },
  {
    slug: "wound-dressing",
    xlsxLabel: "Wound Dressing",
    label: "Wound Dressing",
    topicId: "wound_dressing",
    dotColor: "bg-rcsi-peach",
    tint: "bg-rcsi-peach/30",
  },
  {
    slug: "catheterization",
    xlsxLabel: "Catheterization",
    label: "Catheterization",
    topicId: "fundamentals",
    dotColor: "bg-rcsi-navy",
    tint: "bg-rcsi-lavender/40",
  },
  {
    slug: "blood-transfusion",
    xlsxLabel: "Blood Transfusion",
    label: "Blood Transfusion",
    topicId: "iv_infusion",
    dotColor: "bg-red-500",
    tint: "bg-red-100/60",
  },
  {
    slug: "iv-medication",
    xlsxLabel: "IV Medication",
    label: "IV Medication",
    topicId: "iv_infusion",
    dotColor: "bg-rcsi-purple",
    tint: "bg-rcsi-lavender/40",
  },
  {
    slug: "patient-communication",
    xlsxLabel: "Patient Communication",
    label: "Patient Communication",
    topicId: "nok_discussion",
    dotColor: "bg-rcsi-mint",
    tint: "bg-rcsi-mint/40",
  },
  {
    slug: "emergency-response",
    xlsxLabel: "Emergency Response (BLS/CPR)",
    label: "Emergency Response (BLS/CPR)",
    topicId: "acute_management",
    dotColor: "bg-orange-500",
    tint: "bg-rcsi-peach/30",
  },
  {
    slug: "documentation",
    xlsxLabel: "Documentation",
    label: "Documentation",
    topicId: "isbar",
    dotColor: "bg-rcsi-green",
    tint: "bg-rcsi-mint/40",
  },
];

export const getCategoryBySlug = (
  slug: string,
): OsceCategoryMeta | undefined => OSCE_CATEGORIES.find((c) => c.slug === slug);

export const getCategoryByXlsxLabel = (
  label: string,
): OsceCategoryMeta | undefined =>
  OSCE_CATEGORIES.find((c) => c.xlsxLabel === label);

export const CATEGORY_TOPIC_MAP: Record<OsceCategorySlug, string> =
  Object.fromEntries(
    OSCE_CATEGORIES.map((c) => [c.slug, c.topicId]),
  ) as Record<OsceCategorySlug, string>;

export const DIFFICULTY_TIME_LIMIT_SEC: Record<OsceDifficulty, number> = {
  Easy: 300,
  Medium: 240,
  Hard: 180,
};

/**
 * Equipment pool: the 10 correct items from the xlsx + 6 distractor-only
 * extras. Ids are stable slugs (future equipment table rows).
 */
export interface EquipmentPoolItem {
  id: string;
  label: string;
}

export const EQUIPMENT_POOL: EquipmentPoolItem[] = [
  { id: "syringe_3ml", label: "3 ml Syringe" },
  { id: "bp_cuff", label: "BP Cuff" },
  { id: "cannula_20g", label: "20G Cannula" },
  { id: "sterile_dressing_kit", label: "Sterile Dressing Kit" },
  { id: "foley_catheter", label: "Foley Catheter" },
  { id: "blood_giving_set", label: "Blood Giving Set" },
  { id: "iv_infusion_set", label: "IV Infusion Set" },
  { id: "aed", label: "AED" },
  { id: "patient_chart", label: "Patient Chart" },
  { id: "nasogastric_tube", label: "Nasogastric Tube" },
  { id: "oxygen_mask", label: "Oxygen Mask" },
  { id: "suction_catheter", label: "Suction Catheter" },
  { id: "tourniquet", label: "Tourniquet" },
  { id: "insulin_syringe", label: "Insulin Syringe" },
  { id: "gauze_roll", label: "Gauze Roll" },
  { id: "alcohol_swab", label: "Alcohol Swab" },
];

/** xlsx correct_equipment string → pool id. */
export const CORRECT_EQUIPMENT_ID: Record<string, string> = {
  "3 ml syringe": "syringe_3ml",
  "BP cuff": "bp_cuff",
  "20G Cannula": "cannula_20g",
  "Sterile Dressing Kit": "sterile_dressing_kit",
  "Foley Catheter": "foley_catheter",
  "Blood Giving Set": "blood_giving_set",
  "IV Infusion Set": "iv_infusion_set",
  AED: "aed",
  "Patient Chart": "patient_chart",
};

/**
 * Blueprint critical-fail rules: per category, the dangerous look-alike that
 * is always forced into the distractor set and flagged critical when picked.
 */
export const CRITICAL_DISTRACTOR: Partial<
  Record<OsceCategorySlug, { id: string; feedback: string }>
> = {
  "medication-administration": {
    id: "insulin_syringe",
    feedback:
      "Critical error: an insulin syringe is calibrated in units, not ml — using it for a standard medication risks a serious dosing error.",
  },
  "blood-transfusion": {
    id: "iv_infusion_set",
    feedback:
      "Critical error: blood must be transfused through a blood giving set with an integral filter — a standard IV set is unsafe.",
  },
  "iv-medication": {
    id: "blood_giving_set",
    feedback:
      "Critical error: a blood giving set is for transfusion only — IV medication requires a standard IV infusion set.",
  },
  cannulation: {
    id: "foley_catheter",
    feedback:
      "Critical error: a Foley catheter is a urinary device — inserting the wrong invasive device endangers the patient.",
  },
  catheterization: {
    id: "cannula_20g",
    feedback:
      "Critical error: an IV cannula is not a urinary catheter — the wrong invasive device endangers the patient.",
  },
};

/**
 * Fixed hotspot coordinates (%) on the 2D body figure used by
 * injection.perform. Three valid IM/SC sites + one distractor site.
 */
export const INJECTION_SITES: InjectionSite[] = [
  { site: "Deltoid", label: "Deltoid (upper arm)", x: 71, y: 26 },
  { site: "Vastus Lateralis", label: "Vastus lateralis (thigh)", x: 58, y: 65 },
  { site: "Abdomen", label: "Abdomen", x: 50, y: 44 },
  { site: "Forearm", label: "Forearm", x: 76, y: 40 },
];
