// FON – Fundamentals of Nursing content (ported from RCSIExamAgent)

export interface MustStep { label: string; detail: string }
export interface DipstickRow { marker: string; indicates: string; color: string; bg: string }
export interface WaterlowFactor { factor: string; detail: string }
export interface CatheterStep { step: number; title: string }
export interface OsceStep { id: string; title: string; detail: string }
export interface FonFlashCard { id: string; question: string; answer: string; category: string; categoryColor: string; categoryBg: string }
export interface FonQuizOption { key: string; text: string }
export interface FonQuizQuestion { id: string; tag: string; question: string; options: FonQuizOption[]; correct: string; explanation: string }
export interface CompareRow { feature: string; must: string; waterlow: string }
export interface DipstickCompareRow { feature: string; dipstick: string; lab: string }

export const MUST_STEPS: MustStep[] = [
  { label: "Step 1 – BMI Score",          detail: "BMI >20 = 0 pts · BMI 18.5–20 = 1 pt · BMI <18.5 = 2 pts" },
  { label: "Step 2 – Weight Loss Score",  detail: "<5% = 0 pts · 5–10% = 1 pt · >10% = 2 pts" },
  { label: "Step 3 – Acute Disease Effect", detail: "If acutely ill and no/minimal nutritional intake for >5 days → add 2 pts" },
];

export const MUST_SCORES = [
  { score: "0",  risk: "Low Risk",    color: "#16a34a", bg: "#F0FDF4", action: "Routine clinical care. Repeat screening weekly (hospital) or annually (community)." },
  { score: "1",  risk: "Medium Risk", color: "#D97706", bg: "#FFFBEB", action: "Observe. Document 3-day dietary intake. Repeat weekly (hospital) or monthly (care home)." },
  { score: "≥2", risk: "High Risk",   color: "#DC2626", bg: "#FEF2F2", action: "Treat. Refer to dietitian. Improve nutritional intake. Monitor and review." },
];

export const DIPSTICK_ROWS: DipstickRow[] = [
  { marker: "Glucose",    indicates: "Diabetes mellitus / renal glycosuria",                             color: "#7c3aed", bg: "#F5F3FF" },
  { marker: "Protein",    indicates: "Kidney disease / nephrotic syndrome / pre-eclampsia",              color: "#0284c7", bg: "#EFF6FF" },
  { marker: "Blood",      indicates: "UTI / kidney stones / trauma / menstruation",                      color: "#DC2626", bg: "#FEF2F2" },
  { marker: "Nitrites",   indicates: "Bacterial infection (gram-negative bacteria)",                     color: "#D97706", bg: "#FFFBEB" },
  { marker: "Leukocytes", indicates: "UTI / urinary tract inflammation",                                 color: "#16a34a", bg: "#F0FDF4" },
  { marker: "Ketones",    indicates: "Diabetic ketoacidosis / starvation / dehydration",                 color: "#0369a1", bg: "#E0F2FE" },
  { marker: "Bilirubin",  indicates: "Liver disease / bile duct obstruction",                            color: "#92400e", bg: "#FEF3C7" },
  { marker: "pH",         indicates: "Alkaline urine (>7) → UTI / renal tubular acidosis. Acidic (<5) → dehydration", color: "#475569", bg: "#F1F5F9" },
];

export const CATHETER_SAMPLE_STEPS: CatheterStep[] = [
  { step: 1,  title: "Perform hand hygiene" },
  { step: 2,  title: "Clamp catheter tubing (10–15 min to allow urine to accumulate)" },
  { step: 3,  title: "Put on clean gloves" },
  { step: 4,  title: "Clean sampling port with 70% alcohol wipe (30 sec)" },
  { step: 5,  title: "Insert sterile syringe into sampling port" },
  { step: 6,  title: "Aspirate required volume of urine" },
  { step: 7,  title: "Transfer urine into sterile specimen container" },
  { step: 8,  title: "Unclamp catheter tubing" },
  { step: 9,  title: "Label specimen, complete request form, send to lab promptly" },
  { step: 10, title: "Remove gloves, perform hand hygiene, document" },
];

export const CATHETER_CARE = [
  { text: "Maintain a closed drainage system at all times" },
  { text: "Keep drainage bag below bladder level to prevent backflow" },
  { text: "Empty bag before it is full (when ½–¾ full)" },
  { text: "Avoid kinks or loops in tubing" },
  { text: "Perform meatal hygiene with soap & water daily" },
  { text: "Document urine output, colour, and odour" },
];

