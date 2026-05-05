// Infection Control Station — Complete Content for All Tabs

export interface MethodCard {
  id: string;
  title: string;
  icon: string;
  duration: string;
  description: string;
}

export interface WhoMoment {
  number: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface StationSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  badge?: string;
  content: string | { items: string[] } | MethodCard[] | WhoMoment[];
}

export interface StepItem {
  step: number;
  title: string;
  detail: string;
}

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
}

export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  tag: string;
  question: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
}

export interface CompareRow {
  feature: string;
  [key: string]: string;
}

// ────── OVERVIEW TAB ──────────────────────────────────────────────────────

export const INFECTION_CONTROL_OVERVIEW = {
  title: "Infection Control",
  description: "Hand Hygiene",
  hero_description: "The single most important measure to prevent healthcare-associated infections (HCAIs).",

  sections: [
    {
      id: "methods",
      title: "Methods",
      icon: "Droplets",
      color: "#0284c7",
      badge: "IMP",
      content: [
        {
          id: "soap-water",
          title: "Soap & Water",
          icon: "🧼",
          duration: "40-60 sec",
          description: "For visibly soiled hands & spore-forming organisms",
        },
        {
          id: "alcohol-rub",
          title: "Alcohol Rub",
          icon: "🧴",
          duration: "20-30 sec",
          description: "Preferred for routine hand hygiene when hands look clean",
        },
      ] as MethodCard[],
    },
    {
      id: "when-ineffective",
      title: "When Alcohol Is Ineffective",
      icon: "AlertCircle",
      color: "#dc2626",
      badge: "EXAM",
      content: {
        items: [
          "Hands are Visibly soiled",
          "Clostridium difficile Bacteria which cause diarrhoea (C. diff)",
          "Norovirus also cause diarrhoea and vomiting",
        ]
      }
    },
    {
      id: "who-moments",
      title: "WHO 5 Moments",
      icon: "Droplets",
      color: "#0284c7",
      badge: "IMP",
      content: [
        {
          number: 1,
          title: "Before patient contact",
          description: "Before touching a patient",
          color: "#0284c7",
          bgColor: "#e0f2fe",
        },
        {
          number: 2,
          title: "Before aseptic procedure",
          description: "Before a clean or aseptic task",
          color: "#6d28d9",
          bgColor: "#f5f3ff",
        },
        {
          number: 3,
          title: "After body fluid exposure",
          description: "After exposure risk — needle-stick, splash, etc.",
          color: "#dc2626",
          bgColor: "#fee2e2",
        },
        {
          number: 4,
          title: "After patient contact",
          description: "After touching a patient",
          color: "#16a34a",
          bgColor: "#f0fdf4",
        },
        {
          number: 5,
          title: "After patient surroundings",
          description: "After touching the patient's environment",
          color: "#ea580c",
          bgColor: "#ffedd5",
        },
      ] as WhoMoment[],
    },
  ] as StationSection[],

  learning_objectives: [
    "Understand the rationale for standard precautions and why they apply to all patients",
    "Correctly perform hand hygiene at the 5 critical moments in patient care",
    "Demonstrate proper donning and doffing of PPE without contamination",
    "Identify high-touch surfaces and appropriate cleaning protocols",
    "Recognize when transmission-based precautions are required",
    "Apply infection control principles in clinical practice to prevent HAIs",
  ],

  important_points: [
    "Hand hygiene is the MOST EFFECTIVE way to prevent HAIs",
    "Alcohol-based hand rub is NOT effective for visible soiling, C. diff, or Norovirus",
    "The 5 moments of hand hygiene reduce patient mortality and morbidity",
    "Standard precautions apply to ALL patients, ALL the time",
    "Always perform hand hygiene between patient contacts",
  ],
};

// ────── STEPS TAB ─────────────────────────────────────────────────────────

