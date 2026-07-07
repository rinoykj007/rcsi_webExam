/**
 * One-off converter: OSCE_500_Stations.xlsx → static engine seed data.
 *
 * Usage:
 *   npx tsx scripts/convert-osce-stations.ts [path-to-xlsx]
 *
 * Emits:
 *   src/data/osce/catalog.json            (500 light catalog entries)
 *   src/data/osce/stations/<slug>.json    (10 chunks, 50 full stations each)
 *
 * Every step config is validated against the same zod schemas the runtime
 * plugin registry uses, so generated data and the engine cannot drift.
 * Output is deterministic for a given input file (stable hashing, no
 * randomness) — re-running produces byte-identical files.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as XLSX from "xlsx";
import type { z } from "zod";
import {
  equipmentSelectConfigSchema,
  injectionPerformConfigSchema,
  mcqQuestionConfigSchema,
  patientCardConfigSchema,
  scoreSummaryConfigSchema,
  timerCountdownConfigSchema,
  voicePlayConfigSchema,
  type EquipmentOption,
} from "../src/engine/configs";
import type {
  OsceCatalogEntry,
  OsceCategorySlug,
  OsceDifficulty,
  OsceStation,
  OsceStep,
  PluginKey,
} from "../src/engine/types";
import {
  CORRECT_EQUIPMENT_ID,
  CRITICAL_DISTRACTOR,
  DIFFICULTY_TIME_LIMIT_SEC,
  EQUIPMENT_POOL,
  INJECTION_SITES,
  getCategoryByXlsxLabel,
} from "../src/data/osce/categories";

interface XlsxRow {
  id: number;
  category: string;
  title: string;
  voice_script_1: string;
  voice_script_2: string;
  patient_name: string;
  age: number;
  gender: string;
  task: string;
  correct_equipment: string;
  injection_site: string;
  difficulty: string;
}

interface McqTemplate {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Authored safety-knowledge MCQ banks per category. `{patient_name}` is
 * interpolated per station. Templates recycle within a category (known MVP
 * limitation — replaced by authored content in the Supabase phase).
 */
