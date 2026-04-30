-- QUESTIONS (shared content, readable by authenticated users)
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id text NOT NULL,
  tag text NOT NULL DEFAULT 'General',
  question text NOT NULL,
  options jsonb NOT NULL,
  correct integer NOT NULL,
  explanation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_topic ON public.questions(topic_id);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read questions" ON public.questions
  FOR SELECT TO authenticated USING (true);

-- FLASHCARDS (shared content)
CREATE TABLE public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id text NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_flashcards_topic ON public.flashcards(topic_id);
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read flashcards" ON public.flashcards
  FOR SELECT TO authenticated USING (true);

-- FLASHCARD PROGRESS (per user)
CREATE TABLE public.flashcard_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  flashcard_id uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  known boolean NOT NULL DEFAULT false,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own flashcard progress" ON public.flashcard_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own flashcard progress" ON public.flashcard_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own flashcard progress" ON public.flashcard_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own flashcard progress" ON public.flashcard_progress
  FOR DELETE USING (auth.uid() = user_id);

-- SCHEDULED TASKS (per user)
CREATE TABLE public.scheduled_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  icon text NOT NULL DEFAULT '📚',
  color text NOT NULL DEFAULT 'mint',
  scheduled_date date NOT NULL,
  scheduled_time time,
  duration_min integer NOT NULL DEFAULT 20,
  topic_id text,
  route text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_scheduled_tasks_user_date ON public.scheduled_tasks(user_id, scheduled_date);
ALTER TABLE public.scheduled_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own scheduled tasks" ON public.scheduled_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own scheduled tasks" ON public.scheduled_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own scheduled tasks" ON public.scheduled_tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own scheduled tasks" ON public.scheduled_tasks
  FOR DELETE USING (auth.uid() = user_id);