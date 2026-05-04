import { collection, getDocs } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";
import { getQuestions as getLocalQuestions, type Question } from "@/data/questions";
import { firebaseDb } from "@/lib/firebase";

export interface DbQuestion {
  id: string;
  topic_id: string;
  tag: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct: number;
  explanation: string;
  image_url?: string | null;
}

// ── Firebase helpers ──────────────────────────────────────────────────────────

const TAG_MAP: Record<string, string> = {
  infection_control: "Infection Control",
  fundamentals: "Fundamentals of Nursing",
  isbar: "ISBAR",
  sepsis: "Sepsis",
  older_person: "Older Person",
  wound_dressing: "Wound Dressing",
  iv_infusion: "IV Infusion",
  chest_infection: "Chest Infection",
  oral_drug: "Oral Drug",
  nok_discussion: "NOK Discussion",
  death_dying: "Death & Dying",
  chronic_disease: "Chronic Disease",
  teaching: "Teaching",
  acute_management: "Acute Management",
};

const ALL_TOPICS = Object.keys(TAG_MAP);

function toQuestion(topicId: string, docId: string, d: Record<string, unknown>): Question {
  return {
    id: docId,
    topicId,
    tag: TAG_MAP[topicId] ?? topicId,
    question: d.question as string,
    options: ((d.options as string[]) ?? []).map((text, i) => ({
      key: ["A", "B", "C", "D"][i] as "A" | "B" | "C" | "D",
      text,
    })),
    correct: d.correct as number,
    explanation: (d.explanation as string) ?? "",
    image_url: null,
  };
}

async function firebaseTopicQuestions(topicId: string): Promise<Question[]> {
  try {
    const snap = await getDocs(collection(firebaseDb, "questions", topicId, "items"));
    return snap.docs.map((doc) => toQuestion(topicId, doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return [];
  }
}

async function firebaseAllQuestions(): Promise<Question[]> {
  const results = await Promise.all(ALL_TOPICS.map(firebaseTopicQuestions));
  return results.flat();
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchQuestions(topicId: string): Promise<Question[]> {
  // Firebase first — always has the full question bank
  const fbQs = await firebaseTopicQuestions(topicId);
  if (fbQs.length > 0) return fbQs;

  // Firebase unavailable → try Supabase
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("topic_id", topicId);

  if (!error && data && data.length > 0) {
    return data.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      topicId: row.topic_id as string,
      tag: row.tag as string,
      question: row.question as string,
      options: row.options as Question["options"],
      correct: row.correct as number,
      explanation: row.explanation as string,
      image_url: (row.image_url as string | null) ?? null,
    }));
  }

  // Final fallback: local static bank
  return getLocalQuestions(topicId);
}

/** Fetch a mixed pool across all topics (mock exam / home MCQ button). */
export async function fetchAllQuestions(limit = 30): Promise<Question[]> {
  // Firebase first — all 200+ questions across every station
  const fbQs = await firebaseAllQuestions();
  if (fbQs.length > 0) {
    return fbQs.sort(() => Math.random() - 0.5).slice(0, limit);
  }

  // Firebase unavailable → try Supabase
  const { data, error } = await supabase.from("questions").select("*");
  if (!error && data && data.length > 0) {
    return data
      .map((row: Record<string, unknown>) => ({
        id: row.id as string,
        topicId: row.topic_id as string,
        tag: row.tag as string,
        question: row.question as string,
        options: row.options as Question["options"],
        correct: row.correct as number,
        explanation: row.explanation as string,
        image_url: (row.image_url as string | null) ?? null,
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Final fallback: local static bank
  const { QUESTIONS } = await import("@/data/questions");
  return Object.values(QUESTIONS).flat().sort(() => Math.random() - 0.5).slice(0, limit);
}

export interface DbFlashcard {
  id: string;
  topic_id: string;
  front: string;
  back: string;
}

export async function fetchFlashcards(topicId: string): Promise<DbFlashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at");
  if (error || !data) return [];
  return data;
}

export async function markFlashcardKnown(userId: string, flashcardId: string, known: boolean) {
  await supabase
    .from("flashcard_progress")
    .upsert(
      { user_id: userId, flashcard_id: flashcardId, known, reviewed_at: new Date().toISOString() },
      { onConflict: "user_id,flashcard_id" },
    );
}

export async function fetchUserFlashcardProgress(userId: string) {
  const { data } = await supabase.from("flashcard_progress").select("*").eq("user_id", userId);
  return data ?? [];
}

export interface GlossaryTerm {
  id: string;
  topic_id: string;
  term: string;
  definition: string;
}

export async function fetchGlossary(topicId: string): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from("glossary")
    .select("*")
    .eq("topic_id", topicId)
    .order("term");
  if (error || !data) return [];
  return data as GlossaryTerm[];
}

export interface StationOverviewData {
  id: string;
  station_id: string;
  title: string;
  description: string;
  hero_description: string;
  sections: unknown[];
  steps: unknown[];
  flashcards: unknown[];
  quiz_questions: unknown[];
  compare_table: unknown[];
  learning_objectives: string[];
  important_points: string[];
  created_at: string;
}

export async function fetchStationOverview(stationId: string): Promise<StationOverviewData | null> {
  const { data, error } = await supabase
    .from("station_overviews")
    .select("*")
    .eq("station_id", stationId)
    .single();

  if (error || !data) {
    // Fallback to local content for now
    if (stationId === "infection_control") {
      const {
        INFECTION_CONTROL_OVERVIEW,
        INFECTION_CONTROL_STEPS,
        INFECTION_CONTROL_FLASHCARDS,
        INFECTION_CONTROL_QUIZ,
        INFECTION_CONTROL_COMPARE_TABLE,
      } = await import("@/data/infectionControlContent");

      return {
        id: "ic-1",
        station_id: "infection_control",
        title: INFECTION_CONTROL_OVERVIEW.title,
        description: INFECTION_CONTROL_OVERVIEW.description,
        hero_description: INFECTION_CONTROL_OVERVIEW.hero_description,
        sections: INFECTION_CONTROL_OVERVIEW.sections,
        steps: INFECTION_CONTROL_STEPS,
        flashcards: INFECTION_CONTROL_FLASHCARDS,
        quiz_questions: INFECTION_CONTROL_QUIZ,
        compare_table: INFECTION_CONTROL_COMPARE_TABLE,
        learning_objectives: INFECTION_CONTROL_OVERVIEW.learning_objectives,
        important_points: INFECTION_CONTROL_OVERVIEW.important_points,
        created_at: new Date().toISOString(),
      };
    }
  }

  return data as StationOverviewData;
}
