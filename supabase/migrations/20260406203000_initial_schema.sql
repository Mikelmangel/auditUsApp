-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  points integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GROUPS
create table public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GROUP MEMBERS
create table public.group_members (
  group_id uuid references public.groups on delete cascade,
  profile_id uuid references public.profiles on delete cascade,
  role text default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, profile_id)
);

-- POLLS
create table public.polls (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  group_id uuid references public.groups on delete cascade not null,
  created_by uuid references auth.users on delete set null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VOTES
create table public.votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references public.polls on delete cascade not null,
  voter_id uuid references public.profiles on delete cascade not null,
  target_id uuid references public.profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(poll_id, voter_id)
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.polls enable row level security;
alter table public.votes enable row level security;

-- Profiles: Anyone can read profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Groups: Members can see their groups
create policy "Groups are viewable by members" on public.groups
  for select using (
    exists (
      select 1 from public.group_members
      where group_id = public.groups.id
      and profile_id = auth.uid()
    )
  );

-- Group Members: Members can see other members
create policy "Members are viewable by group members" on public.group_members
  for select using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = public.group_members.group_id
      and gm.profile_id = auth.uid()
    )
  );

-- Polls: Group members can see and create polls
create policy "Polls are viewable by group members" on public.polls
  for select using (
    exists (
      select 1 from public.group_members
      where group_id = public.polls.group_id
      and profile_id = auth.uid()
    )
  );

-- Votes: Group members can see votes and own votes
create policy "Votes are viewable by group members" on public.votes
  for select using (
    exists (
      select 1 from public.polls p
      join public.group_members gm on gm.group_id = p.group_id
      where p.id = public.votes.poll_id
      and gm.profile_id = auth.uid()
    )
  );

create policy "Users can cast votes in their groups" on public.votes
  for insert with check (
    exists (
      select 1 from public.polls p
      join public.group_members gm on gm.group_id = p.group_id
      where p.id = poll_id
      and gm.profile_id = auth.uid()
    )
    and voter_id = auth.uid()
  );