const MCQ_BANKS: Partial<Record<OsceCategorySlug, McqTemplate[]>> = {
  "vital-signs": [
    {
      question:
        "While recording {patient_name}'s blood pressure, the cuff bladder covers less than 80% of the arm circumference. What should you do?",
      options: [
        "Continue — cuff size does not affect the reading",
        "Select a correctly sized cuff before measuring",
        "Record the reading and note the cuff size",
        "Measure on the leg instead",
      ],
      correctIndex: 1,
      explanation:
        "An undersized cuff overestimates blood pressure; a correctly sized cuff must cover at least 80% of the arm circumference.",
    },
    {
      question:
        "You find {patient_name}'s respiratory rate is 26 breaths per minute. What is your first action?",
      options: [
        "Record it and continue the round",
        "Reassess in one hour",
        "Report the abnormal finding and escalate using the early warning score protocol",
        "Give oxygen immediately without further assessment",
      ],
      correctIndex: 2,
      explanation:
        "A respiratory rate above 25 is a red flag on NEWS/INEWS scoring and must be escalated promptly.",
    },
    {
      question:
        "Which set of observations forms a complete standard vital signs assessment?",
      options: [
        "Blood pressure and pulse only",
        "Temperature, pulse, respirations, blood pressure, oxygen saturation and level of consciousness",
        "Temperature and blood pressure",
        "Pulse, weight and height",
      ],
      correctIndex: 1,
      explanation:
        "A full set of vital signs includes TPR, BP, SpO2 and conscious level (AVPU), which feed the early warning score.",
    },
  ],
  cannulation: [
    {
      question:
        "Before inserting the cannula into {patient_name}'s vein, how long should the skin be cleaned with a 2% chlorhexidine in 70% alcohol wipe?",
      options: [
        "5 seconds, no drying needed",
        "At least 30 seconds and allowed to air dry",
        "A quick wipe immediately before insertion",
        "Cleaning is unnecessary for peripheral cannulation",
      ],
      correctIndex: 1,
      explanation:
        "Skin must be disinfected for at least 30 seconds and allowed to fully air dry to reduce infection risk.",
    },
    {
      question: "Immediately after cannulating {patient_name}, where does the needle go?",
      options: [
        "Into the nearest general waste bin",
        "Onto the trolley to dispose of later",
        "Directly into the sharps container at the point of care",
        "Recapped and into your pocket",
      ],
      correctIndex: 2,
      explanation:
        "Sharps must be disposed of immediately at the point of use, never recapped or carried.",
    },
    {
      question: "Which vein is the preferred first choice for routine peripheral cannulation?",
      options: [
        "Veins of the antecubital fossa over a joint",
        "Distal veins of the non-dominant forearm",
        "Veins of the foot",
        "The largest visible vein regardless of site",
      ],
      correctIndex: 1,
      explanation:
        "Distal forearm veins on the non-dominant side preserve proximal sites and avoid areas of flexion.",
    },
  ],
  "wound-dressing": [
    {
      question:
        "When redressing {patient_name}'s wound, which technique prevents contamination of key parts and key sites?",
      options: [
        "Clean technique with regular gloves throughout",
        "Aseptic non-touch technique (ANTT)",
        "Washing the wound with tap water only",
        "Re-using the outer dressing if it looks clean",
      ],
      correctIndex: 1,
      explanation:
        "ANTT protects key parts and key sites from contamination during wound care.",
    },
    {
      question:
        "You notice increased redness, warmth and purulent exudate in {patient_name}'s wound. What do you do?",
      options: [
        "Apply the new dressing and document nothing",
        "Document the findings, obtain a swab if indicated and report signs of infection",
        "Wash the wound with antiseptic and ignore it",
        "Leave the wound open to the air",
      ],
      correctIndex: 1,
      explanation:
        "Signs of infection must be assessed, documented and escalated so treatment can start promptly.",
    },
    {
      question: "When should wound assessment be documented?",
      options: [
        "Only when the wound deteriorates",
        "At every dressing change, using a structured wound assessment chart",
        "Once weekly",
        "Only on admission",
      ],
      correctIndex: 1,
      explanation:
        "Structured documentation at each dressing change tracks healing and detects deterioration early.",
    },
  ],
  catheterization: [
    {
      question:
        "Before inflating the balloon of {patient_name}'s urinary catheter, what must you confirm?",
      options: [
        "The catheter bag is hanging on the bed rail",
        "Urine is draining, confirming the catheter tip is in the bladder",
        "The patient has drunk enough water",
        "The balloon port is closed",
      ],
      correctIndex: 1,
      explanation:
        "Inflating the balloon before urine confirms bladder placement can cause urethral trauma.",
    },
    {
      question: "Which technique is required for urinary catheter insertion?",
      options: [
        "Clean technique",
        "Strict aseptic technique with sterile field and sterile gloves",
        "No-touch technique with regular gloves",
        "Any technique if antibiotics are prescribed",
      ],
      correctIndex: 1,
      explanation:
        "Catheterisation is an aseptic procedure; CAUTI is a major preventable harm.",
    },
    {
      question:
        "Where should {patient_name}'s catheter drainage bag be positioned?",
      options: [
        "Above bladder level for better flow",
        "On the floor",
        "Below bladder level, off the floor, with an unobstructed tube",
        "On the bed beside the patient",
      ],
      correctIndex: 2,
      explanation:
        "The bag must stay below the bladder to prevent reflux, and off the floor to prevent contamination.",
    },
  ],
  "blood-transfusion": [
    {
      question:
        "When must {patient_name}'s vital signs be checked during a red cell transfusion?",
      options: [
        "Only at the start",
        "Baseline, 15 minutes after starting, then per policy and at completion",
        "Every 4 hours",
        "Only if the patient complains",
      ],
      correctIndex: 1,
      explanation:
        "Most acute transfusion reactions occur early — the 15-minute check is mandatory.",
    },
    {
      question:
        "During the transfusion {patient_name} develops fever, rigors and back pain. What is your first action?",
      options: [
        "Slow the transfusion and observe",
        "Stop the transfusion immediately, maintain IV access with saline and call for help",
        "Give paracetamol and continue",
        "Remove the cannula",
      ],
      correctIndex: 1,
      explanation:
        "Suspected transfusion reaction: stop immediately, keep the line open with saline, escalate urgently.",
    },
    {
      question: "The final bedside identity check before transfusion must be done by:",
      options: [
        "Checking the compatibility label against the patient's ID band at the bedside",
        "Checking the notes at the nurses' station",
        "Asking the patient's visitor",
        "Confirming the room number matches",
      ],
      correctIndex: 0,
      explanation:
        "Positive patient identification at the bedside against the blood component label prevents fatal ABO-incompatible transfusion.",
    },
  ],
  "iv-medication": [
    {
      question:
        "Before administering IV medication to {patient_name}, which checks are essential?",
      options: [
        "Right drug and right patient only",
        "The rights of medication administration: patient, drug, dose, route, time — plus allergies and prescription validity",
        "That the previous nurse gave the same drug",
        "Only the expiry date",
      ],
      correctIndex: 1,
      explanation:
        "All rights of medication administration plus allergy status must be verified before every IV dose.",
    },
    {
      question: "Before and after IV medication administration, the cannula should be:",
      options: [
        "Left untouched",
        "Flushed with 0.9% sodium chloride to confirm patency",
        "Removed and resited",
        "Flushed with sterile water",
      ],
      correctIndex: 1,
      explanation:
        "A saline flush confirms patency before the drug and clears the line afterwards.",
    },
    {
      question:
        "{patient_name} reports pain and you see swelling at the cannula site during the infusion. What do you do?",
      options: [
        "Continue at a slower rate",
        "Stop the infusion — suspected extravasation/infiltration — and assess the site",
        "Apply a bandage over the site",
        "Increase the rate to finish sooner",
      ],
      correctIndex: 1,
      explanation:
        "Pain and swelling suggest the infusion is entering tissue, not vein; stop immediately and assess.",
    },
  ],
  "patient-communication": [
    {
      question:
        "At the start of your conversation with {patient_name}, what should you do first?",
      options: [
        "Begin discussing the care plan straight away",
        "Introduce yourself, confirm the patient's identity and gain consent to proceed",
        "Read the chart aloud",
        "Ask a relative to explain the situation",
      ],
      correctIndex: 1,
      explanation:
        "Introduction, positive identification and consent are the foundation of safe, respectful communication.",
    },
    {
      question: "Which question style best encourages {patient_name} to share concerns?",
      options: [
        "Closed questions requiring yes/no answers",
        "Leading questions",
        "Open-ended questions with active listening",
        "Multiple rapid-fire questions",
      ],
      correctIndex: 2,
      explanation:
        "Open questions and active listening elicit the patient's own concerns and build trust.",
    },
    {
      question:
        "{patient_name} becomes tearful and anxious during the discussion. The best response is to:",
      options: [
        "Change the subject quickly",
        "Acknowledge the emotion, allow silence and offer support before continuing",
        "Continue with the planned information",
        "Leave the room until they settle",
      ],
      correctIndex: 1,
      explanation:
        "Acknowledging emotion and pausing shows empathy and keeps communication patient-centred.",
    },
    {
      question:
        "When handing over concerns about {patient_name} to the doctor, which structure should you use?",
      options: [
        "A casual chat covering what you remember",
        "ISBAR: Identify, Situation, Background, Assessment, Recommendation",
        "Only the vital signs",
        "A written note left on the desk",
      ],
      correctIndex: 1,
      explanation:
        "ISBAR structures clinical communication so critical information is never omitted.",
    },
  ],
  "emergency-response": [
    {
      question:
        "You confirm {patient_name} is unresponsive and not breathing normally. What is the correct compression technique?",
      options: [
        "60 compressions per minute, 3 cm deep",
        "100–120 compressions per minute, 5–6 cm deep, centre of the chest",
        "140 compressions per minute as deep as possible",
        "Compressions only after 5 rescue breaths in adults",
      ],
      correctIndex: 1,
      explanation:
        "Adult BLS: 100–120/min at 5–6 cm depth with full recoil, minimising interruptions.",
    },
    {
      question: "Which sequence is correct when you find a collapsed patient?",
      options: [
        "Airway, Breathing, Circulation, Danger, Response",
        "Danger, Response, Shout for help, Airway, Breathing, Circulation/Compressions",
        "Compressions first, then check for danger",
        "Response, Compressions, Airway",
      ],
      correctIndex: 1,
      explanation:
        "DRS ABC: check danger and response, shout for help, then airway, breathing and compressions.",
    },
    {
      question: "Once the AED arrives during CPR on {patient_name}, you should:",
      options: [
        "Finish the current 2-minute cycle before attaching it",
        "Attach the pads immediately and follow the voice prompts, minimising pauses in compressions",
        "Wait for the doctor to attach it",
        "Use it only if the patient is breathing",
      ],
      correctIndex: 1,
      explanation:
        "Early defibrillation saves lives — attach the AED as soon as it arrives and follow its prompts.",
    },
  ],
  documentation: [
    {
      question:
        "You make a written error in {patient_name}'s chart. How do you correct it?",
      options: [
        "Use correction fluid",
        "Scribble it out completely",
        "Draw a single line through the error, write 'error', then sign and date it",
        "Tear out the page and rewrite it",
      ],
      correctIndex: 2,
      explanation:
        "A single line keeps the original legible; correction fluid or obliteration is never acceptable in a legal record.",
    },
    {
      question: "When should nursing care given to {patient_name} be documented?",
      options: [
        "At the end of the week",
        "As soon as possible after the care is given, in chronological order",
        "Before the care is given to save time",
        "Only when something abnormal happens",
      ],
      correctIndex: 1,
      explanation:
        "Contemporaneous, chronological records are a professional and legal requirement — and never pre-charted.",
    },
    {
      question: "Which entry is an example of good documentation?",
      options: [
        "\"Patient had a good day\"",
        "\"Patient seems fine\"",
        "\"Wound 3 cm × 2 cm on left forearm, minimal serous exudate, dressing renewed, patient reports pain 2/10\"",
        "\"No change\"",
      ],
      correctIndex: 2,
      explanation:
        "Records must be factual, specific and objective — measurable observations, not vague impressions.",
    },
  ],
};

