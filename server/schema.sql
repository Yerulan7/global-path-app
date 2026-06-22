-- Global Path — database schema
-- Run this in Supabase SQL Editor before seed.sql

create table if not exists universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  city text,
  website text,
  qs_rank int
);

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references universities(id) on delete cascade,
  name text not null,
  degree_level text not null,        -- 'bachelor' | 'master'
  field text,
  language text,                     -- language of instruction
  target_country text not null,
  tuition_min_eur int,
  tuition_max_eur int,
  ielts_min numeric,
  gpa_min numeric,
  source_url text,
  last_verified_at timestamptz       -- provenance: prove the data is fresh
);

create table if not exists intakes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references programs(id) on delete cascade,
  year int not null,
  season text,                       -- 'fall' | 'spring'
  opens_at date,
  closes_at date
);

create table if not exists scholarships (
  id uuid primary key default gen_random_uuid(),
  target_country text not null,
  name text not null,
  amount_min_eur int,
  amount_max_eur int,
  covers text,                       -- 'tuition' | 'living' | 'both'
  source_url text,
  last_verified_at timestamptz
);

create table if not exists profiles (
  user_id uuid primary key,
  full_name text,
  source_country text,
  target_country text,
  field text,
  degree_level text,
  gpa numeric,
  gpa_scale numeric,
  language text,
  language_level text,
  budget_monthly_eur int,
  updated_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  program_id uuid references programs(id) on delete cascade,
  status text not null default 'planning',
  notes text,
  updated_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  status text not null default 'missing',
  file_url text
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null,                -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz default now()
);
