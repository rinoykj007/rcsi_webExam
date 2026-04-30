// ISBAR Communication content (ported from RCSIExamAgent)

export interface IsbarComponent {
  letter: string; full: string; question: string; color: string; bg: string;
  points: string[]; example: string;
}
export interface IsbarFlashCard {
  id: string; question: string; answer: string; category: string; categoryColor: string; categoryBg: string;
}
export interface IsbarQuizOption { key: string; text: string }
export interface IsbarQuizQuestion {
  id: string; tag: string; type: "mcq" | "scenario";
  scenario?: string; question: string; options: IsbarQuizOption[];
  correct: string; explanation: string;
}
export interface PracticeScenario {
  id: string; title: string; urgency: "High" | "Medium"; urgencyColor: string;
  context: string;
  modelAnswer: { identify: string; situation: string; background: string; assessment: string; recommendation: string };
  keyPoints: string[];
}
export interface CompareRow { feature: string; good: string; poor: string }

export const ISBAR_COMPONENTS: IsbarComponent[] = [
  {
    letter: "I", full: "Identify",
    question: "Who are you and who is the patient?",
    color: "#0284c7", bg: "#EFF6FF",
    points: [
      "State your name and role clearly",
      "Identify the patient: full name, age, ward/bed number",
      "Confirm you are speaking to the right person",
      "State the date and time of communication",
    ],
    example: '"I am Sarah, Staff Nurse on Ward 4B. I am calling about Mr John Murphy, 65 years old, Bed 12."',
  },
  {
    letter: "S", full: "Situation",
    question: "What is happening right now?",
    color: "#7c3aed", bg: "#F5F3FF",
    points: [
      "State the current problem clearly and concisely",
      "Describe what triggered the call",
      "Include onset and how quickly it developed",
      "State the urgency level",
    ],
    example: '"Mr Murphy has developed sudden onset shortness of breath in the last 20 minutes. His oxygen saturation has dropped to 88%."',
  },
  {
    letter: "B", full: "Background",
    question: "What is the clinical context?",
    color: "#16a34a", bg: "#F0FDF4",
    points: [
      "Reason for admission / primary diagnosis",
      "Relevant past medical history",
      "Current medications relevant to situation",
      "Recent vital signs trends",
      "Any recent investigations or results",
    ],
    example: '"He was admitted 3 days ago with community-acquired pneumonia. He has a background of COPD. He is on IV co-amoxiclav and salbutamol nebs."',
  },
  {
    letter: "A", full: "Assessment",
    question: "What do you think is happening?",
    color: "#D97706", bg: "#FFFBEB",
    points: [
      "State current vital signs (RR, SpO₂, HR, BP, Temp)",
      "Your clinical impression / concern",
      "NEWS2 or early warning score",
      "Any significant changes from baseline",
    ],
    example: '"His NEWS2 is 7 — high risk. RR 26, SpO₂ 88% on room air, HR 110, BP 95/60. I am concerned he may be deteriorating and possibly developing sepsis."',
  },
  {
    letter: "R", full: "Recommendation",
    question: "What do you need?",
    color: "#DC2626", bg: "#FEF2F2",
    points: [
      "State what you need clearly — review, investigation, medication",
      "Specify urgency (immediate / within 30 min / routine)",
      "Suggest next steps if appropriate",
      "Confirm the plan and read it back",
      "Document the communication",
    ],
    example: '"I would like you to come and review Mr Murphy immediately please. I have already applied oxygen therapy and positioned him upright."',
  },
];

export const CRITICAL_RULES = [
  "Always introduce yourself — name and role first",
  "Identify the patient clearly — name, age, location",
  "Be concise — no irrelevant information",
  "State your clinical concern explicitly",
  "Always end with a clear recommendation",
  "Confirm the plan — read back to the person",
  "Document the call: time, who you spoke to, outcome",
];

