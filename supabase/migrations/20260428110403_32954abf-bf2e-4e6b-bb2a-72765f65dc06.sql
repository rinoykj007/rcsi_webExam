
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Progress
create table public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  correct int not null default 0,
  total int not null default 0,
  last_studied timestamptz not null default now(),
  unique (user_id, topic_id)
);
alter table public.topic_progress enable row level security;

create policy "Users view own progress" on public.topic_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on public.topic_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on public.topic_progress for update using (auth.uid() = user_id);
create policy "Users delete own progress" on public.topic_progress for delete using (auth.uid() = user_id);