export const WATERLOW_FACTORS: WaterlowFactor[] = [
  { factor: "Build / Weight", detail: "Average = 0, Above average = 1, Obese = 2, Below average = 3" },
  { factor: "Skin Type",      detail: "Healthy = 0, Thin/dry/oedematous/clammy/discoloured/broken = 1–3" },
  { factor: "Sex / Age",      detail: "Male = 1, Female = 2, 14–49 = 1, 50–64 = 2, 65–74 = 3, 75–80 = 4, 81+ = 5" },
  { factor: "Continence",     detail: "Complete/catheter = 0, Occasional incontinence = 1, Catheter/incontinent urine = 2, Doubly incontinent = 3" },
  { factor: "Mobility",       detail: "Fully mobile = 0, Restless/fidgety = 1, Apathetic = 2, Restricted = 3, Inert/traction = 4, Chairbound = 5" },
  { factor: "Appetite",       detail: "Average = 0, Poor = 1, NG tube/fluids only = 2, NBM/anorexic = 3" },
];

export const WATERLOW_SCORES = [
  { range: "< 10",  risk: "No risk",       color: "#16a34a", bg: "#F0FDF4" },
  { range: "10–14", risk: "At risk",        color: "#D97706", bg: "#FFFBEB" },
  { range: "15–19", risk: "High risk",      color: "#DC2626", bg: "#FEF2F2" },
  { range: "≥ 20",  risk: "Very high risk", color: "#7c3aed", bg: "#F5F3FF" },
];

export const WATERLOW_PREVENTION = [
  "Reposition every 2 hours (pressure relief)",
  "Use pressure-relieving mattress/cushion",
  "Maintain good skin care and moisture management",
  "Ensure adequate nutrition and hydration",
  "Patient education on position changes",
];

export const OSCE_STEPS: OsceStep[] = [
  { id: "s1", title: "Introduction & Consent",       detail: "Introduce yourself, verify patient ID, explain procedure, gain consent. Perform hand hygiene." },
  { id: "s2", title: "MUST Assessment",              detail: "Calculate BMI score, weight loss score, and acute disease effect. Record total score and risk level." },
  { id: "s3", title: "Urine Dipstick",               detail: "Obtain midstream urine (or CSU), dip strip, read at correct time intervals per manufacturer, document results." },
  { id: "s4", title: "Catheter Sample Collection",   detail: "Clamp catheter, clean port with alcohol wipe, aspirate sample with sterile syringe, transfer to container, unclamp." },
  { id: "s5", title: "Catheter Care Assessment",     detail: "Check system is closed, bag position below bladder, no kinks, meatal hygiene, urine characteristics." },
  { id: "s6", title: "Waterlow Assessment",          detail: "Assess all risk factors (build, skin, mobility, continence, appetite, sex/age), calculate total score, identify risk level." },
  { id: "s7", title: "Documentation & Handover",     detail: "Record all findings accurately, report abnormalities to senior, complete ISBAR handover if needed, perform hand hygiene." },
];

