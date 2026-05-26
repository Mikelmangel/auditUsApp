-- Add group_points column to group_members
ALTER TABLE public.group_members
  ADD COLUMN IF NOT EXISTS group_points INTEGER DEFAULT 0;

-- Backfill group_points based on existing votes
UPDATE public.group_members gm
SET group_points = (
  SELECT COUNT(*) * 10
  FROM public.votes v
  JOIN public.polls p ON v.poll_id = p.id
  WHERE v.voter_id = gm.profile_id
    AND p.group_id = gm.group_id
);
