-- Run in Supabase SQL Editor or via Supabase CLI.
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  account_type text default 'patient' check (account_type in ('patient', 'professional')),
  weight numeric,
  gender text,
  location text,
  date_of_birth date,
  is_pro boolean default false,
  dark_mode boolean default false,
  language text default 'en',
  assessment_complete boolean default false,
  profile_setup_complete boolean default false,
  emergency_contact text,
  freud_score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mood entries
create table public.mood_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mood text not null check (mood in ('depressed', 'sad', 'neutral', 'happy', 'overjoyed')),
  note text,
  created_at timestamptz default now()
);

-- Journal entries
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  type text default 'text' check (type in ('text', 'voice')),
  emotion text check (emotion in ('depressed', 'sad', 'neutral', 'happy', 'overjoyed')),
  stress_level integer check (stress_level between 1 and 5),
  stressors text[],
  sentiment text check (sentiment in ('positive', 'negative', 'neutral')),
  has_crisis_language boolean default false,
  ai_suggestions jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stress entries
create table public.stress_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stress_level integer not null check (stress_level between 1 and 5),
  stressors text[],
  life_impact text,
  created_at timestamptz default now()
);

-- Sleep entries
create table public.sleep_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  sleep_at timestamptz,
  wake_at timestamptz,
  duration_hours numeric,
  rem_hours numeric,
  core_hours numeric,
  quality text check (quality in ('normal', 'care', 'rem', 'irregular', 'insomniac')),
  ai_suggestions jsonb default '[]',
  created_at timestamptz default now()
);

-- Sleep schedules
create table public.sleep_schedules (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  bedtime text not null,
  wake_time text not null,
  repeat_days text[],
  snooze_count integer default 1,
  auto_display_stats boolean default false,
  auto_set_alarm boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Mindful sessions
create table public.mindful_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('breathing', 'mindfulness', 'relax', 'sleep')),
  duration_minutes integer,
  goal text,
  soundscape text,
  freud_score_gained integer default 0,
  stress_reduced integer default 0,
  created_at timestamptz default now()
);

-- AI chatbot conversations
create table public.chatbot_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  ai_persona text default 'Dr. Freud AI',
  is_private boolean default false,
  tags text[],
  knowledge_sources text[],
  pull_from_journal boolean default false,
  token_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI chatbot messages
create table public.chatbot_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.chatbot_conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Freud score history
create table public.freud_score_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null,
  label text,
  reason text,
  created_at timestamptz default now()
);

-- Community posts
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  category text,
  post_type text check (post_type in ('story', 'regular', 'real')),
  tags text[],
  is_hidden boolean default false,
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

-- Assessment responses
create table public.assessment_responses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  responses jsonb not null,
  initial_freud_score integer,
  completed_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.mood_entries enable row level security;
alter table public.journal_entries enable row level security;
alter table public.stress_entries enable row level security;
alter table public.sleep_entries enable row level security;
alter table public.sleep_schedules enable row level security;
alter table public.mindful_sessions enable row level security;
alter table public.chatbot_conversations enable row level security;
alter table public.chatbot_messages enable row level security;
alter table public.freud_score_history enable row level security;
alter table public.community_posts enable row level security;
alter table public.assessment_responses enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users own mood entries" on public.mood_entries for all using (auth.uid() = user_id);
create policy "Users own journal entries" on public.journal_entries for all using (auth.uid() = user_id);
create policy "Users own stress entries" on public.stress_entries for all using (auth.uid() = user_id);
create policy "Users own sleep entries" on public.sleep_entries for all using (auth.uid() = user_id);
create policy "Users own sleep schedules" on public.sleep_schedules for all using (auth.uid() = user_id);
create policy "Users own mindful sessions" on public.mindful_sessions for all using (auth.uid() = user_id);
create policy "Users own chatbot conversations" on public.chatbot_conversations for all using (auth.uid() = user_id);
create policy "Users own chatbot messages" on public.chatbot_messages
  for all using (
    auth.uid() = (select user_id from public.chatbot_conversations where id = conversation_id)
  );
create policy "Users own freud score history" on public.freud_score_history for all using (auth.uid() = user_id);
create policy "Users own assessment responses" on public.assessment_responses for all using (auth.uid() = user_id);

create policy "Community posts are public" on public.community_posts for select using (true);
create policy "Users own their posts" on public.community_posts for insert with check (auth.uid() = user_id);
create policy "Users can update own posts" on public.community_posts for update using (auth.uid() = user_id);
create policy "Users can delete own posts" on public.community_posts for delete using (auth.uid() = user_id);

-- Auto-create profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