export const FON_FLASHCARDS: FonFlashCard[] = [
  { id: "fn01", category: "MUST Tool",      categoryColor: "#0284c7", categoryBg: "#EFF6FF",
    question: "What does MUST stand for?",
    answer: "Malnutrition Universal Screening Tool — used to identify adults at risk of malnutrition." },
  { id: "fn02", category: "MUST Tool",      categoryColor: "#0284c7", categoryBg: "#EFF6FF",
    question: "What are the 3 components of the MUST score?",
    answer: "1. BMI score\n2. Unplanned weight loss score\n3. Acute disease effect score" },
  { id: "fn03", category: "MUST Tool",      categoryColor: "#0284c7", categoryBg: "#EFF6FF",
    question: "What does a MUST score of ≥2 indicate?",
    answer: "High risk of malnutrition → refer to dietitian, improve nutritional intake, monitor and review." },
  { id: "fn04", category: "MUST Tool",      categoryColor: "#0284c7", categoryBg: "#EFF6FF",
    question: "In MUST, when is 2 points added for acute disease effect?",
    answer: "When the patient is acutely ill and there has been no nutritional intake (or likely to be) for more than 5 days." },
  { id: "fn05", category: "Urine Dipstick", categoryColor: "#7c3aed", categoryBg: "#F5F3FF",
    question: "What does a positive nitrite on urine dipstick suggest?",
    answer: "Urinary tract infection (UTI) — caused by gram-negative bacteria converting nitrates to nitrites." },
  { id: "fn06", category: "Urine Dipstick", categoryColor: "#7c3aed", categoryBg: "#F5F3FF",
    question: "What does glucose in urine (glycosuria) indicate?",
    answer: "Diabetes mellitus (blood glucose exceeding renal threshold ~10 mmol/L) or renal glycosuria." },
  { id: "fn07", category: "Urine Dipstick", categoryColor: "#7c3aed", categoryBg: "#F5F3FF",
    question: "Can you collect a catheter urine sample from the drainage bag?",
    answer: "NO — never collect from the drainage bag. Always aspirate from the sampling port using a sterile syringe." },
  { id: "fn08", category: "Urine Dipstick", categoryColor: "#7c3aed", categoryBg: "#F5F3FF",
    question: "What does proteinuria on dipstick suggest?",
    answer: "Kidney disease (e.g. nephrotic syndrome), pre-eclampsia in pregnancy, or UTI." },
  { id: "fn09", category: "Catheter Care",  categoryColor: "#16a34a", categoryBg: "#F0FDF4",
    question: "Why must the urinary drainage bag always be kept below bladder level?",
    answer: "To prevent backflow of urine into the bladder, which would introduce bacteria and increase risk of CAUTI (catheter-associated UTI)." },
  { id: "fn10", category: "Catheter Care",  categoryColor: "#16a34a", categoryBg: "#F0FDF4",
    question: "What is CAUTI?",
    answer: "Catheter-Associated Urinary Tract Infection — the most common healthcare-associated infection linked to urinary catheters." },
  { id: "fn11", category: "Catheter Care",  categoryColor: "#16a34a", categoryBg: "#F0FDF4",
    question: "How often should meatal hygiene be performed for a catheterised patient?",
    answer: "At least once daily using soap and water, and after each bowel movement." },
  { id: "fn12", category: "Waterlow",       categoryColor: "#DC2626", categoryBg: "#FEF2F2",
    question: "What is the Waterlow score used for?",
    answer: "Assessing a patient's risk of developing pressure ulcers (pressure injuries)." },
  { id: "fn13", category: "Waterlow",       categoryColor: "#DC2626", categoryBg: "#FEF2F2",
    question: "What Waterlow score indicates 'very high risk'?",
    answer: "A score of ≥20 indicates very high risk of pressure ulcer development." },
  { id: "fn14", category: "Waterlow",       categoryColor: "#DC2626", categoryBg: "#FEF2F2",
    question: "List 3 key interventions for a high Waterlow score.",
    answer: "1. Reposition every 2 hours\n2. Use pressure-relieving mattress\n3. Optimise nutrition and hydration" },
  { id: "fn15", category: "Waterlow",       categoryColor: "#DC2626", categoryBg: "#FEF2F2",
    question: "Which Waterlow factor scores highest for mobility?",
    answer: "Chairbound = 5 points (highest mobility score)." },
  { id: "fn16", category: "Documentation",  categoryColor: "#D97706", categoryBg: "#FFFBEB",
    question: "What framework is used for clinical handover in Irish nursing practice?",
    answer: "ISBAR — Identify, Situation, Background, Assessment, Recommendation." },
  { id: "fn17", category: "Documentation",  categoryColor: "#D97706", categoryBg: "#FFFBEB",
    question: "What are the key principles of nursing documentation?",
    answer: "Accurate, timely, legible, factual, signed, dated, and in permanent ink. Never use correction fluid." },
];

