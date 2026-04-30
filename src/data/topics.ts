export interface Topic {
  id: string;
  label: string;
  station_id: number;
  dotColor: string;
  /** Light background tint for cards (HSL/HEX). */
  tint: string;
  description: string;
}

export const TOPICS: Topic[] = [
  { id: "infection_control", label: "Infection Control", station_id: 1, dotColor: "#db2777", tint: "#fce7f3", description: "Standard precautions, hand hygiene, PPE and isolation principles for safe nursing practice." },
  { id: "fundamentals", label: "Fundamentals of Nursing", station_id: 2, dotColor: "#3b82f6", tint: "#dbeafe", description: "Core nursing assessments — MUST, urinalysis, catheter care and Waterlow." },
  { id: "isbar", label: "ISBAR Communication", station_id: 3, dotColor: "#ef4444", tint: "#fee2e2", description: "Structured clinical handover using Identification, Situation, Background, Assessment & Recommendation." },
  { id: "sepsis", label: "Sepsis Management", station_id: 4, dotColor: "#f97316", tint: "#ffedd5", description: "Recognition, escalation and Sepsis Six bundle management." },
  { id: "death_dying", label: "Death & Dying", station_id: 5, dotColor: "#64748b", tint: "#e2e8f0", description: "End-of-life care, dignity, family communication and post-mortem care." },
  { id: "wound_dressing", label: "Wound Dressing", station_id: 6, dotColor: "#ea580c", tint: "#fed7aa", description: "Aseptic technique, wound assessment and evidence-based dressing selection." },
  { id: "iv_infusion", label: "IV Infusion", station_id: 7, dotColor: "#7c3aed", tint: "#ede9fe", description: "IV therapy setup, monitoring and complication management." },
  { id: "chest_infection", label: "Chest Infection", station_id: 8, dotColor: "#0284c7", tint: "#e0f2fe", description: "Pneumonia types — CAP, HAP, aspiration, atypical, viral and bronchiectasis." },
  { id: "oral_drug", label: "Oral Drug Admin", station_id: 9, dotColor: "#ca8a04", tint: "#fef9c3", description: "Five rights, calculation and safe oral medication administration." },
  { id: "nok_discussion", label: "NOK Discussion", station_id: 10, dotColor: "#d97706", tint: "#fef3c7", description: "Sensitive conversations with next of kin and breaking difficult news." },
  { id: "older_person", label: "Older Person Care", station_id: 11, dotColor: "#16a34a", tint: "#dcfce7", description: "Comprehensive geriatric assessment, falls and frailty." },
  { id: "chronic_disease", label: "Chronic Disease", station_id: 12, dotColor: "#dc2626", tint: "#fee2e2", description: "Long-term condition management, self-care education and exacerbation triggers." },
  { id: "teaching", label: "Teaching Session", station_id: 13, dotColor: "#0d9488", tint: "#ccfbf1", description: "Patient education using teach-back, learning styles and health literacy." },
  { id: "acute_management", label: "Acute Management", station_id: 14, dotColor: "#4f46e5", tint: "#e0e7ff", description: "Nursing process in acute situations — DKA, UTI, delirium, stoma, compartment syndrome and sepsis." },
];

export const getTopicById = (id: string) => TOPICS.find((t) => t.id === id);

// Routing for "Study Module" button on station overview
export const studyModuleRoute = (topicId: string): string => {
  switch (topicId) {
    case "infection_control": return "/screens/infection-control";
    case "fundamentals":      return "/screens/fon";
    case "isbar":             return "/screens/isbar";
    case "chest_infection":   return "/screens/practical/chest_infection";
    case "acute_management":  return "/screens/acuteManagement";
    default:                  return `/screens/practical/${topicId}`;
  }
};
