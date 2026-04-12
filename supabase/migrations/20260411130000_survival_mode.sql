-- Migration: Survival Mode (Battle Royale)
-- Date: 2026-04-11

CREATE TABLE IF NOT EXISTS public.survival_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'finished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.survival_participants (
  game_id UUID REFERENCES public.survival_games(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_eliminated BOOLEAN DEFAULT false,
  eliminated_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (game_id, profile_id)
);

ALTER TABLE public.survival_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survival_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Games viewable by members" ON public.survival_games;
CREATE POLICY "Games viewable by members" ON public.survival_games
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.survival_games.group_id AND profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "Participants viewable by members" ON public.survival_participants;
CREATE POLICY "Participants viewable by members" ON public.survival_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.survival_games g
      JOIN public.group_members m ON m.group_id = g.group_id
      WHERE g.id = public.survival_participants.game_id AND m.profile_id = auth.uid()
    )
  );

-- Admins can update games
DROP POLICY IF EXISTS "Admins can update games" ON public.survival_games;
CREATE POLICY "Admins can update games" ON public.survival_games
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.survival_games.group_id 
      AND profile_id = auth.uid() 
      AND role IN ('admin', 'creator')
    )
  );

DROP POLICY IF EXISTS "Admins can update participants" ON public.survival_participants;
CREATE POLICY "Admins can update participants" ON public.survival_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.survival_games g
      JOIN public.group_members m ON m.group_id = g.group_id
      WHERE g.id = public.survival_participants.game_id 
      AND m.profile_id = auth.uid()
      AND m.role IN ('admin', 'creator')
    )
  );

-- Also add 'battle_royale' to poll types so they can be identified
ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS polls_poll_type_check;
ALTER TABLE public.polls ADD CONSTRAINT polls_poll_type_check 
  CHECK (poll_type IN ('pool', 'vs', 'boolean', 'ranked', 'prediction', 'battle_royale'));