export const FON_QUIZ: FonQuizQuestion[] = [
  {
    id: "q1", tag: "MUST",
    question: "A patient has BMI 17.5, unplanned weight loss of 8%, and is acutely ill with no intake for 6 days. What is their MUST score?",
    options: [{ key: "A", text: "3" }, { key: "B", text: "4" }, { key: "C", text: "5" }, { key: "D", text: "6" }],
    correct: "C",
    explanation: "BMI <18.5 = 2 pts + weight loss 5–10% = 1 pt + acute disease >5 days = 2 pts → total = 5.",
  },
  {
    id: "q2", tag: "MUST",
    question: "A MUST score of 1 indicates which level of nutritional risk?",
    options: [{ key: "A", text: "Low risk — routine care" }, { key: "B", text: "Medium risk — observe" }, { key: "C", text: "High risk — treat" }, { key: "D", text: "Critical — nil by mouth" }],
    correct: "B",
    explanation: "MUST score 1 = Medium risk. Action: observe, document dietary intake over 3 days, repeat screening weekly in hospital or monthly in care home.",
  },
  {
    id: "q3", tag: "Urine Dipstick",
    question: "Which urine dipstick finding is most specific for a bacterial UTI?",
    options: [{ key: "A", text: "Protein +" }, { key: "B", text: "Blood +" }, { key: "C", text: "Nitrites +" }, { key: "D", text: "Glucose +" }],
    correct: "C",
    explanation: "Nitrites are produced by gram-negative bacteria (e.g. E. coli) converting urinary nitrates. Positive nitrites strongly suggest bacterial UTI.",
  },
  {
    id: "q4", tag: "Catheter",
    question: "Where should you collect a catheter urine specimen from?",
    options: [{ key: "A", text: "From the drainage bag" }, { key: "B", text: "From the sampling port after clamping" }, { key: "C", text: "From a fresh catheter inserted for sampling" }, { key: "D", text: "From the junction of catheter and tubing" }],
    correct: "B",
    explanation: "Always aspirate from the sampling port after clamping the tubing for 10–15 minutes. Never use the drainage bag — urine there is stagnant and may give false or contaminated results.",
  },
  {
    id: "q5", tag: "Waterlow",
    question: "Which of the following Waterlow scores indicates the patient is 'at risk' of pressure ulcers?",
    options: [{ key: "A", text: "Score 5" }, { key: "B", text: "Score 12" }, { key: "C", text: "Score 16" }, { key: "D", text: "Score 22" }],
    correct: "B",
    explanation: "Waterlow 10–14 = At risk. Score <10 = no risk, 15–19 = high risk, ≥20 = very high risk.",
  },
  {
    id: "q6", tag: "Catheter Care",
    question: "Why is it important to keep the urinary drainage bag below bladder level?",
    options: [{ key: "A", text: "To improve urine flow by gravity" }, { key: "B", text: "To prevent backflow and reduce CAUTI risk" }, { key: "C", text: "To make it easier to read urine output" }, { key: "D", text: "To prevent the bag from overfilling" }],
    correct: "B",
    explanation: "Keeping the bag below bladder level prevents urinary backflow into the bladder, the primary mechanism for catheter-associated UTI (CAUTI).",
  },
  {
    id: "q7", tag: "Documentation",
    question: "Which of the following is NOT an acceptable documentation practice?",
    options: [{ key: "A", text: "Recording findings immediately after assessment" }, { key: "B", text: "Using correction fluid (Tipp-Ex) to correct errors" }, { key: "C", text: "Signing and dating each entry" }, { key: "D", text: "Writing in factual, objective language" }],
    correct: "B",
    explanation: "Correction fluid must never be used in nursing documentation. Errors should be crossed out with a single line, initialled and dated.",
  },
  {
    id: "q8", tag: "Waterlow",
    question: "How frequently should a patient with a Waterlow score of 18 be repositioned?",
    options: [{ key: "A", text: "Every 6 hours" }, { key: "B", text: "Every 4 hours" }, { key: "C", text: "Every 2 hours" }, { key: "D", text: "Once per shift" }],
    correct: "C",
    explanation: "Score 18 = High risk (15–19). High-risk patients require repositioning at least every 2 hours, use of pressure-relieving equipment, and regular skin assessment.",
  },
];

export const MUST_VS_WATERLOW: CompareRow[] = [
  { feature: "Purpose",      must: "Nutritional risk screening",          waterlow: "Pressure ulcer risk assessment" },
  { feature: "Key factors",  must: "BMI, weight loss, acute illness",     waterlow: "Mobility, skin, continence, nutrition, build" },
  { feature: "Low risk",     must: "Score 0",                             waterlow: "Score < 10" },
  { feature: "Medium risk",  must: "Score 1",                             waterlow: "Score 10–14" },
  { feature: "High risk",    must: "Score ≥ 2",                           waterlow: "Score 15–19" },
  { feature: "Very high",    must: "N/A",                                 waterlow: "Score ≥ 20" },
  { feature: "Action (high)", must: "Dietitian referral",                 waterlow: "Pressure mattress + 2-hrly turns" },
  { feature: "Validated for", must: "Adults in all care settings",        waterlow: "Adults in hospital/community" },
];

export const DIPSTICK_VS_LAB: DipstickCompareRow[] = [
  { feature: "Speed",                  dipstick: "Immediate (1–2 min)",                        lab: "24–48 hours" },
  { feature: "Setting",                dipstick: "Bedside / ward",                              lab: "Laboratory required" },
  { feature: "Cost",                   dipstick: "Low",                                          lab: "Higher" },
  { feature: "Accuracy",               dipstick: "Screening only",                              lab: "Gold standard" },
  { feature: "Identifies organism",    dipstick: "No",                                           lab: "Yes (MC&S)" },
  { feature: "Antibiotic sensitivity", dipstick: "No",                                           lab: "Yes" },
  { feature: "False positives",        dipstick: "Common (e.g. blood in menstruation)",         lab: "Rare" },
  { feature: "Used for",               dipstick: "Initial screening",                           lab: "Diagnosis & treatment guidance" },
];
