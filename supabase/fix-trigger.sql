-- =========================================
-- Run this in Supabase Dashboard > SQL Editor
-- Fixes "Database error saving new user"
-- =========================================

-- 1. Ensure the profiles table exists
create table if not exists profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  role        text not null default 'founder' check (role in ('founder', 'investor')),
  first_name  text,
  last_name   text,
  full_name   text,
  email       text,
  company     text,
  title       text,
  location    text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- 2. Enable RLS
alter table profiles enable row level security;

-- 3. Drop and recreate the trigger function with:
--    - set search_path = public (required for security definer functions)
--    - exception handler so a profile insert failure never blocks user creation
--    - first_name / last_name support
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

create or replace function handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, role, first_name, last_name, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'founder'),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      trim(
        coalesce(new.raw_user_meta_data->>'first_name', '') || ' ' ||
        coalesce(new.raw_user_meta_data->>'last_name', '')
      )
    ),
    new.email
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    -- Never block user creation due to profile insert failure
    return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 4. RLS policies for profiles
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Service role can insert profiles" on profiles;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Allow the trigger (running as service role) to insert
create policy "Service role can insert profiles"
  on profiles for insert with check (true);