export const FULL_EXAMPLE = {
  scenario: "A 72-year-old woman, Mrs Anne Kelly, Bed 6 on Ward 2A, develops confusion and low blood pressure.",
  parts: [
    { letter: "I", color: "#0284c7", bg: "#EFF6FF", text: '"I am Nurse David, Staff Nurse on Ward 2A. I need to speak to the on-call doctor urgently."' },
    { letter: "S", color: "#7c3aed", bg: "#F5F3FF", text: '"I am calling about Mrs Anne Kelly, 72 years old, Bed 6. She has become acutely confused and her blood pressure has dropped significantly in the last 30 minutes."' },
    { letter: "B", color: "#16a34a", bg: "#F0FDF4", text: '"She was admitted yesterday for a urinary tract infection. She has diabetes and hypertension. She is on IV antibiotics and metformin has been held. Her BP was 130/80 this morning."' },
    { letter: "A", color: "#D97706", bg: "#FFFBEB", text: '"Her current observations: BP 85/50, HR 118, Temp 38.9°C, RR 24, SpO₂ 94%. NEWS2 score is 9 — high risk. I am concerned she may be developing septic shock."' },
    { letter: "R", color: "#DC2626", bg: "#FEF2F2", text: '"I need you to review Mrs Kelly immediately. I have applied oxygen, increased her IV fluids, and will take blood cultures now. Can you come to Ward 2A please?"' },
  ],
};

export const COMMON_MISTAKES = [
  { mistake: "Not introducing yourself",     why: "The receiver does not know who is calling or their role — breaks professional communication." },
  { mistake: "Too much irrelevant background", why: "Overloads the listener and buries the key concern. Stick to what is relevant." },
  { mistake: "Missing recommendation",        why: "The most common OSCE fail. Always end with what you need." },
  { mistake: "Not stating urgency",           why: "The receiver cannot prioritise appropriately without knowing if this is immediate or routine." },
  { mistake: "No read-back or confirmation",  why: "Communication is not complete until the plan is confirmed by both parties." },
  { mistake: "Speaking too fast or unstructured", why: "Clinical handover must be calm, clear, and structured — even under pressure." },
];

export const ISBAR_OSCE_STEPS = [
  { id: "p1", title: "Prepare",          detail: "Gather patient notes, recent observations, medication chart, and NEWS2 score before calling. Know your facts." },
  { id: "p2", title: "Identify (I)",     detail: "State your name, role, and ward. Identify the patient by full name, age, and bed number. Confirm you have reached the right person." },
  { id: "p3", title: "Situation (S)",    detail: "State the current problem clearly. What is happening? When did it start? How urgent is it?" },
  { id: "p4", title: "Background (B)",   detail: "Give relevant clinical context: reason for admission, relevant history, current medications, and recent observations." },
  { id: "p5", title: "Assessment (A)",   detail: 'Share current vital signs, NEWS2 score, and your clinical concern. Use language like "I am concerned about..." or "I think this patient may be..."' },
  { id: "p6", title: "Recommendation (R)", detail: "Clearly state what you need: urgent review, medication, investigation. Specify the timeframe (immediately / within 30 min)." },
  { id: "p7", title: "Confirm & Close",  detail: "Read back the plan agreed. Confirm the next steps. Thank the receiver. Document: time, who you spoke to, what was agreed." },
];

export const ISBAR_FLASHCARDS: IsbarFlashCard[] = [
  { id: "ib01", category: "Identify",      categoryColor: "#0284c7", categoryBg: "#EFF6FF",
    question: "What information must be stated in the Identify (I) step?",
    answer: "Your name and role, the patient's full name, age, ward and bed number, and confirmation that you are speaking to the correct person." },
  { id: "ib02", category: "Situation",     categoryColor: "#7c3aed", categoryBg: "#F5F3FF",
    question: "What does the Situation (S) step include?",
    answer: "The current problem, what triggered the call, onset and speed of deterioration, and the urgency level." },
  { id: "ib03", category: "Situation",     categoryColor: "#7c3aed", categoryBg: "#F5F3FF",
    question: "How should you open an ISBAR call?",
    answer: '"I am [name], [role] on [ward]. I am calling about [patient name], [age], [bed number]. I am concerned because..."' },
  { id: "ib04", category: "Background",    categoryColor: "#16a34a", categoryBg: "#F0FDF4",
    question: "What information belongs in Background (B)?",
    answer: "Reason for admission, relevant medical history, current medications (relevant ones), recent vital sign trends, and recent investigation results." },
  { id: "ib05", category: "Background",    categoryColor: "#16a34a", categoryBg: "#F0FDF4",
    question: "What is the rule for Background information in ISBAR?",
    answer: "Include only clinically relevant information. Avoid overloading the receiver — less is more. Stick to what directly relates to the current concern." },
  { id: "ib06", category: "Assessment",    categoryColor: "#D97706", categoryBg: "#FFFBEB",
    question: "What does the Assessment (A) step include?",
    answer: "Current vital signs (RR, SpO₂, HR, BP, Temp), NEWS2/early warning score, and your clinical impression/concern." },
  { id: "ib07", category: "Assessment",    categoryColor: "#D97706", categoryBg: "#FFFBEB",
    question: "What clinical scoring tool is commonly reported in the Assessment step?",
    answer: "NEWS2 (National Early Warning Score 2) — scores 0–3 (low), 5–6 (medium), ≥7 (high urgency)." },
  { id: "ib08", category: "Recommendation", categoryColor: "#DC2626", categoryBg: "#FEF2F2",
    question: "What must the Recommendation (R) step always include?",
    answer: "A clear request (review, investigation, medication), the urgency level (immediately / within 30 min / routine), and confirmation of the agreed plan." },
  { id: "ib09", category: "Recommendation", categoryColor: "#DC2626", categoryBg: "#FEF2F2",
    question: "Why is read-back important at the end of ISBAR?",
    answer: "Read-back confirms both parties have the same understanding of the plan and prevents miscommunication — a key patient safety step." },
  { id: "ib10", category: "OSCE Tips",     categoryColor: "#475569", categoryBg: "#F1F5F9",
    question: "Name 3 common ISBAR mistakes in OSCE exams.",
    answer: "1. Not introducing yourself\n2. Missing the recommendation at the end\n3. Not stating urgency or not confirming the plan" },
  { id: "ib11", category: "OSCE Tips",     categoryColor: "#475569", categoryBg: "#F1F5F9",
    question: "What does NEWS2 score ≥7 indicate?",
    answer: "High urgency — requires immediate escalation and clinical review. This must be stated clearly in the Assessment step." },
  { id: "ib12", category: "OSCE Tips",     categoryColor: "#475569", categoryBg: "#F1F5F9",
    question: "How should you state your clinical concern in Assessment?",
    answer: 'Use language like: "I am concerned that..." or "I think this patient may be deteriorating because..." — demonstrates clinical reasoning.' },
];

