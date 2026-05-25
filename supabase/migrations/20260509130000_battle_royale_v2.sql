-- Migration: Battle Royale V2 — Full Game Mode
-- Date: 2026-05-09
-- Adds round tracking, voting table, winner, immunity, and gamification

-- ═══════════════════════════════════════════════
-- 1. EXTEND survival_games
-- ═══════════════════════════════════════════════

ALTER TABLE public.survival_games
  ADD COLUMN IF NOT EXISTS current_round INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_rounds INT,
  ADD COLUMN IF NOT EXISTS winner_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'voting';

-- Drop old constraint if exists, add new one
ALTER TABLE public.survival_games DROP CONSTRAINT IF EXISTS survival_games_phase_check;
ALTER TABLE public.survival_games ADD CONSTRAINT survival_games_phase_check
  CHECK (phase IN ('voting', 'final_duel', 'finished'));

-- Drop old status constraint and re-add (compatible)
ALTER TABLE public.survival_games DROP CONSTRAINT IF EXISTS survival_games_status_check;
ALTER TABLE public.survival_games ADD CONSTRAINT survival_games_status_check
  CHECK (status IN ('active', 'finished'));

-- ═══════════════════════════════════════════════
-- 2. EXTEND survival_participants
-- ═══════════════════════════════════════════════

ALTER TABLE public.survival_participants
  ADD COLUMN IF NOT EXISTS eliminated_round INT,
  ADD COLUMN IF NOT EXISTS final_position INT,
  ADD COLUMN IF NOT EXISTS points_earned INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_immune BOOLEAN DEFAULT false;

-- ═══════════════════════════════════════════════
-- 3. NEW TABLE: survival_votes
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.survival_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.survival_games(id) ON DELETE CASCADE NOT NULL,
  round INT NOT NULL,
  voter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, round, voter_id)
);

-- ═══════════════════════════════════════════════
-- 4. RLS for survival_votes
-- ═══════════════════════════════════════════════

ALTER TABLE public.survival_votes ENABLE ROW LEVEL SECURITY;

-- Members of the group can view votes
DROP POLICY IF EXISTS "Votes viewable by group members" ON public.survival_votes;
CREATE POLICY "Votes viewable by group members" ON public.survival_votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.survival_games g
      JOIN public.group_members m ON m.group_id = g.group_id
      WHERE g.id = public.survival_votes.game_id AND m.profile_id = auth.uid()
    )
  );

-- Alive participants can insert votes
DROP POLICY IF EXISTS "Alive participants can vote" ON public.survival_votes;
CREATE POLICY "Alive participants can vote" ON public.survival_votes
  FOR INSERT WITH CHECK (
    auth.uid() = voter_id
    AND EXISTS (
      SELECT 1 FROM public.survival_participants sp
      WHERE sp.game_id = public.survival_votes.game_id
      AND sp.profile_id = auth.uid()
      AND sp.is_eliminated = false
    )
  );

-- In final_duel, ALL group members can vote (including eliminated)
-- This is handled at application level by checking game phase

-- ═══════════════════════════════════════════════
-- 5. INDEXES for performance
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_survival_votes_game_round ON public.survival_votes(game_id, round);
CREATE INDEX IF NOT EXISTS idx_survival_votes_voter ON public.survival_votes(game_id, round, voter_id);
CREATE INDEX IF NOT EXISTS idx_survival_games_group_status ON public.survival_games(group_id, status);
