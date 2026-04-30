-- Image-based questions
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS image_url text;

-- Glossary terms per topic (admin managed, all authenticated can read)
CREATE TABLE IF NOT EXISTS public.glossary (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id text NOT NULL,
  term text NOT NULL,
  definition text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read glossary" ON public.glossary
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert glossary" ON public.glossary
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update glossary" ON public.glossary
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete glossary" ON public.glossary
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Weekly goal per user (sessions per week)
CREATE TABLE IF NOT EXISTS public.weekly_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  sessions_per_week integer NOT NULL DEFAULT 5,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own weekly goal" ON public.weekly_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own weekly goal" ON public.weekly_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own weekly goal" ON public.weekly_goals
  FOR UPDATE USING (auth.uid() = user_id);

-- Ensure flashcard_progress upsert by (user_id, flashcard_id) works
CREATE UNIQUE INDEX IF NOT EXISTS flashcard_progress_user_card_idx
  ON public.flashcard_progress (user_id, flashcard_id);

-- Unique on topic_progress to support upsert
CREATE UNIQUE INDEX IF NOT EXISTS topic_progress_user_topic_idx
  ON public.topic_progress (user_id, topic_id);