export const ISBAR_QUIZ: IsbarQuizQuestion[] = [
  {
    id: "q1", tag: "Identify", type: "mcq",
    question: "What is the FIRST thing you must state when making an ISBAR call?",
    options: [{ key: "A", text: "The patient's diagnosis" }, { key: "B", text: "Your name and role" }, { key: "C", text: "The patient's observations" }, { key: "D", text: "Your recommendation" }],
    correct: "B",
    explanation: "The 'I' (Identify) step comes first — always introduce yourself (name + role) before anything else.",
  },
  {
    id: "q2", tag: "Situation", type: "mcq",
    question: "Which of the following belongs in the Situation (S) step?",
    options: [{ key: "A", text: "Patient's past medical history" }, { key: "B", text: "Current medications" }, { key: "C", text: "The immediate problem and when it started" }, { key: "D", text: "Your clinical recommendation" }],
    correct: "C",
    explanation: "Situation = current problem right now. Past history belongs in Background, medications in Background, and recommendation in Recommendation.",
  },
  {
    id: "q3", tag: "Assessment", type: "mcq",
    question: "A patient has NEWS2 score of 7. What does this indicate?",
    options: [{ key: "A", text: "Low risk — routine monitoring" }, { key: "B", text: "Medium risk — increase monitoring" }, { key: "C", text: "High risk — urgent escalation required" }, { key: "D", text: "Normal — no action needed" }],
    correct: "C",
    explanation: "NEWS2 ≥7 = High urgency. Requires immediate escalation and clinical review.",
  },
  {
    id: "q4", tag: "Scenario", type: "scenario",
    scenario: "A nurse calls the doctor: \"The patient is not well, his breathing is bad, can you come?\" — No name given, no vitals, no background.",
    question: "What is the MOST critical missing element in this ISBAR?",
    options: [{ key: "A", text: "The ward name" }, { key: "B", text: "Patient identification, structured background, assessment data, and recommendation" }, { key: "C", text: "The time of the call" }, { key: "D", text: "The patient's diagnosis" }],
    correct: "B",
    explanation: "This call has almost nothing from ISBAR — no identify, no structured situation, no background, no assessment data, and the recommendation is vague.",
  },
  {
    id: "q5", tag: "Recommendation", type: "mcq",
    question: "After giving your recommendation, what must you ALWAYS do?",
    options: [{ key: "A", text: "Hang up immediately" }, { key: "B", text: "Document the call, confirm the plan with read-back" }, { key: "C", text: "Repeat the full ISBAR again" }, { key: "D", text: "Wait for the doctor to arrive first" }],
    correct: "B",
    explanation: "Always confirm and read back the agreed plan — this closes the loop. Then document: time, who you spoke to, what was agreed.",
  },
  {
    id: "q6", tag: "Scenario", type: "scenario",
    scenario: '"I am Nurse Maria, Ward 3A. Calling about Mrs Chen, 78, Bed 9. She has developed chest pain in the last 10 minutes. She was admitted for heart failure, has a history of MI, on aspirin and furosemide. HR 105, BP 145/90, RR 22, SpO₂ 94%, NEWS2 = 6. I am concerned about ACS. I need you to review her within 15 minutes and I have done an ECG."',
    question: "This ISBAR is missing which single element?",
    options: [{ key: "A", text: "Patient age" }, { key: "B", text: "The Identify step — nurse did not confirm she reached the right person" }, { key: "C", text: "Vital signs" }, { key: "D", text: "Nothing — this is a complete ISBAR" }],
    correct: "B",
    explanation: "Almost perfect! The only missing element is confirming she reached the correct person (doctor on-call) at the start of the Identify step.",
  },
  {
    id: "q7", tag: "Background", type: "mcq",
    question: "Which of the following should NOT be included in Background?",
    options: [{ key: "A", text: "Reason for admission" }, { key: "B", text: "Relevant past medical history" }, { key: "C", text: "Details of a hospital admission from 10 years ago unrelated to the current problem" }, { key: "D", text: "Current relevant medications" }],
    correct: "C",
    explanation: "Background must be concise and relevant. Unrelated historical information clutters the handover and distracts from the current concern.",
  },
  {
    id: "q8", tag: "OSCE Focus", type: "mcq",
    question: "In an OSCE, what phrase demonstrates excellent clinical reasoning in the Assessment step?",
    options: [{ key: "A", text: '"The patient is sick."' }, { key: "B", text: '"I\'m not sure what is wrong."' }, { key: "C", text: '"I am concerned this patient may be developing sepsis given hypotension and elevated temperature."' }, { key: "D", text: '"The doctor should know what to do."' }],
    correct: "C",
    explanation: "Assessment requires clinical reasoning — stating your concern and the clinical basis for it.",
  },
];

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: "sc1", title: "Shortness of Breath", urgency: "High", urgencyColor: "#DC2626",
    context: "Mr James O'Brien, 68 years old, Bed 5, Ward 6B. Admitted 2 days ago with pneumonia. PMH: COPD, hypertension. Current meds: IV co-amoxiclav, salbutamol nebs, amlodipine. At 2am he developed acute shortness of breath. Observations: RR 28, SpO₂ 86% on room air, HR 115, BP 100/65, Temp 38.4°C. NEWS2 = 10.",
    modelAnswer: {
      identify: "I am [Your Name], Staff Nurse on Ward 6B. I need to speak to the on-call doctor. I am calling about Mr James O'Brien, 68 years old, Bed 5, Ward 6B.",
      situation: "Mr O'Brien has developed acute shortness of breath in the last 15 minutes. His oxygen saturation has dropped to 86% on room air.",
      background: "He was admitted 2 days ago with community-acquired pneumonia. He has a background of COPD and hypertension. He is on IV co-amoxiclav and salbutamol nebulisers.",
      assessment: "Current observations: RR 28, SpO₂ 86% on room air, HR 115, BP 100/65, Temp 38.4°C. NEWS2 score is 10 — high urgency. I am concerned he may be deteriorating and developing sepsis.",
      recommendation: "I need you to review Mr O'Brien immediately please. I have applied 15L oxygen via non-rebreather mask and positioned him upright. I am also requesting an ABG and blood cultures.",
    },
    keyPoints: ["NEWS2 = 10 → state as URGENT", "Apply O₂ before calling — mention actions taken", "Use 'immediately' for high NEWS2"],
  },
  {
    id: "sc2", title: "Post-op Hypotension", urgency: "High", urgencyColor: "#DC2626",
    context: "Mrs Patricia Dunne, 55 years old, Bed 3, Surgical Ward. Day 1 post-op laparoscopic cholecystectomy. PMH: Type 2 diabetes. Current meds: IV paracetamol, enoxaparin, metformin (held). At 6pm BP dropped to 82/48. Observations: HR 124, RR 20, Temp 37.1°C, SpO₂ 97%. NEWS2 = 7. She is pale and clammy.",
    modelAnswer: {
      identify: "I am [Your Name], Staff Nurse on Surgical Ward. I need to speak to the surgical registrar on-call. I am calling about Mrs Patricia Dunne, 55 years old, Bed 3.",
      situation: "Mrs Dunne is Day 1 post-op laparoscopic cholecystectomy and has developed significant hypotension. Her blood pressure has dropped to 82/48 in the last 30 minutes.",
      background: "She had an uncomplicated laparoscopic cholecystectomy this morning. Background of Type 2 diabetes — metformin is currently held. She is on IV paracetamol and enoxaparin.",
      assessment: "Observations: BP 82/48, HR 124, RR 20, Temp 37.1°C, SpO₂ 97%. NEWS2 is 7. She is pale, clammy, and diaphoretic. I am concerned about possible post-operative haemorrhage or hypovolaemic shock.",
      recommendation: "I need you to review Mrs Dunne urgently. I have increased IV fluid rate, applied oxygen, and I am monitoring her closely. Can you come to the surgical ward immediately?",
    },
    keyPoints: ["State post-op day clearly", "Describe clinical appearance (pale, clammy)", "Suggest differential (haemorrhage/shock)"],
  },
  {
    id: "sc3", title: "Acute Confusion", urgency: "Medium", urgencyColor: "#D97706",
    context: "Mr Thomas Walsh, 81 years old, Bed 8, Ward 4. Admitted 5 days ago with a hip fracture — awaiting surgery. PMH: Mild dementia, AF, hypertension. Meds: warfarin, lisinopril, donepezil. Tonight he became acutely confused and agitated — new onset. Observations: Temp 38.6°C, HR 98 (irregular), BP 155/90, RR 18, SpO₂ 95%. NEWS2 = 4. Urine is dark and offensive-smelling.",
    modelAnswer: {
      identify: "I am [Your Name], Staff Nurse on Ward 4. I would like to speak to the on-call doctor. I am calling about Mr Thomas Walsh, 81 years old, Bed 8.",
      situation: "Mr Walsh has developed new onset acute confusion and agitation this evening. This is different from his baseline cognitive state.",
      background: "He was admitted 5 days ago with a right hip fracture, awaiting surgery. He has mild dementia, atrial fibrillation, and hypertension. He is on warfarin, lisinopril, and donepezil.",
      assessment: "Observations: Temp 38.6°C, HR 98 (irregular), BP 155/90, RR 18, SpO₂ 95%. NEWS2 is 4. I also note his urine is dark and offensive-smelling. I am concerned he may have a urinary tract infection causing acute delirium.",
      recommendation: "I would like you to review Mr Walsh within the next hour. I plan to collect a urine specimen for MC&S and have his blood cultures taken. Could you also consider prescribing a urinalysis order?",
    },
    keyPoints: ["State 'new onset' to flag change from baseline", "Include clinical clues (urine appearance)", "Suggest likely diagnosis (UTI/delirium)"],
  },
];

