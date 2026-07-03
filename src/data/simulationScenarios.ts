// OSCE practical simulation scenarios.
// Authoring rule: keep each invigilatorLine under ~2 sentences — long
// utterances can stall Chrome's speechSynthesis.

export type ItemKind =
  | "syringe"
  | "needle"
  | "ampoule"
  | "vial"
  | "swab"
  | "sharpsBin";

export interface RoomItem {
  id: string;
  kind: ItemKind;
  label: string;
  detail?: string;
  /** Percentage coordinates inside the scene container. */
  position: { x: number; y: number };
  size?: "sm" | "md" | "lg";
}

export type StepKind = "listen" | "pick" | "inject";

export interface SimulationStep {
  id: string;
  kind: StepKind;
  /** Spoken aloud and shown in the invigilator speech bubble. */
  invigilatorLine: string;
  points: number;
  /** Pick steps: any one of these item ids is a correct pick. */
  correctItemIds?: string[];
  /** Tailored feedback per wrong item id. */
  wrongFeedback?: Record<string, string>;
  defaultWrongFeedback?: string;
  successLine?: string;
  /** Delay after speech ends before the hint highlight appears. */
  hintDelayMs?: number;
}

export interface SimulationScenario {
  id: string;
  topicId: string;
  title: string;
  situation: string;
  patient: { name: string; age: number; position: "bed" | "chair"; note?: string };
  /** Percentage coordinates of the injection target inside the scene. */
  injectionSite: { x: number; y: number; label: string };
  items: RoomItem[];
  steps: SimulationStep[];
  /** Station time limit in seconds (real OSCE stations are 10 minutes). */
  timeLimitSec: number;
}

export const SCENARIOS: SimulationScenario[] = [
  {
    id: "im_b12_injection",
    // Medication-administration station family; re-key here if a dedicated
    // injection topic is added later.
    topicId: "oral_drug",
    title: "Intramuscular Injection — Vitamin B12",
    situation:
      "You are a staff nurse on a medical ward. Mrs Nora Byrne, 68, has pernicious anaemia. The prescription chart orders Hydroxocobalamin 1 mg (1 mL) by intramuscular injection into the deltoid. All the equipment you need is on the treatment trolley.",
    patient: { name: "Nora Byrne", age: 68, position: "bed" },
    injectionSite: { x: 30, y: 47, label: "Deltoid muscle" },
    items: [
      { id: "syr_2ml", kind: "syringe", label: "2 mL syringe", detail: "Luer-lock, sterile", position: { x: 60, y: 26 }, size: "sm" },
      { id: "syr_insulin", kind: "syringe", label: "Insulin 1 mL", detail: "Insulin syringe, U-100 units scale", position: { x: 79, y: 26 }, size: "sm" },
      { id: "syr_10ml", kind: "syringe", label: "10 mL syringe", detail: "Luer-lock, sterile", position: { x: 60, y: 40 }, size: "md" },
      { id: "syr_20ml", kind: "syringe", label: "20 mL syringe", detail: "Luer-lock, sterile", position: { x: 76, y: 40 }, size: "lg" },
      { id: "ndl_23g", kind: "needle", label: "23G blue", detail: "23G needle, 25 mm — intramuscular", position: { x: 58, y: 54 } },
      { id: "ndl_25g", kind: "needle", label: "25G orange", detail: "25G needle, 16 mm — subcutaneous", position: { x: 77, y: 54 } },
      { id: "amp_b12", kind: "ampoule", label: "B12 1 mg", detail: "Hydroxocobalamin 1 mg/1 mL ampoule", position: { x: 55, y: 67 } },
      { id: "vial_insulin", kind: "vial", label: "Insulin", detail: "Actrapid vial, 100 units/mL", position: { x: 70, y: 67 } },
      { id: "swab_alcohol", kind: "swab", label: "Alcohol swab", detail: "70% isopropyl", position: { x: 80, y: 67 } },
    ],
    steps: [
      {
        id: "intro",
        kind: "listen",
        invigilatorLine:
          "Hello candidate. Mrs Nora Byrne, 68, requires Hydroxocobalamin 1 milligram intramuscularly into the deltoid, as prescribed. Please prepare and administer this injection safely — I will guide you through each step.",
        points: 0,
      },
      {
        id: "pick_syringe",
        kind: "pick",
        invigilatorLine:
          "First, select the correct syringe for a 1 millilitre intramuscular injection.",
        points: 10,
        correctItemIds: ["syr_2ml"],
        wrongFeedback: {
          syr_insulin:
            "An insulin syringe is calibrated in units, not millilitres — it is only used for insulin.",
          syr_10ml: "Too large — a 2 mL syringe measures a 1 mL dose accurately.",
          syr_20ml: "Too large — a 2 mL syringe measures a 1 mL dose accurately.",
        },
        defaultWrongFeedback: "That is not the right syringe for this dose.",
        successLine: "Good — a 2 millilitre syringe is correct.",
      },
      {
        id: "pick_needle",
        kind: "pick",
        invigilatorLine:
          "Now choose the appropriate needle for a deltoid intramuscular injection.",
        points: 10,
        correctItemIds: ["ndl_23g"],
        wrongFeedback: {
          ndl_25g:
            "A 25G orange needle is for subcutaneous injections — too short to reach the muscle.",
        },
        defaultWrongFeedback: "That is not a needle.",
        successLine: "Correct — a 23 gauge blue needle reaches the deltoid muscle.",
      },
      {
        id: "pick_medication",
        kind: "pick",
        invigilatorLine:
          "Select the prescribed medication and check it against the prescription chart.",
        points: 10,
        correctItemIds: ["amp_b12"],
        wrongFeedback: {
          vial_insulin:
            "Always check the label — that is insulin, not Hydroxocobalamin. This would be a drug error.",
        },
        defaultWrongFeedback: "Check the prescription — that is not the prescribed medication.",
        successLine: "Correct — Hydroxocobalamin 1 milligram, matching the prescription.",
      },
      {
        id: "pick_swab",
        kind: "pick",
        invigilatorLine: "Before injecting, what will you use to clean the skin?",
        points: 10,
        correctItemIds: ["swab_alcohol"],
        defaultWrongFeedback: "You need something to disinfect the injection site first.",
        successLine: "Good — clean the site and allow it to dry.",
      },
      {
        id: "inject",
        kind: "inject",
        invigilatorLine:
          "Well done. Now administer the injection into Mrs Byrne's deltoid muscle — tap the highlighted site.",
        points: 10,
        successLine:
          "Excellent. You administered the injection safely. Remember to dispose of the sharp and document the dose.",
      },
    ],
    timeLimitSec: 600,
  },
];

export const getScenarioByTopicId = (topicId: string) =>
  SCENARIOS.find((s) => s.topicId === topicId);
