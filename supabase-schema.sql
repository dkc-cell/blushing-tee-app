-- Blushing Birdie Supabase schema
-- Run this in Supabase SQL Editor after creating the project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text not null,
  name text not null,
  pars jsonb not null default '{}'::jsonb,
  yardages jsonb not null default '{}'::jsonb,
  course_rating numeric,
  slope_rating integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_id text not null,
  date date not null,
  course_name text not null default 'Unnamed Course',
  holes jsonb not null default '[]'::jsonb,
  custom_pars jsonb not null default '{}'::jsonb,
  custom_yardages jsonb not null default '{}'::jsonb,
  course_rating numeric,
  slope_rating integer,
  highlight text not null default '',
  focus_next_round text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.rounds enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.courses to authenticated;
grant select, insert, update, delete on public.rounds to authenticated;

alter table public.courses add column if not exists local_id text;
update public.courses set local_id = id::text where local_id is null;
alter table public.courses alter column local_id set not null;

alter table public.rounds add column if not exists local_id text;
update public.rounds set local_id = id::text where local_id is null;
alter table public.rounds alter column local_id set not null;

create unique index if not exists courses_user_id_local_id_key
  on public.courses(user_id, local_id);

create unique index if not exists rounds_user_id_local_id_key
  on public.rounds(user_id, local_id);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can read own courses" on public.courses;
create policy "Users can read own courses"
  on public.courses for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own courses" on public.courses;
create policy "Users can insert own courses"
  on public.courses for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own courses" on public.courses;
create policy "Users can update own courses"
  on public.courses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own courses" on public.courses;
create policy "Users can delete own courses"
  on public.courses for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can read own rounds" on public.rounds;
create policy "Users can read own rounds"
  on public.rounds for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own rounds" on public.rounds;
create policy "Users can insert own rounds"
  on public.rounds for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own rounds" on public.rounds;
create policy "Users can update own rounds"
  on public.rounds for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own rounds" on public.rounds;
create policy "Users can delete own rounds"
  on public.rounds for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists rounds_set_updated_at on public.rounds;
create trigger rounds_set_updated_at
  before update on public.rounds
  for each row execute function public.set_updated_at();
