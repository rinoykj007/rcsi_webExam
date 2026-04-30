import { supabase } from "@/integrations/supabase/client";
import { getQuestions as getLocalQuestions, type Question } from "@/data/questions";

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

export async function fetchQuestions(topicId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("topic_id", topicId);

  if (error || !data || data.length === 0) {
    return getLocalQuestions(topicId);
  }

  return data.map((row: any) => ({
    id: row.id,
    topicId: row.topic_id,
    tag: row.tag,
    question: row.question,
    options: row.options as Question["options"],
    correct: row.correct,
    explanation: row.explanation,
    image_url: row.image_url ?? null,
  }));
}

/** Fetch a mixed pool of questions across all topics (mock exam). */
export async function fetchAllQuestions(limit = 30): Promise<Question[]> {
  const { data, error } = await supabase.from("questions").select("*");
  if (error || !data || data.length === 0) {
    const { QUESTIONS } = await import("@/data/questions");
    return Object.values(QUESTIONS).flat().slice(0, limit);
  }
  return data.slice(0, limit).map((row: any) => ({
    id: row.id,
    topicId: row.topic_id,
    tag: row.tag,
    question: row.question,
    options: row.options as Question["options"],
    correct: row.correct,
    explanation: row.explanation,
    image_url: row.image_url ?? null,
  }));
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