export const INFECTION_CONTROL_STEPS: StepItem[] = [
  {
    step: 1,
    title: "Perform Initial Hand Hygiene",
    detail: "Before any patient contact, wash hands with soap and water or use alcohol-based hand rub for 20 seconds (or 30 seconds for visibly soiled hands).",
  },
  {
    step: 2,
    title: "Assess PPE Needs",
    detail: "Determine level of contact: routine care, body fluid exposure risk, droplet/airborne. Select appropriate PPE accordingly.",
  },
  {
    step: 3,
    title: "Don PPE (Correct Sequence)",
    detail: "Gown → Mask/Respirator → Eye protection → Gloves. Ensure gown covers torso, mask covers nose & mouth, gloves extend over gown cuff.",
  },
  {
    step: 4,
    title: "Perform Patient Care",
    detail: "Provide required clinical care using standard precautions: avoid touching face, minimize aerosol generation, handle equipment safely.",
  },
  {
    step: 5,
    title: "Manage Sharps Safely",
    detail: "Place used needles/sharps directly into puncture-resistant sharps container. Never re-cap or recap needles. Never pass sharps hand-to-hand.",
  },
  {
    step: 6,
    title: "Doff PPE (Correct Sequence)",
    detail: "Gloves → Eye protection → Gown → Mask/Respirator. Perform hand hygiene BETWEEN each step. Never touch contaminated surfaces.",
  },
  {
    step: 7,
    title: "Perform Final Hand Hygiene",
    detail: "After doffing, perform hand hygiene with soap and water or alcohol-based hand rub immediately.",
  },
  {
    step: 8,
    title: "Document Care Delivered",
    detail: "Record all interventions, observations, and any exposures or incidents in patient notes accurately and timely.",
  },
];

// ────── HAND HYGIENE STEPS ────────────────────────────────────────────────

export const HAND_HYGIENE_SOAP_STEPS: StepItem[] = [
  {
    step: 1,
    title: "Wet hands",
    detail: "Under running water — not too hot or cold",
  },
  {
    step: 2,
    title: "Apply soap",
    detail: "Enough to cover all hand surfaces",
  },
  {
    step: 3,
    title: "Palm to palm",
    detail: "Rub palms together vigorously",
  },
  {
    step: 4,
    title: "Back of hands",
    detail: "Right palm over left dorsum with interlaced fingers, vice versa",
  },
  {
    step: 5,
    title: "Interlace fingers",
    detail: "Palm to palm with fingers interlaced",
  },
  {
    step: 6,
    title: "Backs of fingers",
    detail: "Fingers interlocked, backs of fingers to opposing palms",
  },
  {
    step: 7,
    title: "Clean thumbs",
    detail: "Rotational rubbing of each thumb clasped in opposite palm",
  },
  {
    step: 8,
    title: "Clean fingertips",
    detail: "Rotational rubbing of fingertips in opposite palm",
  },
  {
    step: 9,
    title: "Rinse",
    detail: "Rinse hands thoroughly under running water",
  },
  {
    step: 10,
    title: "Dry",
    detail: "Dry thoroughly with a single-use towel",
  },
  {
    step: 11,
    title: "Turn off tap",
    detail: "Use the towel to turn off tap — avoid recontamination",
  },
];

export const HAND_HYGIENE_ALCOHOL_STEPS: StepItem[] = [
  {
    step: 1,
    title: "Apply product",
    detail: "Apply a palmful of alcohol rub to cupped hand",
  },
  {
    step: 2,
    title: "Palm to palm",
    detail: "Rub palms together covering all surfaces",
  },
  {
    step: 3,
    title: "Back of hands",
    detail: "Right palm over left dorsum with interlaced fingers, vice versa",
  },
  {
    step: 4,
    title: "Interlace fingers",
    detail: "Palm to palm with fingers interlaced",
  },
  {
    step: 5,
    title: "Backs of fingers",
    detail: "Fingers interlocked, backs of fingers to opposing palms",
  },
  {
    step: 6,
    title: "Clean thumbs",
    detail: "Rotational rubbing of each thumb clasped in opposite palm",
  },
  {
    step: 7,
    title: "Clean fingertips",
    detail: "Rotational rubbing of fingertips in opposite palm",
  },
  {
    step: 8,
    title: "Air dry",
    detail: "Allow hands to dry completely — do not wipe",
  },
];

