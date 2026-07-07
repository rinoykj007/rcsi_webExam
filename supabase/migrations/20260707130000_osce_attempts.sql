-- OSCE progress tracker: attempt history for the station engine.
-- StoredAttempt in src/lib/osceProgressStats.ts maps column-for-column onto
-- osce_attempts; per-step results live in the results jsonb (StepResult[])
-- so the aggregation layer works identically over localStorage and DB rows.

create table if not exists public.osce_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  station_id text not null,
  station_title text not null,
  category text not null,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  -- ScoreSummaryResult fields, flattened for querying.
  marks_awarded integer not null,
  marks_available integer not null,
  pct integer not null,
  passed boolean not null,
  critical_fail boolean not null,
  timed_out boolean not null,
  -- StepResult[] as produced by the engine (stepId, pluginKey, marks, critical…).
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists osce_attempts_user_idx
  on public.osce_attempts (user_id, finished_at desc);
create index if not exists osce_attempts_user_category_idx
  on public.osce_attempts (user_id, category);

alter table public.osce_attempts enable row level security;

create policy "Users read own attempts"
  on public.osce_attempts for select
  using (auth.uid() = user_id);

create policy "Users insert own attempts"
  on public.osce_attempts for insert
  with check (auth.uid() = user_id);