export const ISBAR_COMPARE_GOOD = {
  title: "Well-structured ISBAR",
  color: "#16a34a", bg: "#F0FDF4",
  script: [
    { label: "I", text: '"I am Nurse Emma, Ward 3B. I am calling about Mrs Brown, 72, Bed 4."' },
    { label: "S", text: '"She has developed chest pain and shortness of breath in the last 20 minutes."' },
    { label: "B", text: '"Admitted for heart failure, history of MI. On furosemide, bisoprolol, aspirin."' },
    { label: "A", text: '"BP 145/95, HR 108, RR 24, SpO₂ 92%. NEWS2 = 7. I am concerned about possible ACS."' },
    { label: "R", text: '"I need you to review her immediately. ECG is done. Can you come to Ward 3B now?"' },
  ],
  strengths: ["Clear identity", "Concise situation", "Relevant background only", "NEWS2 stated", "Specific recommendation with urgency", "Actions already taken mentioned"],
};

export const ISBAR_COMPARE_POOR = {
  title: "Poorly structured ISBAR",
  color: "#DC2626", bg: "#FEF2F2",
  script: [
    { label: "?", text: '"Hello, it\'s the nurse from upstairs."' },
    { label: "?", text: '"The patient in Bed 4 is not doing too well and has some chest pain I think, or maybe it\'s her back, she had back problems before."' },
    { label: "?", text: '"She has loads of medical history — diabetes, high blood pressure, previous MI, reflux, knee replacement in 2015..."' },
    { label: "?", text: '"Her observations are somewhere in the chart if you want to check."' },
    { label: "?", text: '"Anyway, can you maybe come when you\'re free?"' },
  ],
  errors: ["No name or role stated", "No patient identification", "Vague symptom description", "Irrelevant background included", "No vital signs or NEWS2", "No urgency stated", "Recommendation is vague — \"when free\""],
};