// ────── FLASHCARDS TAB ────────────────────────────────────────────────────

export const INFECTION_CONTROL_FLASHCARDS: FlashcardItem[] = [
  {
    id: "ic01",
    category: "Standard Precautions",
    categoryColor: "#0284c7",
    categoryBg: "#EFF6FF",
    question: "What are standard precautions?",
    answer: "Basic infection control practices that apply to all patients to prevent transmission of pathogens, regardless of diagnosis or infection status. Include hand hygiene, PPE, safe injection practices, and environmental cleaning.",
  },
  {
    id: "ic02",
    category: "Hand Hygiene",
    categoryColor: "#db2777",
    categoryBg: "#FCF0F7",
    question: "Name the 5 moments of hand hygiene.",
    answer: "1. Before patient contact\n2. Before aseptic procedure\n3. After body fluid exposure risk\n4. After patient contact\n5. After contact with patient surroundings (WHO moments).",
  },
  {
    id: "ic03",
    category: "Hand Hygiene",
    categoryColor: "#db2777",
    categoryBg: "#FCF0F7",
    question: "How long should hand hygiene take when washing with soap and water?",
    answer: "20 seconds minimum (count to 20 or sing 'Happy Birthday' twice). For visibly soiled hands, use 30-60 seconds.",
  },
  {
    id: "ic04",
    category: "Hand Hygiene",
    categoryColor: "#db2777",
    categoryBg: "#FCF0F7",
    question: "When is alcohol-based hand rub preferred over soap and water?",
    answer: "When hands are not visibly soiled. Alcohol-based hand rub is faster (20 seconds), more effective against most pathogens, and does not require access to sink.",
  },
  {
    id: "ic05",
    category: "PPE",
    categoryColor: "#7c3aed",
    categoryBg: "#F5F3FF",
    question: "What is the correct DON sequence for PPE?",
    answer: "Gown → Mask/Respirator → Eye protection → Gloves. Put on gown first to fully cover body, then mask, then eye protection, finally gloves.",
  },
  {
    id: "ic06",
    category: "PPE",
    categoryColor: "#7c3aed",
    categoryBg: "#F5F3FF",
    question: "What is the correct DOFF sequence for PPE?",
    answer: "Gloves → Eye protection → Gown → Mask/Respirator. Remove gloves first (most contaminated), then eye protection, gown, and finally mask. Perform hand hygiene between each step.",
  },
  {
    id: "ic07",
    category: "PPE",
    categoryColor: "#7c3aed",
    categoryBg: "#F5F3FF",
    question: "How should gloves be removed to prevent contamination?",
    answer: "Pinch the outside of glove near wrist, peel downward turning inside-out. Hold removed glove in gloved hand. Slide fingers under wrist of remaining glove and peel inside-out.",
  },
  {
    id: "ic08",
    category: "Transmission-Based Precautions",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "When are contact precautions used?",
    answer: "For patients with infections spread by direct or indirect contact: MRSA, C. difficile, resistant gram-negatives, scabies. Additional precaution to standard precautions — wear gown and gloves.",
  },
  {
    id: "ic09",
    category: "Transmission-Based Precautions",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "When are droplet precautions used?",
    answer: "For infections spread by respiratory droplets within 6 feet: influenza, measles, meningococcus, whooping cough. Use surgical mask and maintain distance >1m from patient.",
  },
  {
    id: "ic10",
    category: "Transmission-Based Precautions",
    categoryColor: "#16a34a",
    categoryBg: "#F0FDF4",
    question: "When are airborne precautions used?",
    answer: "For infections spread by airborne droplet nuclei: TB, varicella (chickenpox), measles. Use N95/FFP2 respirator (fit-tested), isolate in negative pressure room if available.",
  },
  {
    id: "ic11",
    category: "Environmental Control",
    categoryColor: "#ea580c",
    categoryBg: "#FFFBEB",
    question: "What disinfectant is used for C. difficile contamination?",
    answer: "Chlorine-based disinfectant at 1000 ppm concentration. Alcohol-based products are ineffective against C. difficile spores; must use sporicidal agents.",
  },
  {
    id: "ic12",
    category: "Sharps Safety",
    categoryColor: "#DC2626",
    categoryBg: "#FEF2F2",
    question: "What is the safest practice when handling contaminated sharps?",
    answer: "Place directly into puncture-resistant sharps container. Never recap needles, never hand-pass sharps, never leave sharps in patient care areas. Fill containers only 3/4 full.",
  },
];

