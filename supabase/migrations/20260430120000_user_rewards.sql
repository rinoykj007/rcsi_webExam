-- user_rewards: persistent gamification state (points + badges) per user
create table public.user_rewards (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  total_points integer not null default 0,
  badges      jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now(),
  unique (user_id)
);

alter table public.user_rewards enable row level security;

create policy "users manage own rewards"
  on public.user_rewards for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
