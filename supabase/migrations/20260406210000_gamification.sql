-- Add streak tracking to profiles
alter table public.profiles 
add column if not exists current_streak integer default 0,
add column if not exists last_voted_at timestamp with time zone;

-- Create Badges table
create table if not exists public.badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  icon_url text, -- Store SVG/Lucide icon name
  rarity text default 'common', -- common, rare, epic, legendary
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profile Badges (Join Table)
create table if not exists public.profile_badges (
  profile_id uuid references public.profiles on delete cascade,
  badge_id uuid references public.badges on delete cascade,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (profile_id, badge_id)
);

-- Enable RLS for new tables
alter table public.badges enable row level security;
alter table public.profile_badges enable row level security;

-- RLS Policies
create policy "Badges are viewable by everyone" on public.badges for select using (true);
create policy "Profile badges are viewable by everyone" on public.profile_badges for select using (true);

-- Insert initial badges
insert into public.badges (name, description, icon_url, rarity) values
('Primer Círculo', 'Únete a tu primer grupo.', 'users', 'common'),
('Votante Maestro', 'Vota en 10 encuestas diferentes.', 'zap', 'rare'),
('Racha de Fuego', 'Mantén una racha de 7 días.', 'flame', 'epic'),
('Creador de Tendencias', 'Crea 5 encuestas populares.', 'sparkles', 'legendary');