// ────── QUIZ TAB ──────────────────────────────────────────────────────────

export const INFECTION_CONTROL_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    tag: "Standard Precautions",
    question: "Standard precautions should be applied to:",
    options: [
      { key: "A", text: "Only patients with confirmed infections" },
      { key: "B", text: "All patients, regardless of diagnosis" },
      { key: "C", text: "Only high-risk patients in isolation" },
      { key: "D", text: "Only patients with bloodborne pathogen exposure" },
    ],
    correct: "B",
    explanation: "Standard precautions apply to ALL patients at ALL times, regardless of diagnosis or infection status. This is the fundamental principle of infection control.",
  },
  {
    id: "q2",
    tag: "Hand Hygiene",
    question: "Which of the following is NOT one of the 5 moments of hand hygiene?",
    options: [
      { key: "A", text: "Before patient contact" },
      { key: "B", text: "Before aseptic task" },
      { key: "C", text: "Before donning gloves" },
      { key: "D", text: "After body fluid exposure risk" },
    ],
    correct: "C",
    explanation: "The 5 moments are: before patient contact, before aseptic task, after body fluid exposure, after patient contact, and after contact with surroundings. Hand hygiene is performed before/after contact, not before donning gloves (though it's ideal).",
  },
  {
    id: "q3",
    tag: "Hand Hygiene",
    question: "How long should you wash hands with soap and water in standard patient care?",
    options: [
      { key: "A", text: "10 seconds" },
      { key: "B", text: "20 seconds" },
      { key: "C", text: "40 seconds" },
      { key: "D", text: "60 seconds" },
    ],
    correct: "B",
    explanation: "Standard hand washing should take at least 20 seconds. If hands are visibly soiled, increase to 30-60 seconds. A helpful memory aid: 'Happy Birthday' sung twice ≈ 20 seconds.",
  },
  {
    id: "q4",
    tag: "PPE",
    question: "What is the correct sequence for donning (putting on) PPE?",
    options: [
      { key: "A", text: "Gloves → Gown → Mask → Eye protection" },
      { key: "B", text: "Mask → Gown → Eye protection → Gloves" },
      { key: "C", text: "Gown → Mask → Eye protection → Gloves" },
      { key: "D", text: "Eye protection → Mask → Gown → Gloves" },
    ],
    correct: "C",
    explanation: "The correct DON sequence is: gown (covers torso) → mask (covers face) → eye protection → gloves (extends over gown cuff). This ensures proper coverage without contamination.",
  },
  {
    id: "q5",
    tag: "PPE",
    question: "What is the correct sequence for doffing (removing) PPE?",
    options: [
      { key: "A", text: "Gown → Mask → Eye protection → Gloves" },
      { key: "B", text: "Gloves → Eye protection → Gown → Mask" },
      { key: "C", text: "Mask → Eye protection → Gown → Gloves" },
      { key: "D", text: "Gloves → Gown → Eye protection → Mask" },
    ],
    correct: "B",
    explanation: "Correct DOFF sequence: gloves (most contaminated) → eye protection → gown → mask. Perform hand hygiene BETWEEN EACH STEP to prevent contamination.",
  },
  {
    id: "q6",
    tag: "Sharps Safety",
    question: "What should you do with a contaminated needle after injection?",
    options: [
      { key: "A", text: "Recap the needle and place in sharps bin" },
      { key: "B", text: "Place directly in sharps container without recapping" },
      { key: "C", text: "Pass it hand-to-hand to another staff member" },
      { key: "D", text: "Place in regular clinical waste bin" },
    ],
    correct: "B",
    explanation: "Never recap needles — this is the highest risk procedure for needlestick injury. Place directly into puncture-resistant sharps container. Never hand-pass sharps.",
  },
  {
    id: "q7",
    tag: "Transmission-Based Precautions",
    question: "A patient has confirmed TB (tuberculosis). What respiratory protection is required?",
    options: [
      { key: "A", text: "Standard surgical mask" },
      { key: "B", text: "N95/FFP2 fit-tested respirator" },
      { key: "C", text: "Droplet mask only" },
      { key: "D", text: "No special respiratory protection if patient is on antibiotics" },
    ],
    correct: "B",
    explanation: "TB requires airborne precautions with N95/FFP2 fit-tested respirator, negative pressure room, and engineering controls. Standard masks are insufficient for TB.",
  },
  {
    id: "q8",
    tag: "Environmental Control",
    question: "Which disinfectant should be used for cleaning surfaces contaminated with C. difficile?",
    options: [
      { key: "A", text: "Alcohol-based hand rub" },
      { key: "B", text: "Quaternary ammonium compounds" },
      { key: "C", text: "Chlorine-based disinfectant at 1000 ppm" },
      { key: "D", text: "Hydrogen peroxide only" },
    ],
    correct: "C",
    explanation: "C. difficile spores are resistant to alcohol and most disinfectants. Only sporicidal agents like chlorine at 1000 ppm (or bleach solution) are effective.",
  },
];

