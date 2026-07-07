import type {
  OsceStation,
  OsceStep,
  PluginKey,
  SkillCategory,
} from "@/engine/types";

/**
 * Hand-authored production-grade demo stations, showing the depth of content
 * the engine supports beyond the templated 500-station seed: rich patient
 * data (prescription, allergies, weight), multi-item equipment selection,
 * safety MCQs, and an 80% pass mark. These become admin-authored DB rows in
 * the Supabase phase.
 */

const step = (
  stationId: string,
  orderIndex: number,
  pluginKey: PluginKey,
  config: unknown,
  marksAvailable: number,
  skill?: SkillCategory,
): OsceStep => ({
  id: `${stationId}-s${orderIndex}`,
  stationId,
  orderIndex,
  pluginKey,
  pluginVersion: 1,
  config,
  marksAvailable,
  skill,
});

const ID = "osce-demo-042";

export const DEMO_STATIONS: OsceStation[] = [
  {
    id: ID,
    category: "medication-administration",
    title: "Station 42 — IM Antibiotic Administration",
    task: "Administer the prescribed intramuscular antibiotic safely.",
    difficulty: "Hard",
    timeLimitSec: 480,
    patient: {
      name: "John Smith",
      age: 52,
      gender: "Male",
      weightKg: 76,
      diagnosis: "Community-acquired pneumonia",
      prescription: "Ceftriaxone 1 g IM once daily",
      allergies: "None known",
      history: "Admitted yesterday with productive cough and fever.",
    },
    steps: [
      step(ID, 0, "timer.countdown", { seconds: 480 }, 0),
      step(
        ID,
        1,
        "voice.play",
        {
          transcript:
            "You are the registered nurse on Ward B. Please administer the prescribed intramuscular antibiotic. You have eight minutes.",
        },
        0,
      ),
      step(
        ID,
        2,
        "patient.card",
        {
          requireConfirm: true,
          checkAllergies: true,
          // Confirming a decoy wristband = wrong patient → critical fail.
          decoys: [
            { name: "John Smyth", age: 48, gender: "Male" },
            { name: "Sean Smith", age: 52, gender: "Male" },
          ],
        },
        2,
        "Safety",
      ),
      step(
        ID,
        3,
        "mcq.question",
        {
          question:
            "Before preparing the medication for John Smith, what must you do first?",
          options: [
            "Draw up the medication immediately",
            "Perform hand hygiene and apply gloves",
            "Position the patient",
            "Open the sharps container",
          ],
          correctIndex: 1,
          explanation:
            "Hand hygiene is the first step of every clinical procedure — the WHO moment before touching a patient or preparing medication.",
        },
        2,
        "Safety",
      ),
      step(
        ID,
        4,
        "equipment.select",
        {
          prompt:
            "Prepare your tray: select everything you need to draw up and give Ceftriaxone 1 g IM.",
          allowMultiple: true,
          options: [
            { id: "syringe_3ml", label: "3 ml Syringe", correct: true },
            { id: "needle_23g", label: "23G Needle", correct: true },
            { id: "alcohol_swab", label: "Alcohol Swabs", correct: true },
            { id: "gloves", label: "Gloves", correct: true },
            {
              id: "insulin_syringe",
              label: "Insulin Syringe",
              correct: false,
              critical: true,
              feedback:
                "Critical error: an insulin syringe is calibrated in units and cannot hold or measure a 1 g IM antibiotic dose.",
            },
            { id: "syringe_5ml", label: "5 ml Syringe", correct: false },
            { id: "nasogastric_tube", label: "Nasogastric Tube", correct: false },
            { id: "foley_catheter", label: "Foley Catheter", correct: false },
          ],
        },
        4,
      ),
      step(
        ID,
        5,
        "mcq.question",
        {
          question: "At what angle should an intramuscular injection be given?",
          options: ["15 degrees", "45 degrees", "90 degrees", "Parallel to the skin"],
          correctIndex: 2,
          explanation:
            "IM injections are given at 90 degrees to reach the muscle through the subcutaneous tissue.",
        },
        2,
      ),
      step(
        ID,
        6,
        "injection.perform",
        {
          correctSite: "Vastus Lateralis",
          // Wrong site = wrong route → critical fail on this hard station.
          criticalOnWrong: true,
          sites: [
            { site: "Deltoid", label: "Deltoid (upper arm)", x: 71, y: 26 },
            { site: "Vastus Lateralis", label: "Vastus lateralis (thigh)", x: 58, y: 65 },
            { site: "Abdomen", label: "Abdomen", x: 50, y: 44 },
            { site: "Forearm", label: "Forearm", x: 76, y: 40 },
          ],
        },
        2,
      ),
      step(
        ID,
        7,
        "mcq.question",
        {
          question: "Immediately after the injection, what do you do with the needle?",
          options: [
            "Recap it and put it in your pocket",
            "Leave it on the tray to dispose of later",
            "Place it directly into the sharps container without recapping",
            "Hand it to your colleague",
          ],
          correctIndex: 2,
          // Recapping/carrying sharps is a sterile-technique class error.
          criticalOnWrong: true,
          explanation:
            "Sharps go straight into the sharps container at the point of care — never recapped or carried.",
        },
        2,
        "Safety",
      ),
      step(
        ID,
        8,
        "mcq.question",
        {
          question: "Which record is the correct documentation of this procedure?",
          options: [
            "\"Antibiotic given\"",
            "\"Ceftriaxone 1 g IM administered to right vastus lateralis at 10:00, patient tolerated well, no immediate reaction. Signed.\"",
            "\"Medication round complete\"",
            "\"IM injection done, will document later\"",
          ],
          correctIndex: 1,
          explanation:
            "Documentation must state drug, dose, route, site, time, patient response, and be signed — contemporaneously.",
        },
        2,
        "Documentation",
      ),
      step(
        ID,
        9,
        "voice.play",
        {
          transcript:
            "Thank you. Please ensure your documentation is complete. This station is now finished.",
        },
        0,
      ),
      step(ID, 10, "score.summary", { passMarkPct: 80 }, 0),
    ],
  },
];

export const getDemoStation = (stationId: string): OsceStation | null =>
  DEMO_STATIONS.find((s) => s.id === stationId) ?? null;
