// Practical (OSCE) Preparation — static per-station practice content.
// Content shapes reuse the interfaces defined in infectionControlContent.ts.

import {
  StepItem,
  FlashcardItem,
  QuizQuestion,
  CompareRow,
  INFECTION_CONTROL_STEPS,
  INFECTION_CONTROL_FLASHCARDS,
  INFECTION_CONTROL_QUIZ,
  INFECTION_CONTROL_COMPARE_TABLE,
} from "@/data/infectionControlContent";

export interface PracticalTopicContent {
  title: string;
  intro: string;
  examTips: string[];
  steps: StepItem[];
  checklist: FlashcardItem[];
  quiz: QuizQuestion[];
  compare?: CompareRow[];
}

// Shared category colour pairs
const C = {
  blue: { color: "#0284c7", bg: "#EFF6FF" },
  pink: { color: "#db2777", bg: "#FCF0F7" },
  green: { color: "#16a34a", bg: "#F0FDF4" },
  amber: { color: "#d97706", bg: "#FFFBEB" },
  violet: { color: "#7c3aed", bg: "#F5F3FF" },
  red: { color: "#dc2626", bg: "#FEF2F2" },
  teal: { color: "#0d9488", bg: "#F0FDFA" },
};

export const PRACTICAL_CONTENT: Record<string, PracticalTopicContent> = {
  // ── Station 1: Infection Control ────────────────────────────────────────
  infection_control: {
    title: "Hand Hygiene & PPE Technique",
    intro:
      "This station tests your practical infection-control technique: WHO 6-step hand hygiene, correct donning and doffing of PPE, and applying standard precautions. Examiners watch sequence, timing and whether you verbalise each moment of hand hygiene.",
    examTips: [
      "Verbalise what you are doing and why — silent competence scores fewer marks than narrated technique.",
      "Hand hygiene timing matters: 20–30 seconds for alcohol rub, 40–60 seconds for soap and water.",
      "Know the donning order (gown → mask → eye protection → gloves) and the reverse-risk doffing order.",
      "If you contaminate yourself mid-procedure, say so and correct it — recognising the breach earns marks.",
    ],
    steps: INFECTION_CONTROL_STEPS,
    checklist: INFECTION_CONTROL_FLASHCARDS,
    quiz: INFECTION_CONTROL_QUIZ,
    compare: INFECTION_CONTROL_COMPARE_TABLE,
  },

  // ── Station 2: Fundamentals of Nursing ──────────────────────────────────
  fundamentals: {
    title: "Core Assessments: MUST, Urinalysis & Catheter Care",
    intro:
      "This station tests fundamental nursing assessments — completing a MUST nutritional screen, performing and interpreting a urinalysis, and demonstrating safe urinary catheter care. Expect to explain your findings and the escalation you would take.",
    examTips: [
      "For MUST, always state all three components: BMI score, weight-loss score and acute disease effect score.",
      "When reading a urinalysis strip, wait the full manufacturer time before interpreting each pad.",
      "Catheter care is an aseptic-adjacent task — clean gloves, single-wipe strokes away from the meatus.",
      "Link every abnormal finding to an action: document, inform the nurse in charge, or escalate to the doctor.",
    ],
    steps: [
      { step: 1, title: "Introduce Yourself & Gain Consent", detail: "Identify the patient (name and date of birth), explain the assessment, and obtain verbal consent. Decontaminate hands before starting." },
      { step: 2, title: "Gather & Check Equipment", detail: "Urinalysis: fresh sample, reagent strips (check expiry), gloves, apron, timer. MUST: scales, stadiometer, MUST chart. Catheter care: wipes, clean gloves, drainage bag stand." },
      { step: 3, title: "Complete MUST Step 1 — BMI", detail: "Measure height and weight, calculate BMI. Score 0 if BMI >20, score 1 if 18.5–20, score 2 if <18.5." },
      { step: 4, title: "Complete MUST Steps 2 & 3", detail: "Score unplanned weight loss over 3–6 months (0: <5%, 1: 5–10%, 2: >10%) and add 2 if the patient is acutely ill with no nutritional intake for >5 days." },
      { step: 5, title: "Total MUST Score & Plan", detail: "0 = low risk (routine repeat screening), 1 = medium risk (observe, food chart), 2+ = high risk (refer to dietitian, implement care plan)." },
      { step: 6, title: "Perform Urinalysis Safely", detail: "Don gloves and apron. Check sample is fresh and labelled. Dip the strip fully, tap off excess, hold horizontally and time each pad per the bottle instructions." },
      { step: 7, title: "Interpret & Report Urinalysis", detail: "Read against the bottle chart: note leucocytes, nitrites, protein, blood, glucose, ketones, pH and specific gravity. Nitrites + leucocytes suggest UTI — report and consider MSU for culture." },
      { step: 8, title: "Assess the Catheter System", detail: "Check the catheter is secured, the drainage bag is below bladder level but off the floor, tubing is not kinked, and note urine colour, clarity and volume." },
      { step: 9, title: "Perform Meatal Hygiene", detail: "With clean gloves, wash the meatus and proximal catheter with soap and water or wipes, single strokes away from the meatus. Never disconnect the closed system." },
      { step: 10, title: "Document & Escalate", detail: "Record all findings, scores and actions. Verbalise when you would escalate: MUST ≥2, positive urinalysis with symptoms, catheter bypassing, blocked or cloudy/offensive urine." },
    ],
    checklist: [
      { id: "fn01", category: "MUST", ...catColor("blue"), question: "What are the 3 scored components of MUST?", answer: "1. BMI score\n2. Unplanned weight-loss score (3–6 months)\n3. Acute disease effect score (add 2 if acutely ill and no intake >5 days)." },
      { id: "fn02", category: "MUST", ...catColor("blue"), question: "What actions follow a MUST score of 2 or more?", answer: "High risk: refer to the dietitian or implement local nutrition policy, set goals, improve intake, and monitor/review the care plan weekly (hospital)." },
      { id: "fn03", category: "Urinalysis", ...catColor("amber"), question: "Which two strip findings together most suggest a UTI?", answer: "Positive nitrites and positive leucocyte esterase — send an MSU for culture and sensitivity and report to the nurse in charge/doctor." },
      { id: "fn04", category: "Urinalysis", ...catColor("amber"), question: "What can glucose and ketones in urine indicate?", answer: "Glycosuria suggests hyperglycaemia/diabetes; ketonuria suggests fasting, vomiting or diabetic ketoacidosis — check a capillary blood glucose and escalate." },
      { id: "fn05", category: "Catheter Care", ...catColor("green"), question: "Where should a urinary drainage bag be positioned?", answer: "Below the level of the bladder to allow drainage and prevent backflow, but off the floor to prevent contamination. Tubing free of kinks." },
      { id: "fn06", category: "Catheter Care", ...catColor("green"), question: "Why must the closed drainage system never be broken?", answer: "Breaking the closed system introduces bacteria and greatly increases the risk of catheter-associated urinary tract infection (CAUTI)." },
      { id: "fn07", category: "Pressure Care", ...catColor("violet"), question: "What does the Waterlow score assess?", answer: "Pressure ulcer risk — using build/weight, skin type, sex/age, malnutrition, continence, mobility plus special risk factors (tissue malnutrition, neuro deficit, surgery, medication)." },
    ],
    quiz: [
      { id: "fq1", tag: "MUST", question: "A patient has BMI 19, 7% unplanned weight loss and is not acutely ill. What is their MUST score?", options: [ { key: "A", text: "1" }, { key: "B", text: "2" }, { key: "C", text: "3" }, { key: "D", text: "0" } ], correct: "B", explanation: "BMI 18.5–20 scores 1, weight loss 5–10% scores 1, no acute disease effect scores 0. Total = 2 → high risk, refer to dietitian." },
      { id: "fq2", tag: "Urinalysis", question: "Before dipping a urinalysis strip you should FIRST:", options: [ { key: "A", text: "Shake the sample vigorously" }, { key: "B", text: "Check strip expiry date and sample freshness" }, { key: "C", text: "Add the sample to a sterile pot" }, { key: "D", text: "Refrigerate the sample" } ], correct: "B", explanation: "Expired strips and old samples give false results. Always check expiry, that the lid was sealed, and that the sample is fresh (ideally <2 hours)." },
      { id: "fq3", tag: "Catheter Care", question: "During routine catheter care you should clean:", options: [ { key: "A", text: "From the drainage bag toward the meatus" }, { key: "B", text: "In circular scrubbing motions at the meatus" }, { key: "C", text: "From the meatus outward along the catheter, single strokes" }, { key: "D", text: "Only the drainage bag outlet" } ], correct: "C", explanation: "Clean away from the meatus with single strokes to avoid dragging organisms toward the urethra, using soap and water or approved wipes." },
      { id: "fq4", tag: "Escalation", question: "Urinalysis shows 3+ protein and blood in a patient with new ankle swelling. Your best action is:", options: [ { key: "A", text: "Discard and repeat tomorrow" }, { key: "B", text: "Document only" }, { key: "C", text: "Report to the doctor and send a formal sample" }, { key: "D", text: "Increase oral fluids and re-test" } ], correct: "C", explanation: "Significant proteinuria with haematuria and oedema may indicate renal disease — it needs medical review and a formal laboratory sample, not observation alone." },
      { id: "fq5", tag: "Nutrition", question: "Which patient should have a food/fluid intake chart commenced?", options: [ { key: "A", text: "MUST score 0" }, { key: "B", text: "MUST score 1" }, { key: "C", text: "Only patients on IV fluids" }, { key: "D", text: "Only patients who request one" } ], correct: "B", explanation: "MUST 1 = medium risk: document intake for 3 days and re-assess. Score 0 is routine re-screening; score ≥2 adds dietitian referral." },
    ],
    compare: [
      { feature: "Purpose", "MUST": "Malnutrition risk screening", "Waterlow": "Pressure ulcer risk assessment" },
      { feature: "Key Components", "MUST": "BMI, weight loss, acute disease effect", "Waterlow": "Build, skin type, age/sex, continence, mobility, special risks" },
      { feature: "High-risk Action", "MUST": "Score ≥2 → dietitian referral, care plan", "Waterlow": "Score ≥20 → pressure-relieving equipment, repositioning plan" },
      { feature: "Frequency", "MUST": "Weekly in hospital, or on clinical change", "Waterlow": "On admission and re-assess with any change in condition" },
    ],
  },

  // ── Station 3: ISBAR Communication ──────────────────────────────────────
  isbar: {
    title: "ISBAR Clinical Handover",
    intro:
      "This station tests structured communication — usually a telephone referral or shift handover about a deteriorating patient using ISBAR. Examiners score whether every ISBAR element is present, ordered and concise, and whether you close the loop.",
    examTips: [
      "Write brief ISBAR notes before you pick up the phone — reading vitals from a NEWS chart is expected.",
      "Open with Identification of yourself AND the patient — the most commonly dropped element under pressure.",
      "Finish with a clear Recommendation and a question: \"Will you come to review the patient now?\"",
      "Read back any orders received (closed-loop communication) and state when you will re-escalate.",
    ],
    steps: [
      { step: 1, title: "Prepare Before Calling", detail: "Assess the patient yourself, gather the chart, latest vital signs/NEWS score, medication record and allergies. Know why you are calling and what you want." },
      { step: 2, title: "I — Identification", detail: "Identify yourself (name, role, ward), confirm who you are speaking to, and identify the patient: name, age, location and consultant." },
      { step: 3, title: "S — Situation", detail: "State the immediate problem in one or two sentences: \"I am calling because Mr Murphy has become acutely short of breath with oxygen saturations of 88% on room air.\"" },
      { step: 4, title: "B — Background", detail: "Give relevant history only: admission reason and date, key comorbidities, recent procedures, current treatment and allergies." },
      { step: 5, title: "A — Assessment (Findings)", detail: "Report current observations in ABCDE order with the NEWS/EWS score, plus your clinical impression: \"NEWS is 7; I think he may be developing pneumonia.\"" },
      { step: 6, title: "R — Recommendation", detail: "Say what you need and how urgently: immediate review, prescriptions, investigations. Ask a direct question and agree a timeframe." },
      { step: 7, title: "Close the Loop", detail: "Read back verbal orders word-for-word, clarify anything unclear, and confirm who is doing what. Never accept an unclear order." },
      { step: 8, title: "Document the Handover", detail: "Record the time, who you spoke to, what was communicated, orders received and the agreed plan. Continue monitoring and re-escalate if there is no response." },
    ],
    checklist: [
      { id: "is01", category: "Identification", ...catColor("blue"), question: "What belongs in the Identification step of ISBAR?", answer: "Your name, role and location; confirmation of who you are speaking to; and the patient's name, age, location and consultant/team." },
      { id: "is02", category: "Situation", ...catColor("red"), question: "How long should the Situation statement be?", answer: "One or two sentences stating the immediate clinical concern — the reason for the call — without history or observations (they come later)." },
      { id: "is03", category: "Background", ...catColor("amber"), question: "What background information is relevant?", answer: "Admission date and reason, significant medical history, current treatments/IVs, recent surgery or procedures, allergies and resuscitation status if relevant." },
      { id: "is04", category: "Assessment", ...catColor("green"), question: "In what order should you report your findings?", answer: "ABCDE order with current vital signs and the NEWS/EWS score, followed by your own clinical impression of what is going on." },
      { id: "is05", category: "Recommendation", ...catColor("violet"), question: "What makes a strong Recommendation?", answer: "A specific request with a timeframe (\"Please review within 15 minutes\"), asking what you should do in the meantime, and agreeing when to call back." },
      { id: "is06", category: "Safety", ...catColor("pink"), question: "How do you safely accept a verbal/telephone order?", answer: "Repeat the order back word-for-word (closed loop), have a second nurse listen where policy requires, document it, and have it signed at the earliest opportunity." },
    ],
    quiz: [
      { id: "iq1", tag: "ISBAR", question: "\"Mrs Byrne's NEWS has risen from 2 to 6 in the last hour\" belongs in which ISBAR element?", options: [ { key: "A", text: "Identification" }, { key: "B", text: "Background" }, { key: "C", text: "Assessment" }, { key: "D", text: "Recommendation" } ], correct: "C", explanation: "Current observations, trends and the NEWS score are your Assessment findings. Background covers history, not current findings." },
      { id: "iq2", tag: "ISBAR", question: "The FIRST thing to state on an escalation phone call is:", options: [ { key: "A", text: "The patient's vital signs" }, { key: "B", text: "Who you are, your ward, and the patient's identity" }, { key: "C", text: "The working diagnosis" }, { key: "D", text: "Your recommendation" } ], correct: "B", explanation: "Identification comes first: yourself, your location, who you are speaking with, then the patient's identifying details." },
      { id: "iq3", tag: "Closed Loop", question: "A doctor gives a telephone order for IV furosemide. You should:", options: [ { key: "A", text: "Give it and note it later" }, { key: "B", text: "Ask the ward clerk to document it" }, { key: "C", text: "Repeat the order back, document, and have it signed as per policy" }, { key: "D", text: "Refuse all telephone orders" } ], correct: "C", explanation: "Closed-loop communication: read back the drug, dose, route and frequency, document the order and the read-back, and get it signed within the required timeframe." },
      { id: "iq4", tag: "Preparation", question: "Before phoning about a deteriorating patient you should have to hand:", options: [ { key: "A", text: "Only the drug chart" }, { key: "B", text: "The chart, latest observations/NEWS, medications and allergies" }, { key: "C", text: "Nothing — speed matters most" }, { key: "D", text: "The patient's full historical file read in advance" } ], correct: "B", explanation: "Preparation makes the call effective: assess the patient yourself and have the observation chart, NEWS score, medication record and allergies available." },
      { id: "iq5", tag: "Escalation", question: "You gave a clear ISBAR handover 20 minutes ago; nobody has reviewed the patient and NEWS is now higher. You should:", options: [ { key: "A", text: "Wait another hour" }, { key: "B", text: "Re-escalate up the chain per policy and document" }, { key: "C", text: "Assume the doctor is busy and continue observations" }, { key: "D", text: "Ask the family to call the doctor" } ], correct: "B", explanation: "If the response is inadequate and the patient is deteriorating, re-escalate to a more senior clinician per the escalation policy, and document every step." },
    ],
    compare: [
      { feature: "I — Identification", "Strong handover": "Names self, role, ward; full patient ID", "Weak handover": "Launches into the story with no identities" },
      { feature: "S — Situation", "Strong handover": "One-line reason for the call", "Weak handover": "Long unfocused narrative" },
      { feature: "A — Assessment", "Strong handover": "ABCDE findings + NEWS + impression", "Weak handover": "Random values, no score or impression" },
      { feature: "R — Recommendation", "Strong handover": "Specific request with timeframe, loop closed", "Weak handover": "\"Just letting you know\" — no ask, no read-back" },
    ],
  },

  // ── Station 4: Sepsis Management ─────────────────────────────────────────
  sepsis: {
    title: "Sepsis Recognition & the Sepsis Six",
    intro:
      "This station tests recognition of the deteriorating septic patient and delivery of the Sepsis Six within one hour. You may be given a NEWS chart and asked to assess, escalate and start the bundle, verbalising each element.",
    examTips: [
      "State the time out loud when sepsis is suspected — the Sepsis Six is a one-hour bundle.",
      "Remember \"3 in, 3 out\": IN — oxygen, fluids, antibiotics; OUT — blood cultures, lactate, urine output.",
      "Cultures before antibiotics — but never let cultures delay antibiotics beyond the hour.",
      "A NEWS2 of 5+ (or 3 in one parameter) with suspected infection should trigger sepsis screening and urgent review.",
    ],
    steps: [
      { step: 1, title: "Recognise the At-Risk Patient", detail: "Complete a full set of observations and calculate NEWS2. Suspect sepsis with NEWS2 ≥5 (or ≥3 in one parameter) plus signs or history of infection." },
      { step: 2, title: "Screen & Declare Sepsis", detail: "Apply the sepsis screening tool. Look for red flags: new confusion, RR ≥25, SpO2 <92%, SBP ≤90, HR ≥130, no urine for 18 hours, mottled skin, non-blanching rash." },
      { step: 3, title: "Escalate Immediately", detail: "Call for urgent senior/medical review using ISBAR. State \"I am concerned this patient has sepsis\" and note the time — the one-hour clock has started." },
      { step: 4, title: "Give High-Flow Oxygen", detail: "Administer oxygen to target SpO2 94–98% (88–92% if at risk of hypercapnic respiratory failure, e.g. COPD)." },
      { step: 5, title: "Take Blood Cultures", detail: "Take at least one set of blood cultures (plus other cultures as indicated) before antibiotics — without delaying antibiotics beyond one hour." },
      { step: 6, title: "Give IV Antibiotics", detail: "Administer broad-spectrum IV antibiotics per local policy within the hour, after checking allergies. Prompt the prescriber if needed." },
      { step: 7, title: "Give IV Fluids", detail: "Give an IV crystalloid bolus (e.g. 500 mL, up to 30 mL/kg per local protocol) for hypotension or lactate ≥2 mmol/L, reassessing after each bolus." },
      { step: 8, title: "Check Serum Lactate", detail: "Take a venous/arterial lactate. Lactate >2 mmol/L indicates hypoperfusion; >4 mmol/L is critical — inform the senior clinician and consider critical-care referral." },
      { step: 9, title: "Measure Urine Output", detail: "Start a fluid balance chart; consider urinary catheterisation for accurate hourly output. Target ≥0.5 mL/kg/hr." },
      { step: 10, title: "Reassess & Document", detail: "Repeat observations and NEWS2 after each intervention, document all times and actions, and re-escalate (critical care) if the patient fails to respond." },
    ],
    checklist: [
      { id: "sp01", category: "Definition", ...catColor("red"), question: "Define sepsis.", answer: "Life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock adds persisting hypotension needing vasopressors plus lactate >2 mmol/L despite fluids." },
      { id: "sp02", category: "Sepsis Six", ...catColor("blue"), question: "List the Sepsis Six.", answer: "GIVE 3: high-flow oxygen, IV antibiotics, IV fluids.\nTAKE 3: blood cultures, serum lactate, urine output measurement.\nAll within one hour." },
      { id: "sp03", category: "Recognition", ...catColor("amber"), question: "Name four red-flag signs of sepsis.", answer: "New confusion/reduced GCS; RR ≥25; SpO2 <92%; systolic BP ≤90 mmHg; HR ≥130; anuria for 18 hours; mottled/ashen skin; non-blanching rash." },
      { id: "sp04", category: "NEWS2", ...catColor("green"), question: "What NEWS2 score should trigger a sepsis screen?", answer: "NEWS2 of 5 or more (or 3 in any single parameter) in a patient with suspected or confirmed infection triggers screening and urgent clinical review." },
      { id: "sp05", category: "Lactate", ...catColor("violet"), question: "Why is lactate measured, and what values matter?", answer: "Lactate reflects tissue hypoperfusion. >2 mmol/L supports sepsis with hypoperfusion; >4 mmol/L indicates severe hypoperfusion — escalate to critical care." },
      { id: "sp06", category: "Fluids", ...catColor("pink"), question: "What fluid resuscitation is given in sepsis?", answer: "IV crystalloid boluses (e.g. 500 mL over <15 min, up to 30 mL/kg per protocol) for hypotension or lactate ≥2, with reassessment for response and overload after each bolus." },
    ],
    quiz: [
      { id: "sq1", tag: "Sepsis Six", question: "Which is NOT part of the Sepsis Six?", options: [ { key: "A", text: "Blood cultures" }, { key: "B", text: "IV antibiotics" }, { key: "C", text: "Chest X-ray" }, { key: "D", text: "Serum lactate" } ], correct: "C", explanation: "Imaging may help find the source but is not part of the bundle. The six: oxygen, cultures, antibiotics, fluids, lactate, urine output." },
      { id: "sq2", tag: "Timing", question: "The Sepsis Six should be completed within:", options: [ { key: "A", text: "15 minutes" }, { key: "B", text: "1 hour" }, { key: "C", text: "4 hours" }, { key: "D", text: "24 hours" } ], correct: "B", explanation: "Every element of the Sepsis Six should be delivered within one hour of sepsis recognition — mortality rises with each hour of delay." },
      { id: "sq3", tag: "Sequence", question: "Blood cultures should ideally be taken:", options: [ { key: "A", text: "After the first antibiotic dose" }, { key: "B", text: "Before antibiotics, without delaying them" }, { key: "C", text: "Only if temperature is >39°C" }, { key: "D", text: "After fluid resuscitation" } ], correct: "B", explanation: "Cultures before antibiotics maximises the chance of identifying the organism — but antibiotics must not be delayed beyond the hour if cultures are difficult." },
      { id: "sq4", tag: "Recognition", question: "An 82-year-old with a UTI becomes newly confused; BP 88/54, RR 26. This is best described as:", options: [ { key: "A", text: "Simple UTI — oral antibiotics" }, { key: "B", text: "Red-flag sepsis — start Sepsis Six and escalate now" }, { key: "C", text: "Dehydration — encourage oral fluids" }, { key: "D", text: "Normal ageing" } ], correct: "B", explanation: "New confusion, hypotension and tachypnoea with infection are red flags: declare sepsis, escalate immediately and begin the bundle." },
      { id: "sq5", tag: "Oxygen", question: "Target oxygen saturations for a septic patient with COPD at risk of CO2 retention are:", options: [ { key: "A", text: "94–98%" }, { key: "B", text: "88–92%" }, { key: "C", text: "100%" }, { key: "D", text: "85–88%" } ], correct: "B", explanation: "In hypercapnic-risk patients target 88–92%; otherwise target 94–98%. Oxygen is still given — the target range changes, not the principle." },
    ],
    compare: [
      { feature: "Definition", "Sepsis": "Organ dysfunction from dysregulated response to infection", "Septic Shock": "Sepsis + vasopressors needed + lactate >2 despite fluids" },
      { feature: "Blood Pressure", "Sepsis": "May be normal or low", "Septic Shock": "Persistent hypotension despite fluid resuscitation" },
      { feature: "Lactate", "Sepsis": "May be normal or raised", "Septic Shock": ">2 mmol/L despite adequate fluids" },
      { feature: "Management Focus", "Sepsis": "Sepsis Six within 1 hour", "Septic Shock": "Sepsis Six + critical care, vasopressors" },
      { feature: "Mortality", "Sepsis": "Significant", "Septic Shock": "Markedly higher — medical emergency" },
    ],
  },

  // ── Station 5: Death & Dying ─────────────────────────────────────────────
  death_dying: {
    title: "End-of-Life & Last Offices Care",
    intro:
      "This station tests compassionate end-of-life nursing: recognising the dying phase, symptom and comfort care, supporting the family, and performing care after death (last offices) with dignity and cultural sensitivity.",
    examTips: [
      "Dignity and privacy first — verbalise closing curtains, speaking respectfully, and continuing to talk to the patient.",
      "Know your local policy boundaries: verification of death is a clinical role; nurses provide care after death.",
      "Always ask about religious, spiritual and cultural wishes before starting last offices — never assume.",
      "Mention your own limits: seek support from senior staff, chaplaincy or bereavement services where needed.",
    ],
    steps: [
      { step: 1, title: "Recognise the Dying Phase", detail: "Signs include reduced consciousness, minimal oral intake, changed breathing patterns (Cheyne–Stokes), peripheral mottling and reduced urine output. Communicate findings to the team and family." },
      { step: 2, title: "Prioritise Comfort Care", detail: "Manage pain, dyspnoea, secretions, agitation and dry mouth per the individualised care plan. Reposition gently, provide mouth and eye care, stop non-essential observations and medications as directed." },
      { step: 3, title: "Support the Family", detail: "Offer honest, gentle information, open visiting, and practical comforts. Listen more than you speak. Offer chaplaincy/pastoral care and explain what to expect as death approaches." },
      { step: 4, title: "At the Time of Death", detail: "Note the time, ensure privacy, and inform the doctor/senior nurse — death must be verified by an appropriate clinician before last offices proceed." },
      { step: 5, title: "Establish Wishes & Requirements", detail: "Check documentation and ask the family about religious/cultural requirements, whether they wish to help with washing, and any items to remain with the patient." },
      { step: 6, title: "Prepare for Last Offices", detail: "Gather equipment: wash kit, clean gown/shroud, identification bands and labels, documentation. Two nurses; standard precautions with gloves and apron." },
      { step: 7, title: "Perform Care After Death", detail: "Lay the patient flat with one pillow, close the eyes, wash and dress the patient respectfully, dress wounds and leave devices in place if a coroner referral applies (follow policy)." },
      { step: 8, title: "Identification & Property", detail: "Apply identification per policy, record and secure jewellery and belongings with a witness, and return property to the family sensitively — nothing removed without documentation." },
      { step: 9, title: "Documentation & Transfer", detail: "Complete all documentation: date/time of death, verification details, property records and notifications. Arrange dignified transfer to the mortuary per policy." },
      { step: 10, title: "Aftercare & Self-Care", detail: "Offer the family bereavement information and time with their loved one. Debrief with colleagues — acknowledging the emotional impact of end-of-life care is professional, not weak." },
    ],
    checklist: [
      { id: "dd01", category: "Recognition", ...catColor("blue"), question: "Name four signs that a patient may be entering the dying phase.", answer: "Increasing drowsiness/reduced consciousness, minimal oral intake, changes in breathing (e.g. Cheyne–Stokes), peripheral cyanosis/mottling, reduced urine output, becoming bedbound." },
      { id: "dd02", category: "Comfort", ...catColor("green"), question: "What are the key comfort measures for a dying patient?", answer: "Pain and symptom control, regular mouth and eye care, gentle repositioning, managing secretions and agitation, a calm environment, and stopping burdensome interventions per the care plan." },
      { id: "dd03", category: "Roles", ...catColor("amber"), question: "Who verifies death, and what is the nurse's role?", answer: "A doctor (or specially trained nurse where policy allows) verifies death. The nurse notes the time, informs the clinician and family, and provides care after death once verification is complete." },
      { id: "dd04", category: "Culture", ...catColor("violet"), question: "Why must cultural and religious wishes be checked before last offices?", answer: "Faiths differ on who may touch the body, washing rituals, positioning, jewellery and timing of burial. Assuming causes real distress — ask the family and check documentation first." },
      { id: "dd05", category: "Coroner", ...catColor("red"), question: "When must lines and devices be left in place after death?", answer: "When the death is reportable to the coroner (e.g. unexpected, post-procedure, unknown cause) — leave cannulae, tubes and dressings in situ and follow local coroner policy." },
      { id: "dd06", category: "Communication", ...catColor("pink"), question: "What principles guide breaking news of a death to relatives?", answer: "Private setting, warn-pause-deliver using clear words (\"has died\"), allow silence and emotion, avoid euphemisms and platitudes, offer to answer questions and provide bereavement support." },
    ],
    quiz: [
      { id: "dq1", tag: "Last Offices", question: "Before performing last offices, the nurse must FIRST ensure:", options: [ { key: "A", text: "The family has left the hospital" }, { key: "B", text: "Death has been formally verified" }, { key: "C", text: "The bed is needed for another patient" }, { key: "D", text: "All jewellery is removed" } ], correct: "B", explanation: "Care after death only begins after formal verification by a doctor or authorised practitioner. Family may be involved if they wish; property handling follows policy with a witness." },
      { id: "dq2", tag: "Coroner", question: "A patient dies unexpectedly 6 hours after surgery. The IV cannula should be:", options: [ { key: "A", text: "Removed immediately" }, { key: "B", text: "Left in place — the death is reportable to the coroner" }, { key: "C", text: "Replaced with a clean one" }, { key: "D", text: "Removed only if the family asks" } ], correct: "B", explanation: "Unexpected and peri-operative deaths are reportable; all lines, tubes and devices stay in situ pending coroner guidance." },
      { id: "dq3", tag: "Communication", question: "The clearest, kindest phrase when telling a family their relative has died is:", options: [ { key: "A", text: "\"He has passed on to a better place\"" }, { key: "B", text: "\"We lost him\"" }, { key: "C", text: "\"I am very sorry — he has died\"" }, { key: "D", text: "\"He didn't make it\"" } ], correct: "C", explanation: "Use the words \"died\" or \"death\" with genuine warmth. Euphemisms cause confusion and can delay understanding, especially under shock." },
      { id: "dq4", tag: "Comfort", question: "Noisy respiratory secretions in a dying, unconscious patient are best managed initially by:", options: [ { key: "A", text: "Deep oral suctioning every hour" }, { key: "B", text: "Repositioning and prescribed antisecretory medication" }, { key: "C", text: "Chest physiotherapy" }, { key: "D", text: "Nebulised saline" } ], correct: "B", explanation: "Repositioning (semi-prone/lateral) and prescribed antimuscarinics are first line; deep suction is distressing and generally avoided. Reassure the family the patient is not distressed." },
      { id: "dq5", tag: "Family", question: "A relative wishes to help wash their mother's body after death for religious reasons. You should:", options: [ { key: "A", text: "Refuse — it is a clinical task" }, { key: "B", text: "Facilitate this, supporting them through the process" }, { key: "C", text: "Allow it only after mortuary transfer" }, { key: "D", text: "Ask them to wait outside" } ], correct: "B", explanation: "Family participation in washing is central to several faiths and is welcomed within policy — support it with sensitivity and privacy." },
    ],
    compare: [
      { feature: "Goal", "Palliative Care": "Quality of life at any stage of serious illness", "End-of-Life Care": "Comfort and dignity in the last days/hours" },
      { feature: "Timing", "Palliative Care": "From diagnosis, alongside active treatment", "End-of-Life Care": "When death is expected imminently" },
      { feature: "Interventions", "Palliative Care": "Symptom control + disease-modifying care may continue", "End-of-Life Care": "Burdensome interventions stopped; comfort prioritised" },
      { feature: "Observations", "Palliative Care": "As clinically indicated", "End-of-Life Care": "Routine vital signs usually discontinued" },
    ],
  },
  // ── Station 6: Wound Dressing ────────────────────────────────────────────
  wound_dressing: {
    title: "Aseptic Wound Dressing Technique",
    intro:
      "This station tests aseptic non-touch technique (ANTT) while assessing a wound and applying a new dressing. Examiners watch your field management, glove discipline, key-part protection and wound assessment language.",
    examTips: [
      "Identify and protect key parts out loud — the tip of the forceps, the dressing surface, the cleaned wound.",
      "Clean from the least contaminated to the most contaminated area; one wipe, one stroke, discard.",
      "Assess and describe the wound with the TIME framework before covering it.",
      "If you breach asepsis, declare it and change gloves/equipment — insight scores marks, hiding loses them.",
    ],
    steps: [
      { step: 1, title: "Prepare the Patient", detail: "Identify the patient, explain the procedure, gain consent, offer analgesia 20–30 minutes beforehand if painful, and position comfortably with privacy." },
      { step: 2, title: "Prepare Equipment & Field", detail: "Check the dressing trolley is cleaned. Gather sterile dressing pack, cleansing solution (warmed 0.9% saline), dressings, gloves and waste bag. Check expiry dates and packaging integrity." },
      { step: 3, title: "Hand Hygiene & Apron", detail: "Decontaminate hands, don apron. Open the sterile pack onto the trolley top creating a sterile field, and drop supplementary items on aseptically." },
      { step: 4, title: "Remove the Old Dressing", detail: "With clean gloves, loosen and remove the old dressing, noting exudate on it. Dispose into the waste bag, remove gloves, decontaminate hands." },
      { step: 5, title: "Assess the Wound (TIME)", detail: "Tissue type (granulation, slough, necrosis), Infection/Inflammation signs, Moisture/exudate level, Edge condition and surrounding skin. Measure size if required." },
      { step: 6, title: "Don Sterile Gloves", detail: "Decontaminate hands again and don sterile gloves (or use the non-touch forceps technique per local policy)." },
      { step: 7, title: "Cleanse the Wound", detail: "Irrigate or cleanse with warmed saline only if indicated. Clean from clean to dirty, single strokes, new gauze each pass. Do not scrub granulating tissue." },
      { step: 8, title: "Apply the New Dressing", detail: "Select the dressing appropriate to the wound (moisture balance). Apply touching only the outer surfaces, ensuring an adequate overlap of the wound margins." },
      { step: 9, title: "Dispose & Decontaminate", detail: "Dispose of waste and sharps correctly, remove gloves and apron, and perform hand hygiene. Leave the patient comfortable." },
      { step: 10, title: "Document the Episode", detail: "Record wound assessment (TIME), dressing used, patient tolerance, and the planned review date. Escalate signs of infection or deterioration." },
    ],
    checklist: [
      { id: "wd01", category: "ANTT", ...catColor("blue"), question: "What is a 'key part' in ANTT?", answer: "Any part of the equipment that must remain sterile because it contacts the wound or another key part — e.g. dressing surface, forceps tips, syringe tip. Key parts are protected and never touched." },
      { id: "wd02", category: "Assessment", ...catColor("green"), question: "What does the TIME wound framework stand for?", answer: "T — Tissue (viable/non-viable)\nI — Infection or Inflammation\nM — Moisture balance (exudate)\nE — Edge of wound (advancing? undermined?) and surrounding skin." },
      { id: "wd03", category: "Infection", ...catColor("red"), question: "Name five local signs of wound infection.", answer: "Increasing pain, spreading erythema, heat, swelling, purulent or increased exudate, malodour, friable granulation, wound breakdown, delayed healing — plus systemic fever." },
      { id: "wd04", category: "Cleansing", ...catColor("amber"), question: "When and with what should a wound be cleansed?", answer: "Only when clinically indicated (debris, exudate) — routine cleansing disturbs healing. Use warmed sterile 0.9% saline; irrigation is gentler than swabbing." },
      { id: "wd05", category: "Healing", ...catColor("violet"), question: "Differentiate healing by primary and secondary intention.", answer: "Primary: edges approximated (sutures/clips), minimal tissue loss, fast healing. Secondary: wound left open to granulate from the base (e.g. pressure ulcers), slower with more scarring." },
      { id: "wd06", category: "Dressings", ...catColor("pink"), question: "What principles guide dressing selection?", answer: "Maintain a moist (not wet) wound bed, manage exudate, protect surrounding skin, control infection where present, keep thermal insulation, and suit the patient's comfort and lifestyle." },
    ],
    quiz: [
      { id: "wq1", tag: "ANTT", question: "During a dressing change your sterile glove brushes the bed rail. You should:", options: [ { key: "A", text: "Continue — it was brief" }, { key: "B", text: "Declare the breach, change gloves and continue" }, { key: "C", text: "Wipe the glove with an alcohol wipe" }, { key: "D", text: "Abandon the dressing change" } ], correct: "B", explanation: "The glove is contaminated. Recognising and correcting the breach protects the patient — and in an OSCE, demonstrates safe insight." },
      { id: "wq2", tag: "Cleansing", question: "The recommended solution for routine wound cleansing is:", options: [ { key: "A", text: "Hydrogen peroxide" }, { key: "B", text: "Chlorhexidine scrub" }, { key: "C", text: "Warmed sterile 0.9% saline" }, { key: "D", text: "Povidone-iodine every change" } ], correct: "C", explanation: "Warmed saline is non-toxic to granulation tissue. Antiseptics are reserved for specific indications; cold solutions delay healing by cooling the wound bed." },
      { id: "wq3", tag: "Assessment", question: "Yellow, stringy, adherent tissue in the wound bed is best described as:", options: [ { key: "A", text: "Granulation" }, { key: "B", text: "Slough" }, { key: "C", text: "Epithelialisation" }, { key: "D", text: "Eschar" } ], correct: "B", explanation: "Slough is devitalised yellow/white fibrinous tissue. Granulation is red and beefy; eschar is black/brown necrotic tissue; epithelium is new pink surface tissue." },
      { id: "wq4", tag: "Sequence", question: "When cleansing a wound you should work:", options: [ { key: "A", text: "From dirty to clean areas" }, { key: "B", text: "From clean to dirty, one stroke per swab" }, { key: "C", text: "In circles over the wound bed" }, { key: "D", text: "Only around the surrounding skin" } ], correct: "B", explanation: "Clean-to-dirty with a fresh swab per stroke prevents re-introducing organisms into the cleanest area." },
      { id: "wq5", tag: "Escalation", question: "At a dressing change you find spreading erythema, increased pain and purulent exudate. Best action:", options: [ { key: "A", text: "Apply the same dressing and review next week" }, { key: "B", text: "Swab if indicated, redress, and report to the doctor/tissue viability today" }, { key: "C", text: "Leave the wound open to the air" }, { key: "D", text: "Start leftover antibiotics from the cupboard" } ], correct: "B", explanation: "These are infection signs: assess, take a wound swab per policy, dress appropriately, document and escalate for medical review the same day." },
    ],
    compare: [
      { feature: "Wound Edge", "Primary Intention": "Approximated with sutures/clips/glue", "Secondary Intention": "Left open, heals from the base up" },
      { feature: "Tissue Loss", "Primary Intention": "Minimal", "Secondary Intention": "Significant" },
      { feature: "Healing Time", "Primary Intention": "Days to ~2 weeks", "Secondary Intention": "Weeks to months" },
      { feature: "Scarring", "Primary Intention": "Fine line", "Secondary Intention": "Broader scar, contraction" },
      { feature: "Examples", "Primary Intention": "Surgical incision", "Secondary Intention": "Pressure ulcer, dehisced wound" },
    ],
  },

  // ── Station 7: IV Infusion ───────────────────────────────────────────────
  iv_infusion: {
    title: "IV Infusion Setup & Monitoring",
    intro:
      "This station tests safe intravenous therapy: checking the prescription and fluid, priming the giving set aseptically, connecting to the cannula, setting the rate, and monitoring for complications using a VIP score.",
    examTips: [
      "Check the prescription against the fluid bag out loud: right patient, fluid, dose/additives, rate, route, time, and expiry.",
      "Prime the line without touching key parts and expel all air — verbalise checking for bubbles.",
      "Know your drop-rate maths: rate (dpm) = (volume mL × drop factor) ÷ time in minutes.",
      "Inspect the cannula site and state the VIP score before connecting anything.",
    ],
    steps: [
      { step: 1, title: "Verify the Prescription", detail: "Check the IV fluid order: patient identity (two identifiers), fluid type, volume, rate/duration, additives, route and prescriber signature. Check allergies." },
      { step: 2, title: "Check the Fluid Bag", detail: "Inspect the bag: correct fluid and strength, expiry date, clarity (no particles/cloudiness), intact outer wrap and no leaks. Second-nurse check per policy." },
      { step: 3, title: "Hand Hygiene & Prepare Equipment", detail: "Decontaminate hands, gather giving set, drip stand, alcohol wipes, gloves; label the line/bag with date and time as required." },
      { step: 4, title: "Prime the Giving Set", detail: "Close the roller clamp, spike the bag aseptically, half-fill the chamber, then open the clamp slowly to prime the line, expelling all air. Protect the line's key parts." },
      { step: 5, title: "Assess the Cannula Site (VIP)", detail: "Inspect for pain, redness, swelling or leakage and score with the Visual Infusion Phlebitis scale. VIP 0–1: usable/observe; VIP ≥2: resite before infusing." },
      { step: 6, title: "Flush & Connect", detail: "Don gloves, scrub the needle-free hub for 15 seconds with a 2% chlorhexidine/70% alcohol wipe, flush with 0.9% saline checking patency, then connect the primed line." },
      { step: 7, title: "Set the Rate", detail: "Set the pump (mL/hr) or calculate gravity drops per minute: (volume × drop factor) ÷ minutes. E.g. 1000 mL over 8 hr with a 20 dpm set = 1000×20÷480 ≈ 42 dpm." },
      { step: 8, title: "Ongoing Monitoring", detail: "Monitor the site, rate and patient response; maintain the fluid balance chart; watch for overload (dyspnoea, raised JVP, crackles) especially in cardiac/renal/elderly patients." },
      { step: 9, title: "Document", detail: "Sign the prescription/administration record, record start time, batch number where required, VIP score and fluid balance. Handover includes the infusion plan." },
      { step: 10, title: "Respond to Complications", detail: "Stop the infusion for suspected phlebitis, infiltration, extravasation or reaction; assess, escalate, resite as needed and document/report per policy." },
    ],
    checklist: [
      { id: "iv01", category: "VIP Score", ...catColor("blue"), question: "What does a VIP score of 2 require?", answer: "VIP 2 = early phlebitis (two of: pain, redness, swelling). Action: resite the cannula and consider treatment. VIP 0 = observe; 1 = observe/possible early signs." },
      { id: "iv02", category: "Calculation", ...catColor("violet"), question: "State the drop-rate formula for gravity infusions.", answer: "Drops per minute = (Volume in mL × drop factor of the set) ÷ time in minutes.\nStandard sets are commonly 20 drops/mL (blood sets 15, microdrip 60)." },
      { id: "iv03", category: "Complications", ...catColor("red"), question: "Differentiate infiltration and extravasation.", answer: "Infiltration: non-vesicant fluid leaks into surrounding tissue (swelling, coolness, discomfort). Extravasation: a vesicant leaks, causing tissue damage/necrosis — stop immediately and escalate urgently." },
      { id: "iv04", category: "Fluid Overload", ...catColor("amber"), question: "Name the signs of circulatory overload during IV therapy.", answer: "Dyspnoea, tachypnoea, tachycardia, raised BP and JVP, lung crackles, oedema and rapid weight gain. Slow/stop the infusion, sit the patient up, and call the doctor." },
      { id: "iv05", category: "Asepsis", ...catColor("green"), question: "How should a needle-free access hub be prepared?", answer: "Scrub the hub vigorously for at least 15 seconds with a 2% chlorhexidine in 70% alcohol wipe and allow it to dry fully before every access ('scrub the hub')." },
      { id: "iv06", category: "Checks", ...catColor("pink"), question: "What must be checked on an IV fluid bag before use?", answer: "Right fluid and strength against the prescription, expiry date, clarity and absence of particles, intact packaging without leaks — plus patient ID, allergies and second-checker where required." },
    ],
    quiz: [
      { id: "vq1", tag: "Calculation", question: "1000 mL 0.9% saline over 8 hours via a 20 drops/mL set — the drip rate is approximately:", options: [ { key: "A", text: "21 dpm" }, { key: "B", text: "42 dpm" }, { key: "C", text: "63 dpm" }, { key: "D", text: "125 dpm" } ], correct: "B", explanation: "(1000 × 20) ÷ 480 minutes = 41.6 ≈ 42 drops per minute." },
      { id: "vq2", tag: "VIP", question: "A cannula site is painful and red along the vein with a palpable cord. This VIP score means:", options: [ { key: "A", text: "0 — no action" }, { key: "B", text: "1 — observe only" }, { key: "C", text: "3+ — advanced phlebitis: resite and treat" }, { key: "D", text: "Not scoreable" } ], correct: "C", explanation: "Pain, erythema along the vein path and a palpable venous cord indicate medium/advanced phlebitis (VIP 3+): remove/resite, treat and report." },
      { id: "vq3", tag: "Air Safety", question: "The primary reason for priming a giving set is to:", options: [ { key: "A", text: "Warm the fluid" }, { key: "B", text: "Remove air and prevent air embolism" }, { key: "C", text: "Check the fluid colour" }, { key: "D", text: "Speed up the infusion" } ], correct: "B", explanation: "Priming fills the line with fluid, expelling air that could otherwise enter the circulation as an embolus." },
      { id: "vq4", tag: "Overload", question: "An elderly patient on IV fluids becomes breathless with crackles at both bases. Your FIRST action:", options: [ { key: "A", text: "Increase the infusion to finish it quickly" }, { key: "B", text: "Slow/stop the infusion, sit the patient upright, and escalate" }, { key: "C", text: "Lay the patient flat" }, { key: "D", text: "Give oral fluids instead" } ], correct: "B", explanation: "These suggest fluid overload/pulmonary oedema: stop the fluid, position upright, take observations, give oxygen if needed and call the doctor urgently." },
      { id: "vq5", tag: "Asepsis", question: "Before connecting an infusion to a needle-free hub you should:", options: [ { key: "A", text: "Wipe briefly with dry gauze" }, { key: "B", text: "Scrub the hub 15 seconds with 2% chlorhexidine/70% alcohol and let it dry" }, { key: "C", text: "Rinse it with saline" }, { key: "D", text: "Nothing — it is needle-free" } ], correct: "B", explanation: "'Scrub the hub' for at least 15 seconds and allow to dry — needle-free connectors are a recognised entry point for bloodstream infections." },
    ],
    compare: [
      { feature: "What Leaks", "Infiltration": "Non-vesicant fluid", "Extravasation": "Vesicant/irritant drug", "Phlebitis": "No leak — vein wall inflammation" },
      { feature: "Signs", "Infiltration": "Swelling, cool, taut skin, slowed infusion", "Extravasation": "Pain, swelling, blistering, necrosis risk", "Phlebitis": "Pain, redness, warmth, palpable cord" },
      { feature: "Immediate Action", "Infiltration": "Stop, remove, elevate limb", "Extravasation": "Stop, aspirate per policy, urgent escalation", "Phlebitis": "Remove/resite, VIP score, treat" },
      { feature: "Severity", "Infiltration": "Usually mild-moderate", "Extravasation": "Potentially severe tissue damage", "Phlebitis": "Mild to moderate; infection risk" },
    ],
  },

  // ── Station 8: Chest Infection ───────────────────────────────────────────
  chest_infection: {
    title: "Respiratory Assessment & Chest Infection Care",
    intro:
      "This station tests focused respiratory assessment of a patient with a suspected chest infection: observations, oxygen therapy, sputum sampling, positioning and knowing the differences between pneumonia types.",
    examTips: [
      "Follow a structure: inspect (rate, effort, colour), then oxygen saturations, auscultation findings and sputum.",
      "Always state target saturations — 94–98% normally, 88–92% for hypercapnic-risk COPD patients.",
      "CURB-65 shows severity awareness: Confusion, Urea >7, RR ≥30, BP <90/60, age ≥65.",
      "Position upright, encourage deep breathing/coughing, hydration and early mobilisation — simple nursing care scores marks.",
    ],
    steps: [
      { step: 1, title: "Initial Assessment", detail: "Introduce yourself, consent, position semi-upright. General inspection: work of breathing, accessory muscle use, cyanosis, confusion, ability to speak in sentences." },
      { step: 2, title: "Vital Signs & NEWS2", detail: "Record RR (full minute), SpO2, temperature, HR, BP and consciousness level; calculate NEWS2 and compare with previous scores for trend." },
      { step: 3, title: "Focused Respiratory Assessment", detail: "Note chest expansion symmetry, breath sounds (crackles, wheeze, bronchial breathing), and cough character. Ask about sputum colour and volume, pleuritic pain, and smoking history." },
      { step: 4, title: "Administer Oxygen if Indicated", detail: "Give prescribed oxygen to target 94–98% (88–92% if CO2-retention risk), selecting the correct device (nasal cannula 1–4 L, simple mask, Venturi for controlled therapy in COPD)." },
      { step: 5, title: "Obtain a Sputum Sample", detail: "Ideally early morning, before antibiotics: rinse mouth with water, deep breaths then a deep cough into a sterile pot (not saliva). Label and send promptly for culture." },
      { step: 6, title: "Supportive Nursing Care", detail: "Sit the patient upright, encourage deep breathing and coughing exercises, ensure adequate hydration, antipyretics as prescribed, and mouth care." },
      { step: 7, title: "Administer Prescribed Treatment", detail: "Give antibiotics on time (check allergies), nebulisers/bronchodilators as prescribed, and monitor response. Escalate if NEWS2 rises or red flags appear." },
      { step: 8, title: "Monitor & Prevent Deterioration", detail: "Reassess observations per NEWS2 protocol, watch for sepsis, encourage mobilisation to prevent atelectasis, and use VTE prophylaxis as prescribed." },
      { step: 9, title: "Document & Handover", detail: "Record assessment findings, oxygen device and flow, sputum sample sent, response to treatment, and communicate concerns using ISBAR." },
    ],
    checklist: [
      { id: "ci01", category: "Types", ...catColor("blue"), question: "Differentiate CAP and HAP.", answer: "CAP: pneumonia acquired in the community (typically S. pneumoniae). HAP: onset ≥48 hours after hospital admission, often Gram-negative or resistant organisms, higher mortality." },
      { id: "ci02", category: "Aspiration", ...catColor("amber"), question: "Who is at risk of aspiration pneumonia and which lung zone is typical?", answer: "Patients with dysphagia, stroke, reduced consciousness, reflux or NG feeding. Classically affects the right lower lobe (wider, more vertical right main bronchus)." },
      { id: "ci03", category: "Severity", ...catColor("red"), question: "What is CURB-65?", answer: "Pneumonia severity score: Confusion, Urea >7 mmol/L, RR ≥30, BP <90 systolic or ≤60 diastolic, age ≥65. Score 0–1 consider home care; 2 hospital; ≥3 severe — consider ICU." },
      { id: "ci04", category: "Oxygen", ...catColor("green"), question: "Why use a Venturi mask for COPD patients?", answer: "It delivers a fixed, precise FiO2 regardless of breathing pattern, allowing controlled titration to 88–92% without risking CO2 narcosis from uncontrolled high-flow oxygen." },
      { id: "ci05", category: "Sputum", ...catColor("violet"), question: "How is a good sputum sample obtained?", answer: "Early morning before antibiotics if possible; rinse mouth with water first; deep breaths then a deep productive cough into a sterile container; sputum not saliva; send to the lab promptly." },
      { id: "ci06", category: "Nursing Care", ...catColor("pink"), question: "List key nursing interventions for chest infection.", answer: "Upright positioning, prescribed oxygen to target, deep breathing and coughing exercises, hydration, timely antibiotics, antipyretics, mouth care, early mobilisation and NEWS2 monitoring." },
    ],
    quiz: [
      { id: "cq1", tag: "Definition", question: "Pneumonia that develops 72 hours after admission for a hip fracture is classified as:", options: [ { key: "A", text: "Community-acquired (CAP)" }, { key: "B", text: "Hospital-acquired (HAP)" }, { key: "C", text: "Atypical pneumonia" }, { key: "D", text: "Aspiration pneumonia" } ], correct: "B", explanation: "Onset ≥48 hours after admission defines HAP, which involves different organisms and empirical antibiotics than CAP." },
      { id: "cq2", tag: "Oxygen", question: "A COPD patient with a chest infection has SpO2 84%. The best initial device is:", options: [ { key: "A", text: "Non-rebreathe mask at 15 L for everyone" }, { key: "B", text: "Controlled oxygen (e.g. 24–28% Venturi) titrated to 88–92%" }, { key: "C", text: "No oxygen — risk of CO2 retention" }, { key: "D", text: "Nasal cannula at 6 L" } ], correct: "B", explanation: "Hypoxia must be treated, but with controlled oxygen titrated to 88–92% and close monitoring (ABG as indicated) in CO2-retention-risk patients." },
      { id: "cq3", tag: "CURB-65", question: "Which is NOT a CURB-65 criterion?", options: [ { key: "A", text: "Confusion" }, { key: "B", text: "Respiratory rate ≥30" }, { key: "C", text: "Temperature >39°C" }, { key: "D", text: "Age ≥65" } ], correct: "C", explanation: "CURB-65 = Confusion, Urea >7, RR ≥30, BP <90/≤60, Age ≥65. Temperature is not a criterion." },
      { id: "cq4", tag: "Aspiration", question: "The patient at highest risk of aspiration pneumonia is:", options: [ { key: "A", text: "A young adult with asthma" }, { key: "B", text: "A post-stroke patient with dysphagia" }, { key: "C", text: "A patient with well-controlled diabetes" }, { key: "D", text: "A patient with a healed leg ulcer" } ], correct: "B", explanation: "Impaired swallow after stroke allows oropharyngeal contents into the airway — screen swallowing, position upright for meals, and follow SLT recommendations." },
      { id: "cq5", tag: "Nursing", question: "Which position best supports ventilation in an alert patient with pneumonia?", options: [ { key: "A", text: "Flat supine" }, { key: "B", text: "Upright/high side-lying at 45–90°" }, { key: "C", text: "Trendelenburg" }, { key: "D", text: "Prone at all times" } ], correct: "B", explanation: "Sitting upright optimises diaphragmatic excursion and V/Q matching, eases work of breathing and helps expectoration." },
    ],
    compare: [
      { feature: "Onset", "CAP": "In the community", "HAP": "≥48 hrs after admission", "Aspiration": "After aspiration event/risk" },
      { feature: "Typical Organisms", "CAP": "S. pneumoniae, H. influenzae", "HAP": "Gram-negatives, S. aureus/MRSA", "Aspiration": "Anaerobes, mixed oral flora" },
      { feature: "Typical Patient", "CAP": "Any; older adults, smokers", "HAP": "Hospitalised, ventilated, post-op", "Aspiration": "Dysphagia, stroke, low GCS" },
      { feature: "Key Nursing Focus", "CAP": "CURB-65, oxygen, antibiotics", "HAP": "Prevention: hand hygiene, oral care, mobilisation", "Aspiration": "Swallow screen, upright feeding, SLT referral" },
    ],
  },

  // ── Station 9: Oral Drug Administration ─────────────────────────────────
  oral_drug: {
    title: "Safe Oral Medication Administration",
    intro:
      "This station tests the safe administration of oral medications: the rights of medication administration, prescription and allergy checks, dose calculation, and correct response to errors or refusals.",
    examTips: [
      "Verbalise every 'right' as you check it — patient, drug, dose, route, time, plus documentation and the right to refuse.",
      "Check allergies twice: ask the patient AND check the wristband/chart before any drug passes your hand.",
      "Show your calculation: dose required ÷ stock strength × stock volume. Say it out loud.",
      "Never leave medications at the bedside, never give what you didn't prepare, and stay while the patient swallows.",
    ],
    steps: [
      { step: 1, title: "Check the Prescription", detail: "Verify the order is legible, signed, in date and complete: drug, dose, route, frequency/time, and not already given. Question anything ambiguous — never guess." },
      { step: 2, title: "Check Allergies", detail: "Check the allergy box on the chart, the patient's red wristband, and ask the patient directly about allergies and reactions before preparing anything." },
      { step: 3, title: "Hand Hygiene & Prepare", detail: "Decontaminate hands. Prepare medications one patient at a time using a non-touch technique; do not crush or split tablets unless confirmed safe and prescribed." },
      { step: 4, title: "Calculate the Dose", detail: "Use: (dose required ÷ stock strength) × stock volume/unit. Double-check high-risk calculations with a second nurse per policy. If a dose seems unusually large, stop and re-check." },
      { step: 5, title: "Identify the Patient", detail: "At the bedside, ask the patient to state their full name and date of birth and cross-check against the wristband and prescription chart — two identifiers, every time." },
      { step: 6, title: "Explain & Gain Consent", detail: "Tell the patient what the medicine is, what it is for and any key side effects. Respect and document refusal after exploring the reason; inform the prescriber." },
      { step: 7, title: "Administer Safely", detail: "Position upright, offer water, give medications one at a time and remain with the patient until swallowed. Never leave medicines unattended at the bedside." },
      { step: 8, title: "Sign & Document Immediately", detail: "Sign the administration record straight after giving — never before. Record refusals, omissions with the correct code, and their notification." },
      { step: 9, title: "Monitor & Evaluate", detail: "Observe for therapeutic effect and adverse reactions (especially first doses). Report and document any suspected reaction; complete an incident report for any error — honesty is a professional duty." },
    ],
    checklist: [
      { id: "od01", category: "Rights", ...catColor("blue"), question: "List the rights of medication administration.", answer: "Right patient, right drug, right dose, right route, right time — plus right documentation, right reason, right response, and the patient's right to refuse." },
      { id: "od02", category: "Calculation", ...catColor("violet"), question: "State the standard dose calculation formula.", answer: "(Dose required ÷ stock strength) × stock volume.\nE.g. 500 mg required, stock 250 mg/5 mL: (500 ÷ 250) × 5 = 10 mL." },
      { id: "od03", category: "Identification", ...catColor("green"), question: "How do you correctly identify a patient before medications?", answer: "Ask the patient to state (not confirm) their full name and date of birth, and check both against the identity wristband and the prescription chart." },
      { id: "od04", category: "Refusal", ...catColor("amber"), question: "A capacitous patient refuses their medication. What do you do?", answer: "Explore the reason, explain consequences, respect the decision, do not hide medication in food covertly, document the refusal and inform the prescriber for review." },
      { id: "od05", category: "Errors", ...catColor("red"), question: "What are the immediate steps after a medication error?", answer: "Assess and monitor the patient, inform the doctor and nurse in charge, treat as directed, be open with the patient (duty of candour), document and complete an incident report." },
      { id: "od06", category: "Crushing", ...catColor("pink"), question: "Why can't enteric-coated or modified-release tablets be crushed?", answer: "Crushing destroys the coating/matrix, causing dose dumping (toxicity), gastric irritation or drug inactivation. Ask pharmacy for an alternative formulation instead." },
    ],
    quiz: [
      { id: "oq1", tag: "Calculation", question: "Amoxicillin 750 mg is prescribed; stock suspension is 250 mg/5 mL. You give:", options: [ { key: "A", text: "10 mL" }, { key: "B", text: "15 mL" }, { key: "C", text: "7.5 mL" }, { key: "D", text: "25 mL" } ], correct: "B", explanation: "(750 ÷ 250) × 5 mL = 15 mL." },
      { id: "oq2", tag: "Identification", question: "The safest way to identify a patient before giving medication is:", options: [ { key: "A", text: "\"Are you Mrs Kelly?\"" }, { key: "B", text: "Reading the bed sign" }, { key: "C", text: "Asking them to state name and date of birth, checked against the wristband and chart" }, { key: "D", text: "Recognising the patient from yesterday" } ], correct: "C", explanation: "Open questions plus wristband-and-chart cross-check prevent errors; confused patients may answer 'yes' to any name, and beds change." },
      { id: "oq3", tag: "Safety", question: "You are interrupted mid-round and unsure whether you gave Mr Byrne his digoxin. You should:", options: [ { key: "A", text: "Give another dose to be safe" }, { key: "B", text: "Skip it and move on" }, { key: "C", text: "Check the chart signature, the stock count, and the patient before deciding; escalate if still unsure" }, { key: "D", text: "Ask the patient's roommate" } ], correct: "C", explanation: "Never guess with medications. Verify documentation and stock; if uncertainty remains treat as a potential error and inform the prescriber — digoxin double-dosing is dangerous." },
      { id: "oq4", tag: "Right Time", question: "Which drug is MOST time-critical to give exactly as scheduled?", options: [ { key: "A", text: "A multivitamin" }, { key: "B", text: "Levodopa for Parkinson's disease" }, { key: "C", text: "PRN paracetamol" }, { key: "D", text: "A stool softener" } ], correct: "B", explanation: "Delayed levodopa causes rapid symptom deterioration ('get it on time'). Insulin, anticoagulants, antiepileptics and antibiotics are also time-critical." },
      { id: "oq5", tag: "Covert", question: "Crushing a tablet into a capacitous patient's yoghurt without telling them is:", options: [ { key: "A", text: "Acceptable if they usually refuse" }, { key: "B", text: "Covert administration — not permissible for a patient with capacity" }, { key: "C", text: "Good practice to save time" }, { key: "D", text: "Allowed if the family agrees" } ], correct: "B", explanation: "Covert administration is only ever considered for patients lacking capacity, in their best interests, after a documented MDT/pharmacy decision — never for capacitous patients." },
    ],
  },

  // ── Station 10: NOK Discussion ───────────────────────────────────────────
  nok_discussion: {
    title: "Communicating with the Next of Kin",
    intro:
      "This station tests sensitive communication with a relative — often breaking bad news, discussing deterioration, or handling a complaint or emotional reaction. Actors assess empathy, structure, honesty and confidentiality.",
    examTips: [
      "Set the scene: private room, sit down, no barriers, switch off distractions — verbalise this in the OSCE.",
      "Fire a warning shot before bad news: \"I'm afraid I have some difficult news to share.\"",
      "Silence is a tool. After delivering news, stop talking and let the relative react.",
      "Check consent and confidentiality — confirm who you are speaking to and what the patient has agreed can be shared.",
    ],
    steps: [
      { step: 1, title: "Prepare (S — Setting)", detail: "Read the notes, know the facts, and check what the patient consents to share. Arrange a private, quiet room; invite a colleague/support person; sit at eye level without barriers." },
      { step: 2, title: "Confirm Identity & Relationship", detail: "Confirm who the relative is and their relationship to the patient before disclosing anything — confidentiality survives even in difficult conversations." },
      { step: 3, title: "Assess Perception (P)", detail: "Ask what they already know and understand: \"Can you tell me what you've been told so far?\" This lets you pitch the conversation correctly." },
      { step: 4, title: "Get an Invitation (I)", detail: "Ask how much they want to know: \"Would you like me to explain what is happening in detail?\" Respect different information preferences." },
      { step: 5, title: "Share Knowledge (K)", detail: "Give a warning shot, then deliver information in small, jargon-free chunks. Pause between chunks. Use clear words — 'dying', 'cancer' — not euphemisms." },
      { step: 6, title: "Respond to Emotions (E)", detail: "Name and validate emotions: \"I can see this is a terrible shock.\" Tolerate silence and tears; offer tissues and time. Do not rush to fix or fill silences." },
      { step: 7, title: "Strategise & Summarise (S)", detail: "Agree next steps: further meetings with the team, visiting arrangements, who else to contact. Summarise, check understanding, and provide contact information." },
      { step: 8, title: "Document & Debrief", detail: "Record who was present, what was discussed and agreed, and the relative's response. Hand over to the team and debrief — these conversations affect staff too." },
    ],
    checklist: [
      { id: "nk01", category: "SPIKES", ...catColor("blue"), question: "What does SPIKES stand for?", answer: "S — Setting up\nP — Perception (what do they know?)\nI — Invitation (how much do they want?)\nK — Knowledge (warning shot, small chunks)\nE — Emotions (acknowledge, empathise)\nS — Strategy & Summary." },
      { id: "nk02", category: "Confidentiality", ...catColor("red"), question: "What must you check before sharing information with a relative?", answer: "Their identity and relationship, and what the patient (if capacitous) has consented to share. Being next of kin does not create an automatic right to all information." },
      { id: "nk03", category: "Language", ...catColor("amber"), question: "Give examples of good and poor phrasing when breaking bad news.", answer: "Good: \"I'm afraid the news is not what we hoped — the cancer has spread.\" Poor: jargon (\"metastatic lesions\"), euphemisms (\"gone to a better place\"), false reassurance (\"everything will be fine\")." },
      { id: "nk04", category: "Emotion", ...catColor("pink"), question: "How should you respond to anger from a relative?", answer: "Stay calm, don't take it personally or argue, acknowledge the feeling (\"I can hear how upset you are\"), keep everyone safe, and re-focus on the shared goal — the patient's wellbeing." },
      { id: "nk05", category: "Empathy", ...catColor("green"), question: "What is an empathic response (NURSE framework)?", answer: "Name the emotion, Understand ('anyone would feel this way'), Respect their coping, Support ('we will go through this together'), Explore ('tell me what worries you most')." },
      { id: "nk06", category: "Boundaries", ...catColor("violet"), question: "A relative asks a question beyond your role or knowledge. What do you say?", answer: "Be honest: \"That's an important question — I don't want to guess. I will arrange for the doctor to speak with you.\" Then actually arrange it and document." },
    ],
    quiz: [
      { id: "nq1", tag: "SPIKES", question: "\"Can you tell me what the doctors have told you so far?\" belongs to which SPIKES step?", options: [ { key: "A", text: "Setting" }, { key: "B", text: "Perception" }, { key: "C", text: "Knowledge" }, { key: "D", text: "Strategy" } ], correct: "B", explanation: "Assessing perception establishes what the relative already knows and how they understand it, before any new information is given." },
      { id: "nq2", tag: "Technique", question: "Immediately after telling a husband his wife has deteriorated significantly, the BEST next step is:", options: [ { key: "A", text: "Fill the silence with clinical details" }, { key: "B", text: "Pause, allow silence, and acknowledge his emotion" }, { key: "C", text: "Leave the room to give privacy" }, { key: "D", text: "Reassure him everything will be fine" } ], correct: "B", explanation: "After bad news, people stop processing new information. Pause, sit with the silence and respond to emotion before continuing." },
      { id: "nq3", tag: "Confidentiality", question: "A caller claiming to be a patient's daughter asks for his test results. You should:", options: [ { key: "A", text: "Give the results — she sounds genuine" }, { key: "B", text: "Refuse rudely and hang up" }, { key: "C", text: "Verify identity, check the patient's consent, and follow policy before sharing anything" }, { key: "D", text: "Tell her only the bad results" } ], correct: "C", explanation: "Phone disclosure is high risk: verify identity, check what the patient consents to share, and follow local policy — offer to have the team call back." },
      { id: "nq4", tag: "Language", question: "Which phrase is most appropriate when a patient's condition is now palliative?", options: [ { key: "A", text: "\"There is nothing more we can do\"" }, { key: "B", text: "\"We are moving to comfort-focused care — we will continue to care for her every day\"" }, { key: "C", text: "\"We are stopping treatment\"" }, { key: "D", text: "\"You should prepare for the worst\"" } ], correct: "B", explanation: "There is always care to give. Frame palliation as active comfort-focused care, never abandonment." },
      { id: "nq5", tag: "Anger", question: "A relative shouts that the ward 'killed' their father. Your best initial response is:", options: [ { key: "A", text: "\"You cannot speak to me like that\"" }, { key: "B", text: "\"I can hear how devastated and angry you are. Let's sit down and talk it through\"" }, { key: "C", text: "Walk away immediately" }, { key: "D", text: "Explain the medical facts loudly over them" } ], correct: "B", explanation: "Acknowledge the emotion first — de-escalation before information. Maintain safety, involve seniors, and offer the formal complaints/bereavement pathway when calm." },
    ],
  },

  // ── Station 11: Older Person Care ────────────────────────────────────────
  older_person: {
    title: "Comprehensive Older Person Assessment",
    intro:
      "This station tests assessment of the older adult: falls risk, frailty, cognition (including the 4AT for delirium), pressure areas and safe mobilisation. Expect to differentiate delirium, dementia and depression.",
    examTips: [
      "Speak TO the older person, not over them — actors mark for dignity and patience.",
      "Delirium is a medical emergency: an acute change in attention/awareness needs a cause found (think PINCH ME).",
      "Know the 4AT domains: alertness, AMT4, attention (months backwards), acute change.",
      "Always link falls assessment to action: footwear, call bell in reach, medication review, mobility aids.",
    ],
    steps: [
      { step: 1, title: "Approach & Communication", detail: "Introduce yourself, use the person's preferred name, position at eye level, ensure glasses/hearing aids are in place, reduce background noise, and allow extra time to answer." },
      { step: 2, title: "Baseline Observations", detail: "Full vital signs including lying and standing blood pressure (postural drop ≥20 systolic / ≥10 diastolic is significant for falls), pain assessment, and hydration status." },
      { step: 3, title: "Cognitive Screen (4AT)", detail: "Assess Alertness, AMT4 (age, DOB, place, year), Attention (months of the year backwards), and Acute change or fluctuating course. Score ≥4 suggests possible delirium." },
      { step: 4, title: "Screen for Delirium Causes", detail: "If delirium suspected, look for causes — PINCH ME: Pain, INfection, Constipation, deHydration, Medications, Environment — and escalate for medical review." },
      { step: 5, title: "Falls Risk Assessment", detail: "Use the local tool: falls history, medications (sedatives, antihypertensives, polypharmacy), gait and balance, continence, vision, footwear, and environment." },
      { step: 6, title: "Implement Falls Precautions", detail: "Bed at lowest height, call bell and belongings within reach, well-fitting footwear, mobility aid in reach, clear floor, appropriate observation level and toileting rounds." },
      { step: 7, title: "Skin & Pressure Assessment", detail: "Complete a Waterlow score, inspect pressure points (sacrum, heels, elbows), and implement SSKIN bundle: Surface, Skin inspection, Keep moving, Incontinence care, Nutrition." },
      { step: 8, title: "Nutrition, Hydration & Continence", detail: "MUST screening, assist with menus and dentures, monitor intake, and assess continence sensitively — never assume incontinence is normal ageing." },
      { step: 9, title: "Safe Mobilisation", detail: "Assess transfer ability, use the correct aid and number of staff, apply non-slip footwear, and encourage mobility — deconditioning starts within days of bed rest." },
      { step: 10, title: "Document & Refer", detail: "Record all scores and actions; refer appropriately: physiotherapy, occupational therapy, dietitian, geriatric team. Involve family with the patient's consent." },
    ],
    checklist: [
      { id: "op01", category: "Delirium", ...catColor("red"), question: "What is the 4AT and what score suggests delirium?", answer: "Rapid delirium screen: Alertness, AMT4 (age, DOB, place, year), Attention (months backwards), Acute change/fluctuation. Score ≥4 = possible delirium; 1–3 = possible cognitive impairment." },
      { id: "op02", category: "Delirium", ...catColor("amber"), question: "List common reversible causes of delirium (PINCH ME).", answer: "Pain, INfection, Constipation, deHydration, Medication changes/polypharmacy, Environment change — plus hypoxia, electrolyte disturbance, urinary retention." },
      { id: "op03", category: "Falls", ...catColor("blue"), question: "Name six falls risk factors in hospital.", answer: "Previous falls, sedating/antihypertensive medications and polypharmacy, postural hypotension, impaired gait/balance, cognitive impairment, urinary urgency, poor vision, unsuitable footwear, unfamiliar environment." },
      { id: "op04", category: "Postural BP", ...catColor("violet"), question: "How is postural hypotension measured and defined?", answer: "BP lying after 5 minutes rest, then standing at 1 and 3 minutes. A drop ≥20 mmHg systolic or ≥10 mmHg diastolic (or symptoms) is significant." },
      { id: "op05", category: "Pressure Care", ...catColor("green"), question: "What does the SSKIN bundle stand for?", answer: "Surface (right mattress/cushion), Skin inspection (regular checks), Keep moving (repositioning), Incontinence/moisture management, Nutrition and hydration." },
      { id: "op06", category: "Frailty", ...catColor("pink"), question: "What is frailty and why does it matter?", answer: "A state of reduced physiological reserve across systems, causing disproportionate deterioration after minor stressors (infection, new drug, admission). It predicts falls, delirium, disability and mortality." },
    ],
    quiz: [
      { id: "pq1", tag: "Delirium", question: "Mrs Walsh, 84, became acutely confused overnight and fluctuates during the day. This picture most suggests:", options: [ { key: "A", text: "Dementia" }, { key: "B", text: "Delirium" }, { key: "C", text: "Depression" }, { key: "D", text: "Normal ageing" } ], correct: "B", explanation: "Acute onset with fluctuating attention and awareness = delirium until proven otherwise. Screen with 4AT and search for the underlying cause." },
      { id: "pq2", tag: "Falls", question: "The most appropriate immediate falls precaution set is:", options: [ { key: "A", text: "Bed rails for every older patient" }, { key: "B", text: "Bed low, call bell in reach, correct footwear, regular toileting" }, { key: "C", text: "Restrict all mobility" }, { key: "D", text: "Sedation at night" } ], correct: "B", explanation: "Universal precautions target modifiable risks. Blanket bed rails, restraint and sedation increase harm and are not routine falls prevention." },
      { id: "pq3", tag: "4AT", question: "Which task tests attention in the 4AT?", options: [ { key: "A", text: "Stating age and date of birth" }, { key: "B", text: "Reciting months of the year backwards" }, { key: "C", text: "Drawing a clock face" }, { key: "D", text: "Naming the current place" } ], correct: "B", explanation: "Months backwards (December → July) tests attention; age/DOB/place/year form the AMT4 component." },
      { id: "pq4", tag: "Medication", question: "Which drug class most increases falls risk in older adults?", options: [ { key: "A", text: "Topical emollients" }, { key: "B", text: "Benzodiazepines and other sedatives" }, { key: "C", text: "Paracetamol" }, { key: "D", text: "Vitamin D" } ], correct: "B", explanation: "Sedatives/hypnotics impair balance, alertness and reaction time. Antihypertensives, opioids and polypharmacy (≥5 drugs) also contribute — request a medication review." },
      { id: "pq5", tag: "Pressure", question: "An 80-year-old with a Waterlow of 22 who cannot reposition herself needs:", options: [ { key: "A", text: "Routine care and reassessment next week" }, { key: "B", text: "A pressure-redistributing mattress and scheduled repositioning now" }, { key: "C", text: "A donut cushion" }, { key: "D", text: "Vigorous massage of pressure points" } ], correct: "B", explanation: "Waterlow ≥20 = very high risk: immediate equipment, a repositioning schedule and SSKIN bundle. Donut cushions and massaging bony prominences cause harm." },
    ],
    compare: [
      { feature: "Onset", "Delirium": "Acute (hours–days)", "Dementia": "Insidious (months–years)", "Depression": "Weeks; may follow loss" },
      { feature: "Course", "Delirium": "Fluctuates; worse at night", "Dementia": "Slowly progressive", "Depression": "Often worse in the morning; flat" },
      { feature: "Attention", "Delirium": "Markedly impaired", "Dementia": "Relatively intact early", "Depression": "Poor concentration, 'don't know' answers" },
      { feature: "Consciousness", "Delirium": "Altered/clouded", "Dementia": "Clear until late", "Depression": "Clear" },
      { feature: "Reversibility", "Delirium": "Usually reversible — treat the cause", "Dementia": "Progressive; support-focused", "Depression": "Treatable — refer and support" },
    ],
  },

  // ── Station 12: Chronic Disease ──────────────────────────────────────────
  chronic_disease: {
    title: "Chronic Disease Review & Self-Management",
    intro:
      "This station tests supporting a patient with a long-term condition (commonly COPD, diabetes, heart failure or asthma): structured review, recognising exacerbation triggers, medication concordance and self-management education.",
    examTips: [
      "Ask before telling: explore what the patient already knows and does — education builds on their reality.",
      "Check inhaler or injection technique by demonstration, not by asking \"do you know how?\"",
      "Give safety-net advice with concrete numbers: when to call the GP, when to go to hospital.",
      "Concordance beats compliance: explore barriers (cost, side effects, beliefs) without judgement.",
    ],
    steps: [
      { step: 1, title: "Open the Review", detail: "Introduce yourself, agree the purpose, and ask how the condition has been: symptoms, sleep, activity tolerance, mood and any emergency visits since last review." },
      { step: 2, title: "Assess Current Control", detail: "Use objective measures: home readings (glucose diary, peak flow, BP, weight), validated scores (e.g. CAT for COPD), and current observations." },
      { step: 3, title: "Review Medications & Concordance", detail: "Go through each medication: does the patient know what it's for, how and when to take it, and do they actually take it? Explore missed doses and side effects openly." },
      { step: 4, title: "Check Technique", detail: "Ask the patient to demonstrate inhaler, insulin injection or monitoring technique. Correct gently, re-demonstrate, and confirm with teach-back." },
      { step: 5, title: "Identify Exacerbation Triggers", detail: "Discuss triggers: infections, smoking, allergens, cold weather, missed medications, diet/fluid excess (heart failure), stress. Plan avoidance strategies together." },
      { step: 6, title: "Recognise Deterioration Early", detail: "Teach the specific early warning signs for their condition — e.g. increased breathlessness/sputum purulence (COPD), weight gain >2 kg in 3 days (heart failure), hyperglycaemia with ketones (diabetes)." },
      { step: 7, title: "Agree a Self-Management/Action Plan", detail: "Write down zones and actions: what to do daily (green), how to respond to worsening symptoms (amber), and when to seek urgent help (red). Include rescue medication use where prescribed." },
      { step: 8, title: "Lifestyle & Prevention", detail: "Offer smoking cessation support, vaccination (influenza, pneumococcal, COVID), diet and activity advice, and pulmonary/cardiac rehabilitation referrals where indicated." },
      { step: 9, title: "Close with Teach-Back & Document", detail: "Ask the patient to explain the plan back in their own words, address gaps, provide written material, arrange follow-up, and document the review and referrals." },
    ],
    checklist: [
      { id: "cd01", category: "Self-Management", ...catColor("blue"), question: "What are the three zones of a chronic disease action plan?", answer: "Green — stable: usual medications and monitoring.\nAmber — worsening: specific actions (e.g. start rescue pack, contact GP/nurse).\nRed — danger signs: seek emergency help immediately." },
      { id: "cd02", category: "COPD", ...catColor("amber"), question: "What defines a COPD exacerbation and its early signs?", answer: "Sustained worsening beyond normal day-to-day variation: increased breathlessness, increased sputum volume and/or purulence, wheeze, chest tightness — needing a change in medication." },
      { id: "cd03", category: "Diabetes", ...catColor("violet"), question: "What sick-day rules should a person with diabetes know?", answer: "Never stop insulin when unwell; monitor glucose (and ketones if type 1) more often; maintain fluids and carbohydrate intake; seek help for persistent vomiting, high glucose with ketones, or drowsiness." },
      { id: "cd04", category: "Heart Failure", ...catColor("red"), question: "What daily self-monitoring is taught in heart failure?", answer: "Daily morning weight (same scales, after voiding): report gain >2 kg in 3 days, increased breathlessness, orthopnoea or new ankle swelling. Follow fluid/salt guidance as prescribed." },
      { id: "cd05", category: "Concordance", ...catColor("green"), question: "How do you explore poor medication adherence without blame?", answer: "Normalise: \"Many people miss doses — how often does that happen for you?\" Explore practical barriers (cost, timing, side effects) and beliefs, then problem-solve together." },
      { id: "cd06", category: "Teach-Back", ...catColor("pink"), question: "What is teach-back and why is it used?", answer: "Asking the patient to explain in their own words what they will do — \"so I can check I explained it well.\" It verifies understanding rather than assuming it; re-teach and re-check any gaps." },
    ],
    quiz: [
      { id: "gq1", tag: "COPD", question: "A COPD patient reports greener, thicker sputum and more breathlessness for 2 days. Best response:", options: [ { key: "A", text: "Reassure — this is normal COPD" }, { key: "B", text: "Follow the action plan: start rescue medication as prescribed and contact the GP/team" }, { key: "C", text: "Double the inhaled steroid without advice" }, { key: "D", text: "Wait a week and review" } ], correct: "B", explanation: "Increased sputum purulence and dyspnoea signal an exacerbation — the amber zone of the action plan: rescue pack per prescription and clinical contact." },
      { id: "gq2", tag: "Heart Failure", question: "Which finding should a heart failure patient report urgently?", options: [ { key: "A", text: "Weight gain of 2.5 kg over 3 days" }, { key: "B", text: "Stable weight for a month" }, { key: "C", text: "Mild ankle swelling after a long flight last year" }, { key: "D", text: "One night of poor sleep" } ], correct: "A", explanation: "Rapid weight gain indicates fluid retention and impending decompensation — early reporting allows diuretic adjustment before hospitalisation." },
      { id: "gq3", tag: "Diabetes", question: "A type 1 diabetic with vomiting and glucose 22 mmol/L asks whether to stop insulin. You advise:", options: [ { key: "A", text: "Stop insulin until eating again" }, { key: "B", text: "Never stop insulin; check ketones, keep fluids up, and seek urgent help if ketones are raised" }, { key: "C", text: "Halve all insulin automatically" }, { key: "D", text: "Take double insulin and sleep" } ], correct: "B", explanation: "Stopping insulin when ill precipitates DKA. Sick-day rules: continue insulin, monitor glucose and ketones frequently, hydrate, and escalate early." },
      { id: "gq4", tag: "Education", question: "The best way to confirm a patient can use their new inhaler is:", options: [ { key: "A", text: "Ask \"Do you understand?\"" }, { key: "B", text: "Give the leaflet" }, { key: "C", text: "Watch them demonstrate the technique" }, { key: "D", text: "Check at next year's review" } ], correct: "C", explanation: "Up to 90% of patients use inhalers incorrectly. Observed demonstration with corrective feedback is the only reliable check — repeat at every review." },
      { id: "gq5", tag: "Behaviour", question: "A patient admits skipping tablets because of side effects. Your best response is:", options: [ { key: "A", text: "\"You must take them as prescribed\"" }, { key: "B", text: "\"Thank you for telling me — let's discuss the side effects and talk to the prescriber about options\"" }, { key: "C", text: "Document non-compliance and move on" }, { key: "D", text: "Warn them about the consequences firmly" } ], correct: "B", explanation: "Honesty about non-adherence is an opportunity. Explore, validate, and involve the prescriber — shared decisions produce sustainable concordance." },
    ],
    compare: [
      { feature: "Onset", "Type 1 Diabetes": "Usually childhood/young adult, rapid", "Type 2 Diabetes": "Usually adult, gradual" },
      { feature: "Cause", "Type 1 Diabetes": "Autoimmune beta-cell destruction — no insulin", "Type 2 Diabetes": "Insulin resistance ± relative deficiency" },
      { feature: "Treatment", "Type 1 Diabetes": "Insulin always, carb counting", "Type 2 Diabetes": "Lifestyle, oral agents, later insulin if needed" },
      { feature: "Emergency", "Type 1 Diabetes": "DKA (ketones)", "Type 2 Diabetes": "HHS (very high glucose, no significant ketones)" },
      { feature: "Sick-Day Priority", "Type 1 Diabetes": "Never stop insulin; check ketones", "Type 2 Diabetes": "May need to pause some drugs (e.g. metformin, SGLT2i) — follow plan" },
    ],
  },

  // ── Station 13: Teaching Session ─────────────────────────────────────────
  teaching: {
    title: "Patient Teaching & Health Education",
    intro:
      "This station tests your ability to plan and deliver a short patient teaching session — for example inhaler technique, insulin injection or wound self-care — assessing learning needs, adapting to the learner and confirming understanding with teach-back.",
    examTips: [
      "Structure your session: assess needs → set a shared goal → teach in small chunks → demonstrate → teach-back.",
      "Address health literacy: plain words, short sentences, no jargon, and check reading preferences sensitively.",
      "Use show-me: demonstrate, then have the patient practise with your feedback — doing beats hearing.",
      "Close the loop: \"Just so I know I explained it clearly, can you show/tell me how you'll do it at home?\"",
    ],
    steps: [
      { step: 1, title: "Assess Learning Needs", detail: "Ask what the patient already knows, what they want to learn, and what worries them. Identify barriers: language, literacy, vision/hearing, pain, anxiety, culture." },
      { step: 2, title: "Assess Readiness & Style", detail: "Check the moment is right (pain controlled, not mid-crisis) and how they learn best — watching, doing, reading, discussing. Involve family/carers with consent." },
      { step: 3, title: "Set Shared Objectives", detail: "Agree specific, achievable goals: \"By the end, you will draw up and inject your insulin safely.\" Small number of key points — three is plenty per session." },
      { step: 4, title: "Prepare the Environment", detail: "Quiet, private space; correct equipment (placebo devices, demonstration kit); written material in plain language to take away." },
      { step: 5, title: "Teach in Small Chunks", detail: "Explain one step at a time in plain language. Chunk and check: after each chunk, pause and invite questions before moving on." },
      { step: 6, title: "Demonstrate, Then Practise", detail: "Show the full skill, then repeat slowly narrating each step, then have the patient do it hands-on with your coaching. Correct errors gently and praise progress." },
      { step: 7, title: "Confirm with Teach-Back", detail: "Ask the patient to demonstrate or explain in their own words, framed as a check on YOUR teaching. Re-teach any gaps differently — don't just repeat louder." },
      { step: 8, title: "Plan Follow-Up & Document", detail: "Agree next review, provide contact details and written back-up, and document what was taught, how the patient responded and outstanding needs for the team." },
    ],
    checklist: [
      { id: "tc01", category: "Teach-Back", ...catColor("blue"), question: "How do you phrase teach-back without patronising the patient?", answer: "Put the onus on yourself: \"I want to be sure I explained this well — could you tell me in your own words how you'll take this at home?\"" },
      { id: "tc02", category: "Health Literacy", ...catColor("amber"), question: "Name five plain-language techniques for patient education.", answer: "Short sentences; everyday words instead of jargon; chunk information (3 key points); use pictures/demonstrations; repeat key messages; supply written material at an accessible reading level." },
      { id: "tc03", category: "Learning Styles", ...catColor("violet"), question: "How do you adapt teaching to different learning preferences?", answer: "Visual: diagrams, videos, watching a demo. Auditory: discussion, explanation. Kinaesthetic: hands-on practice with the device. Reading/writing: leaflets, written plans. Most skills teaching combines all." },
      { id: "tc04", category: "Assessment", ...catColor("green"), question: "What must be assessed BEFORE teaching begins?", answer: "Existing knowledge and beliefs, learning needs and goals, readiness (pain, anxiety, timing), barriers (language, literacy, senses, cognition), and preferred learning style." },
      { id: "tc05", category: "Motivation", ...catColor("pink"), question: "How can you increase a patient's motivation to learn?", answer: "Link learning to what matters to them (staying home, playing with grandchildren), involve them in goal-setting, build confidence with early success, and reinforce progress specifically." },
      { id: "tc06", category: "Evaluation", ...catColor("red"), question: "How do you evaluate whether teaching was effective?", answer: "Teach-back/return demonstration at the session, review at follow-up, objective outcomes (technique checks, readings, adherence), and the patient's own confidence rating." },
    ],
    quiz: [
      { id: "tq1", tag: "Teach-Back", question: "After teaching insulin injection, the BEST way to evaluate learning is:", options: [ { key: "A", text: "Ask \"Any questions?\"" }, { key: "B", text: "Have the patient demonstrate the injection with their own words and hands" }, { key: "C", text: "Give a leaflet to read at home" }, { key: "D", text: "Repeat your demonstration" } ], correct: "B", explanation: "Return demonstration with teach-back is the only method that verifies both understanding and technique. \"Any questions?\" usually gets \"no\" regardless of understanding." },
      { id: "tq2", tag: "Timing", question: "The worst time to deliver detailed education is:", options: [ { key: "A", text: "After pain is controlled" }, { key: "B", text: "Immediately after receiving distressing news" }, { key: "C", text: "At a planned review with family present" }, { key: "D", text: "When the patient asks questions" } ], correct: "B", explanation: "Anxiety and shock block information processing. Assess readiness first — deal with emotion, then educate at a better moment." },
      { id: "tq3", tag: "Literacy", question: "A patient keeps their reading glasses 'forgotten at home' every session. You should consider:", options: [ { key: "A", text: "They are careless" }, { key: "B", text: "Possible low literacy — switch to verbal, visual and hands-on methods sensitively" }, { key: "C", text: "Postponing teaching until they bring glasses" }, { key: "D", text: "Giving longer leaflets" } ], correct: "B", explanation: "'Forgotten glasses' is a classic face-saving sign of limited literacy. Never expose it publicly — adapt methods and offer support respectfully." },
      { id: "tq4", tag: "Chunking", question: "How much information should a single teaching session aim to convey?", options: [ { key: "A", text: "Everything about the condition" }, { key: "B", text: "Around three key points, taught in chunks with checks" }, { key: "C", text: "Whatever fits in an hour" }, { key: "D", text: "Only written information" } ], correct: "B", explanation: "People retain a small number of messages. Prioritise the need-to-know, chunk and check, and cover the rest across sessions with written back-up." },
      { id: "tq5", tag: "Goals", question: "Which teaching objective is best written?", options: [ { key: "A", text: "\"Patient will understand diabetes\"" }, { key: "B", text: "\"Patient will know more about insulin\"" }, { key: "C", text: "\"By discharge, the patient will independently draw up and self-inject insulin using correct technique\"" }, { key: "D", text: "\"Nurse will teach insulin\"" } ], correct: "C", explanation: "Objectives should be specific, measurable, patient-centred and time-bound — describing what the LEARNER will do, not what the teacher covers." },
    ],
  },

  // ── Station 14: Acute Management ─────────────────────────────────────────
  acute_management: {
    title: "ABCDE Assessment of the Acute Patient",
    intro:
      "This station tests systematic assessment and initial management of an acutely unwell patient — DKA, delirium, UTI/urosepsis, stoma complications or compartment syndrome — using the ABCDE approach with timely escalation.",
    examTips: [
      "Treat as you go: fix each ABCDE problem before moving on, and reassess after every intervention.",
      "State escalation early and specifically: who you are calling, and what you will say in ISBAR format.",
      "Know the emergencies cold: DKA triad (hyperglycaemia, ketones, acidosis) and the 6 Ps of compartment syndrome.",
      "Verbalise NEWS2 scoring and monitoring frequency — examiners want to hear your safety net.",
    ],
    steps: [
      { step: 1, title: "Safety & First Impression", detail: "Check the environment is safe, use PPE. Look, listen, feel: are they alert, talking, breathing normally? Call for help early if any concern." },
      { step: 2, title: "A — Airway", detail: "Is the airway patent (talking = patent)? Listen for stridor, gurgling, snoring. If obstructed: head-tilt chin-lift/jaw thrust, suction, adjuncts, and call for urgent help." },
      { step: 3, title: "B — Breathing", detail: "RR, SpO2, work of breathing, symmetry, auscultation. Treat: sit upright, high-flow oxygen 15 L via non-rebreathe if critically hypoxic (titrate later), prescribed nebulisers." },
      { step: 4, title: "C — Circulation", detail: "HR, BP, capillary refill, skin colour/temperature, urine output. Gain IV access, take bloods (include cultures, lactate, glucose), give prescribed IV fluids for hypotension." },
      { step: 5, title: "D — Disability", detail: "ACVPU or GCS, pupils, and ALWAYS check blood glucose — 'don't ever forget glucose'. Check ketones if glucose is high; assess pain." },
      { step: 6, title: "E — Exposure", detail: "Examine head-to-toe respecting dignity and warmth: rashes, wounds, bleeding, calves, drains and stomas, temperature. Then reassess A through E." },
      { step: 7, title: "Recognise the Pattern", detail: "Assemble findings: DKA (glucose >11, ketones ≥3, acidosis), urosepsis (fever, confusion, dysuria), compartment syndrome (pain out of proportion + 6 Ps), ischaemic/obstructed stoma (dark dusky stoma, no output)." },
      { step: 8, title: "Escalate with ISBAR", detail: "Call the doctor/outreach team with a structured ISBAR handover, request specific actions and timeframe, and re-escalate if the response is inadequate." },
      { step: 9, title: "Ongoing Monitoring & Documentation", detail: "Increase observation frequency per NEWS2, fluid balance chart, repeat glucose/ketones or limb checks as indicated, and document assessment, actions and responses in time order." },
    ],
    checklist: [
      { id: "am01", category: "ABCDE", ...catColor("blue"), question: "Outline the ABCDE approach in one line each.", answer: "A — airway patency\nB — breathing: RR, SpO2, effort → oxygen\nC — circulation: HR, BP, CRT → IV access/fluids\nD — disability: ACVPU/GCS, pupils, GLUCOSE\nE — exposure: full examination, temperature.\nTreat problems as found; reassess constantly." },
      { id: "am02", category: "DKA", ...catColor("red"), question: "What is the diagnostic triad of DKA and initial management?", answer: "Hyperglycaemia (>11 mmol/L), ketonaemia (≥3 mmol/L or 2+ ketonuria), acidosis (pH <7.3/bicarb <15). Management: urgent escalation, IV 0.9% saline, fixed-rate IV insulin, potassium monitoring." },
      { id: "am03", category: "Compartment", ...catColor("amber"), question: "List the 6 Ps of compartment syndrome — which is earliest?", answer: "Pain (earliest — severe, out of proportion, worse on passive stretch), Pressure/tense swelling, Paraesthesia, Pallor, Paralysis, Pulselessness (late). Elevate to heart level, remove constricting dressings, urgent surgical review." },
      { id: "am04", category: "Stoma", ...catColor("violet"), question: "What stoma findings require urgent escalation?", answer: "Dark, dusky or black stoma (ischaemia), no output with pain/distension (obstruction), significant bleeding, prolapse or retraction, and peristomal skin breakdown with sepsis signs." },
      { id: "am05", category: "UTI/Urosepsis", ...catColor("green"), question: "How can a UTI present atypically in older adults?", answer: "New confusion/delirium, falls, reduced mobility or 'off legs', incontinence, anorexia — often without classic dysuria or fever. Screen and treat early; watch for progression to urosepsis." },
      { id: "am06", category: "Glucose", ...catColor("pink"), question: "Why is glucose checked in every 'D' assessment?", answer: "Hypoglycaemia mimics stroke, intoxication and coma and is instantly reversible; hyperglycaemia with ketones flags DKA. Missing glucose is a classic, avoidable error — DEFG: 'Don't Ever Forget Glucose'." },
    ],
    quiz: [
      { id: "aq1", tag: "ABCDE", question: "During 'D' you find GCS 13 and glucose 2.4 mmol/L. Your immediate action is:", options: [ { key: "A", text: "Continue to E" }, { key: "B", text: "Treat hypoglycaemia now per protocol, then reassess" }, { key: "C", text: "Book an MRI" }, { key: "D", text: "Recheck glucose in an hour" } ], correct: "B", explanation: "ABCDE is treat-as-you-go: hypoglycaemia is immediately life-threatening and reversible — give glucose per protocol (oral if safe, IV/IM if not) and reassess." },
      { id: "aq2", tag: "DKA", question: "A type 1 diabetic has glucose 26 mmol/L, ketones 4.2, and deep sighing respirations. This breathing pattern is:", options: [ { key: "A", text: "Cheyne–Stokes" }, { key: "B", text: "Kussmaul respiration compensating for metabolic acidosis" }, { key: "C", text: "Normal anxiety" }, { key: "D", text: "Asthmatic wheeze" } ], correct: "B", explanation: "Deep, rapid Kussmaul breathing blows off CO2 to compensate for acidosis — with this triad it confirms DKA: escalate urgently for fluids and fixed-rate insulin." },
      { id: "aq3", tag: "Compartment", question: "Post-tibial-fracture, a patient has severe pain unrelieved by opioids and worse on passive toe stretch. You should:", options: [ { key: "A", text: "Elevate the limb above heart level on pillows and give more opioids" }, { key: "B", text: "Loosen constricting bandages, keep limb at heart level, and call the surgical team urgently" }, { key: "C", text: "Apply ice and reassess tomorrow" }, { key: "D", text: "Encourage weight-bearing" } ], correct: "B", explanation: "Pain out of proportion + pain on passive stretch = compartment syndrome until excluded. Release dressings, limb AT heart level (not high — perfusion falls), urgent surgical review for fasciotomy." },
      { id: "aq4", tag: "Stoma", question: "A day-2 colostomy has turned dark purple-black. This indicates:", options: [ { key: "A", text: "Normal healing" }, { key: "B", text: "Stomal ischaemia — urgent surgical review" }, { key: "C", text: "Dietary pigment" }, { key: "D", text: "Bruising from the bag" } ], correct: "B", explanation: "A healthy stoma is pink-red and moist. Dusky/black discolouration means compromised blood supply — report to the surgical team immediately." },
      { id: "aq5", tag: "Delirium", question: "An older patient is acutely confused with foul-smelling urine and NEWS2 of 6. The best framing is:", options: [ { key: "A", text: "Dementia — refer to memory clinic" }, { key: "B", text: "Delirium likely secondary to urinary sepsis — screen for sepsis and escalate now" }, { key: "C", text: "Behavioural problem — request sedation" }, { key: "D", text: "Normal for age" } ], correct: "B", explanation: "Acute confusion + infection signs + NEWS2 ≥5 = possible urosepsis with delirium: apply the sepsis screen, start Sepsis Six if triggered, and manage delirium by treating the cause." },
    ],
    compare: [
      { feature: "Typical Patient", "DKA": "Type 1 diabetes, younger", "HHS": "Type 2 diabetes, older" },
      { feature: "Glucose", "DKA": ">11 mmol/L (often 15–30)", "HHS": "Very high, often >30 mmol/L" },
      { feature: "Ketones/Acidosis", "DKA": "Ketones ≥3, pH <7.3", "HHS": "No significant ketosis/acidosis" },
      { feature: "Onset", "DKA": "Hours to days", "HHS": "Days to weeks; profound dehydration" },
      { feature: "Key Nursing Priorities", "DKA": "Fluids, fixed-rate insulin, potassium, hourly glucose/ketones", "HHS": "Slower rehydration, glucose control, VTE prophylaxis, pressure care" },
    ],
  },
};

// helper: spread category colours
function catColor(key: keyof typeof C) {
  return { categoryColor: C[key].color, categoryBg: C[key].bg };
}

export const getPracticalContent = (
  topicId: string
): PracticalTopicContent | null => PRACTICAL_CONTENT[topicId] ?? null;