// ────── COMPARE TAB ───────────────────────────────────────────────────────

export const INFECTION_CONTROL_COMPARE_TABLE: CompareRow[] = [
  {
    feature: "Precaution Type",
    "Standard": "Applied to ALL patients",
    "Contact": "Used for specific conditions",
    "Droplet": "Used for specific conditions",
    "Airborne": "Used for specific conditions",
  },
  {
    feature: "Transmission Route",
    "Standard": "All routes (universal coverage)",
    "Contact": "Direct/indirect contact",
    "Droplet": "Respiratory droplets <6 feet",
    "Airborne": "Airborne droplet nuclei",
  },
  {
    feature: "PPE Required",
    "Standard": "Varies by task (gloves, gown, mask as needed)",
    "Contact": "Gloves + Gown always",
    "Droplet": "Surgical mask within 6 feet",
    "Airborne": "N95/FFP2 fit-tested respirator",
  },
  {
    feature: "Room Placement",
    "Standard": "Standard room",
    "Contact": "Private room preferred",
    "Droplet": "Private room preferred",
    "Airborne": "Negative pressure room required",
  },
  {
    feature: "Hand Hygiene",
    "Standard": "5 moments, essential",
    "Contact": "Critical, between patient contacts",
    "Droplet": "Standard practice",
    "Airborne": "Standard practice",
  },
  {
    feature: "Equipment Sharing",
    "Standard": "Clean between patients",
    "Contact": "Dedicated to patient",
    "Droplet": "Clean between patients",
    "Airborne": "Dedicated to patient",
  },
  {
    feature: "Examples",
    "Standard": "All patients: hand hygiene, safe injection",
    "Contact": "MRSA, C. difficile, scabies",
    "Droplet": "Flu, measles, meningococcus",
    "Airborne": "TB, varicella, COVID-19",
  },
];