/** Deterministic string hash (djb2) so distractor picks are reproducible. */
const hash = (s: string): number => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
};

const interpolate = (template: string, patientName: string): string =>
  template.replaceAll("{patient_name}", patientName);

const buildEquipmentOptions = (
  stationId: string,
  categorySlug: OsceCategorySlug,
  correctLabel: string,
): EquipmentOption[] => {
  const correctId = CORRECT_EQUIPMENT_ID[correctLabel];
  if (!correctId) throw new Error(`Unknown equipment "${correctLabel}" (${stationId})`);
  const correctItem = EQUIPMENT_POOL.find((e) => e.id === correctId)!;

  const options: EquipmentOption[] = [
    { id: correctItem.id, label: correctItem.label, correct: true },
  ];

  const critical = CRITICAL_DISTRACTOR[categorySlug];
  if (critical && critical.id !== correctId) {
    const item = EQUIPMENT_POOL.find((e) => e.id === critical.id)!;
    options.push({
      id: item.id,
      label: item.label,
      correct: false,
      critical: true,
      feedback: critical.feedback,
    });
  }

  const used = new Set(options.map((o) => o.id));
  const candidates = EQUIPMENT_POOL.filter((e) => !used.has(e.id));
  const start = hash(stationId) % candidates.length;
  for (let i = 0; options.length < 4; i++) {
    const item = candidates[(start + i * 3) % candidates.length];
    if ([...used].includes(item.id)) continue;
    used.add(item.id);
    options.push({ id: item.id, label: item.label, correct: false });
  }
  return options;
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

const MARKS: Partial<Record<PluginKey, number>> = {
  "timer.countdown": 0,
  "voice.play": 0,
  "patient.card": 1,
  "equipment.select": 2,
  "mcq.question": 2,
  "injection.perform": 2,
  "score.summary": 0,
};

const VALID_IM_SITES = new Set(["Deltoid", "Vastus Lateralis", "Abdomen"]);

const buildStation = (row: XlsxRow, rowIndex: number): OsceStation => {
  const category = getCategoryByXlsxLabel(row.category);
  if (!category) throw new Error(`Unknown category "${row.category}" (row ${row.id})`);
  const difficulty = row.difficulty as OsceDifficulty;
  if (!DIFFICULTY_TIME_LIMIT_SEC[difficulty]) {
    throw new Error(`Unknown difficulty "${row.difficulty}" (row ${row.id})`);
  }
  const stationId = `osce-${String(row.id).padStart(3, "0")}`;
  const timeLimitSec = DIFFICULTY_TIME_LIMIT_SEC[difficulty];
  const patientName = String(row.patient_name).trim();

  // Assemble [pluginKey, config] pairs; orderIndex/marks applied below.
  const core: Array<[PluginKey, unknown]> = [];
  if (category.slug === "medication-administration") {
    core.push([
      "equipment.select",
      {
        prompt: `Select the correct equipment: ${row.task}`,
        options: buildEquipmentOptions(stationId, category.slug, row.correct_equipment),
      },
    ]);
    // Round-robin xlsx values like Forearm/None are not valid medication
    // sites — coerce to Deltoid per plan.
    const site = VALID_IM_SITES.has(row.injection_site) ? row.injection_site : "Deltoid";
    core.push([
      "injection.perform",
      { correctSite: site, sites: INJECTION_SITES },
    ]);
  } else {
    const bank = MCQ_BANKS[category.slug]!;
    const mcqAt = (offset: number): [PluginKey, unknown] => {
      const t = bank[(rowIndex + offset) % bank.length];
      return [
        "mcq.question",
        {
          question: interpolate(t.question, patientName),
          options: t.options,
          correctIndex: t.correctIndex,
          explanation: t.explanation,
        },
      ];
    };
    if (category.slug === "patient-communication") {
      core.push(mcqAt(0), mcqAt(1));
    } else {
      core.push([
        "equipment.select",
        {
          prompt: `Select the correct equipment: ${row.task}`,
          options: buildEquipmentOptions(stationId, category.slug, row.correct_equipment),
        },
      ]);
      core.push(mcqAt(0));
    }
  }

  const pairs: Array<[PluginKey, unknown]> = [
    ["timer.countdown", { seconds: timeLimitSec }],
    ["voice.play", { transcript: String(row.voice_script_1).trim() }],
    ["patient.card", { requireConfirm: true }],
    ...core,
    ["voice.play", { transcript: String(row.voice_script_2).trim() }],
    ["score.summary", { passMarkPct: 70 }],
  ];

  const steps: OsceStep[] = pairs.map(([pluginKey, config], orderIndex) => {
    const schema = SCHEMAS[pluginKey];
    if (!schema) throw new Error(`No schema for ${pluginKey}`);
    const parsed = schema.safeParse(config);
    if (!parsed.success) {
      throw new Error(
        `Invalid ${pluginKey} config (${stationId}): ${parsed.error.message}`,
      );
    }
    return {
      id: `${stationId}-s${orderIndex}`,
      stationId,
      orderIndex,
      pluginKey,
      pluginVersion: 1,
      config: parsed.data,
      marksAvailable: MARKS[pluginKey] ?? 0,
    };
  });

  return {
    id: stationId,
    category: category.slug,
    title: String(row.title).trim(),
    task: String(row.task).trim(),
    difficulty,
    timeLimitSec,
    patient: {
      name: patientName,
      age: Number(row.age),
      gender: row.gender === "Female" ? "Female" : "Male",
    },
    steps,
  };
};

// ---------------------------------------------------------------------------

const xlsxPath =
  process.argv[2] ?? path.join(os.homedir(), "Downloads", "OSCE_500_Stations.xlsx");
if (!fs.existsSync(xlsxPath)) {
  console.error(`xlsx not found: ${xlsxPath}`);
  process.exit(1);
}

const workbook = XLSX.read(fs.readFileSync(xlsxPath), { type: "buffer" });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json<XlsxRow>(sheet);
console.log(`Read ${rows.length} rows from ${xlsxPath}`);

const byCategory = new Map<OsceCategorySlug, OsceStation[]>();
const catalog: OsceCatalogEntry[] = [];
// rowIndex within each category drives MCQ rotation so consecutive stations
// in one category get different questions.
const categoryCounters = new Map<OsceCategorySlug, number>();

for (const row of rows) {
  const slug = getCategoryByXlsxLabel(row.category)?.slug;
  if (!slug) throw new Error(`Unknown category "${row.category}"`);
  const counter = categoryCounters.get(slug) ?? 0;
  categoryCounters.set(slug, counter + 1);
  const station = buildStation(row, counter);
  if (!byCategory.has(slug)) byCategory.set(slug, []);
  byCategory.get(slug)!.push(station);
  catalog.push({
    id: station.id,
    title: station.title,
    category: station.category,
    difficulty: station.difficulty,
  });
}

const outDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "src",
  "data",
  "osce",
);
const stationsDir = path.join(outDir, "stations");
fs.mkdirSync(stationsDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "catalog.json"), JSON.stringify(catalog, null, 1));
console.log(`Wrote catalog.json (${catalog.length} entries)`);

for (const [slug, stations] of byCategory) {
  const file = path.join(stationsDir, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(stations, null, 1));
  console.log(`Wrote stations/${slug}.json (${stations.length} stations)`);
}
