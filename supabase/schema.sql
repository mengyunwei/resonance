-- =========================================
-- RESONANCE — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- =========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---- PROFILES ----
-- One profile per auth user (founder or investor)
create table profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  role        text not null check (role in ('founder', 'investor')),
  full_name   text,
  email       text,
  company     text,
  title       text,
  location    text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'founder'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---- STARTUPS ----
create table startups (
  id            uuid default uuid_generate_v4() primary key,
  founder_id    uuid references profiles(id) on delete cascade,
  name          text not null,
  sector        text,
  stage         text check (stage in ('Pre-Seed', 'Seed', 'Series A', 'Series B')),
  description   text,
  location      text,
  founded_year  int,
  team_size     int,
  website       text,
  raising_amount numeric,
  pre_money_val  numeric,
  verified      boolean default false,
  created_at    timestamptz default now()
);

-- ---- FINANCIAL METRICS ----
create table financial_metrics (
  id             uuid default uuid_generate_v4() primary key,
  startup_id     uuid references startups(id) on delete cascade,
  arr            numeric,
  mrr            numeric,
  mom_growth     numeric,   -- percentage e.g. 22.5
  burn_rate      numeric,
  runway_months  int,
  gross_margin   numeric,   -- percentage
  cac            numeric,
  ltv            numeric,
  burn_multiple  numeric,
  source         text check (source in ('quickbooks', 'stripe', 'brex', 'manual')),
  verified       boolean default false,
  recorded_at    timestamptz default now()
);

-- ---- AUDIT SCORES ----
create table audit_scores (
  id                  uuid default uuid_generate_v4() primary key,
  startup_id          uuid references startups(id) on delete cascade,
  overall_score       int check (overall_score between 0 and 100),
  financial_score     int check (financial_score between 0 and 100),
  unit_econ_score     int check (unit_econ_score between 0 and 100),
  legal_score         int check (legal_score between 0 and 100),
  dataroom_score      int check (dataroom_score between 0 and 100),
  verified_badge      boolean default false,
  audit_report_url    text,
  created_at          timestamptz default now()
);

-- ---- DATA ROOM DOCUMENTS ----
create table documents (
  id           uuid default uuid_generate_v4() primary key,
  startup_id   uuid references startups(id) on delete cascade,
  name         text not null,
  type         text check (type in ('pitch_deck', 'financial_model', 'cap_table', 'revenue_dashboard', 'team_bios', 'ip_patents', 'demo_video', 'customer_refs', 'bylaws', 'incorporation', 'board_minutes', 'shareholder_agreement', 'other')),
  storage_path text,
  is_public    boolean default false,
  verified     boolean default false,
  uploaded_at  timestamptz default now()
);

-- ---- INVESTORS ----
create table investors (
  id              uuid references profiles(id) on delete cascade primary key,
  fund_name       text,
  fund_size       numeric,
  check_min       numeric,
  check_max       numeric,
  stages          text[],   -- e.g. ['Pre-Seed', 'Seed']
  sectors         text[],   -- e.g. ['HealthTech', 'AI']
  geographies     text[],
  thesis          text,
  portfolio_count int,
  verified        boolean default false,
  actively_investing boolean default true
);

-- ---- PIPELINE (investor tracking startups) ----
create table pipeline (
  id           uuid default uuid_generate_v4() primary key,
  investor_id  uuid references investors(id) on delete cascade,
  startup_id   uuid references startups(id) on delete cascade,
  status       text default 'reviewing' check (status in ('reviewing', 'shortlisted', 'pitched', 'diligence', 'term_sheet', 'passed', 'invested')),
  match_score  int,
  notes        text,
  added_at     timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(investor_id, startup_id)
);

-- ---- ROW LEVEL SECURITY ----

alter table profiles         enable row level security;
alter table startups         enable row level security;
alter table financial_metrics enable row level security;
alter table audit_scores     enable row level security;
alter table documents        enable row level security;
alter table investors        enable row level security;
alter table pipeline         enable row level security;

-- Profiles: users see only their own
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Startups: founders manage their own; investors can read all
create policy "Founders manage own startups"
  on startups for all using (auth.uid() = founder_id);
create policy "Investors can read startups"
  on startups for select
  using (exists (select 1 from investors where id = auth.uid()));

-- Financial metrics: founders manage; investors read verified only
create policy "Founders manage own metrics"
  on financial_metrics for all
  using (exists (select 1 from startups where id = startup_id and founder_id = auth.uid()));
create policy "Investors read verified metrics"
  on financial_metrics for select
  using (verified = true and exists (select 1 from investors where id = auth.uid()));

-- Audit scores: founders read own; investors read all
create policy "Founders read own audit"
  on audit_scores for select
  using (exists (select 1 from startups where id = startup_id and founder_id = auth.uid()));
create policy "Investors read audit scores"
  on audit_scores for select
  using (exists (select 1 from investors where id = auth.uid()));

-- Documents: founders manage own; investors read public docs
create policy "Founders manage own documents"
  on documents for all
  using (exists (select 1 from startups where id = startup_id and founder_id = auth.uid()));
create policy "Investors read public documents"
  on documents for select
  using (is_public = true and exists (select 1 from investors where id = auth.uid()));

-- Investors: everyone can read investor profiles
create policy "Anyone can read investor profiles"
  on investors for select using (true);
create policy "Investors manage own profile"
  on investors for all using (auth.uid() = id);

-- Pipeline: investors manage their own
create policy "Investors manage own pipeline"
  on pipeline for all using (auth.uid() = investor_id);
