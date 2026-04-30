export interface Question {
  id: string;
  topicId: string;
  tag: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct: number; // index 0..3
  explanation: string;
  image_url?: string | null;
}

const make = (
  topicId: string,
  tag: string,
  question: string,
  options: string[],
  correct: number,
  explanation: string,
  idSuffix: string,
): Question => ({
  id: `${topicId}_${idSuffix}`,
  topicId,
  tag,
  question,
  options: options.map((text, i) => ({ key: ["A", "B", "C", "D"][i] as "A" | "B" | "C" | "D", text })),
  correct,
  explanation,
});

export const QUESTIONS: Record<string, Question[]> = {
  infection_control: [
    make("infection_control", "Hand Hygiene", "What is the FIRST moment of hand hygiene per WHO?",
      ["After patient contact", "Before patient contact", "Before aseptic task", "After body fluid exposure"], 1,
      "Before patient contact is moment 1 of the WHO 5 Moments framework.", "q1"),
    make("infection_control", "PPE", "Correct order to DON PPE:",
      ["Gloves, gown, mask, eye protection", "Mask, gown, gloves, eye protection", "Gown, mask, eye protection, gloves", "Eye protection, mask, gown, gloves"], 2,
      "Don in this order: gown → mask → eye protection → gloves.", "q2"),
    make("infection_control", "Isolation", "A patient with C. difficile requires which precautions?",
      ["Standard only", "Droplet", "Contact (with soap & water hand wash)", "Airborne"], 2,
      "C. difficile spores are not killed by alcohol gel; soap and water + contact precautions.", "q3"),
    make("infection_control", "Sharps", "Most appropriate action after a needlestick injury:",
      ["Squeeze the wound vigorously", "Wash with soap and water, encourage bleeding, report immediately", "Apply alcohol gel only", "Cover with dressing and continue shift"], 1,
      "Wash, allow to bleed gently, report and follow occupational health pathway.", "q4"),
    make("infection_control", "Standard Precautions", "Standard precautions apply to:",
      ["Only patients with known infection", "All patients regardless of diagnosis", "Only when handling blood", "Patients in isolation rooms only"], 1,
      "Standard precautions apply to ALL patients, all the time.", "q5"),
  ],
  fundamentals: [
    make("fundamentals", "MUST", "A MUST score of 2 indicates:",
      ["Low risk", "Medium risk", "High risk", "No risk"], 2,
      "MUST ≥2 = high risk of malnutrition; refer to dietitian.", "q1"),
    make("fundamentals", "Catheter", "First action for a blocked indwelling catheter:",
      ["Replace catheter immediately", "Check for kinks and reposition", "Flush with 50ml water", "Remove and re-site"], 1,
      "Always assess for external causes (kinks, position) first.", "q2"),
    make("fundamentals", "Waterlow", "Waterlow score >20 indicates:",
      ["Low risk", "At risk", "High risk", "Very high risk"], 3,
      ">20 = very high risk for pressure ulcer development.", "q3"),
    make("fundamentals", "Urinalysis", "Positive nitrites on dipstick most strongly suggest:",
      ["Diabetes", "UTI", "Dehydration", "Liver disease"], 1,
      "Nitrites are produced by Gram-negative bacteria — suggestive of UTI.", "q4"),
  ],
  acute_management: [
    make("acute_management", "DKA", "First-line fluid in DKA for an adult:",
      ["5% Dextrose", "0.9% Sodium Chloride", "Hartmann's", "Colloid"], 1,
      "0.9% Sodium Chloride is first-line; switch to dextrose-containing fluids when glucose <14 mmol/L.", "q1"),
    make("acute_management", "Sepsis", "Sepsis Six should be completed within:",
      ["30 minutes", "1 hour", "3 hours", "6 hours"], 1,
      "All six elements within 1 hour of recognition.", "q2"),
    make("acute_management", "Delirium", "Best initial screening tool for delirium:",
      ["MMSE", "4AT", "GCS", "AMTS"], 1,
      "4AT is rapid (<2 min) and validated for delirium screening.", "q3"),
    make("acute_management", "Compartment Syndrome", "Earliest sign of compartment syndrome:",
      ["Pulselessness", "Pain out of proportion", "Pallor", "Paralysis"], 1,
      "Pain disproportionate to injury is the earliest and most reliable sign.", "q4"),
  ],
  // Generic placeholder set used for any other topic
  default: [],
};

const defaultSet = (topicId: string): Question[] => [
  make(topicId, "General", "Sample question — replace with real content from your bank.",
    ["Option A", "Option B", "Option C", "Option D"], 1,
    "This is placeholder content. Add real questions for this station.", "q1"),
  make(topicId, "General", "Another placeholder question for this station.",
    ["Choice 1", "Choice 2", "Choice 3", "Choice 4"], 0,
    "Placeholder explanation.", "q2"),
];

export const getQuestions = (topicId: string): Question[] =>
  QUESTIONS[topicId] ?? defaultSet(topicId);
