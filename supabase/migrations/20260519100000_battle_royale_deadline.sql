-- Migration: Battle Royale — Deadlines + RLS fix for final_duel
-- Date: 2026-05-19

-- ═══════════════════════════════════════════════
-- 1. Add deadline tracking to survival_games
-- ═══════════════════════════════════════════════

ALTER TABLE public.survival_games
  ADD COLUMN IF NOT EXISTS round_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS round_processed BOOLEAN DEFAULT FALSE;

-- ═══════════════════════════════════════════════
-- 2. Fix RLS: allow ALL group members to vote
--    (final_duel needs eliminated players to vote too)
-- ═══════════════════════════════════════════════

DROP POLICY IF EXISTS "Alive participants can vote" ON public.survival_votes;

CREATE POLICY "Group members can vote" ON public.survival_votes
  FOR INSERT WITH CHECK (
    auth.uid() = voter_id
    AND EXISTS (
      SELECT 1 FROM public.survival_games g
      JOIN public.group_members m ON m.group_id = g.group_id
      WHERE g.id = public.survival_votes.game_id
        AND m.profile_id = auth.uid()
        AND m.status = 'active'
    )
  );

-- ═══════════════════════════════════════════════
-- 3. Index for cron: find expired unprocessed rounds
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_survival_games_deadline
  ON public.survival_games(round_deadline)
  WHERE status = 'active' AND round_processed = FALSE;
