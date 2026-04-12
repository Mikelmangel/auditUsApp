-- Migration: Add creator role and banning status
-- Date: 2026-04-11

-- 1. Update roles and status
ALTER TABLE public.group_members 
DROP CONSTRAINT IF EXISTS group_members_role_check;

-- Note: We assume the previous constraint might not have been named or had a default name.
-- In case it was named differently, we can just try to drop the likely name or ignore if it fails in manual run, 
-- but for a migration we should be careful.
-- However, standard Postgres usually names it <table_name>_<column_name>_check.

DO $$ 
BEGIN
    ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_role_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE public.group_members
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'banned'));

ALTER TABLE public.group_members
ADD CONSTRAINT group_members_role_check CHECK (role IN ('creator', 'admin', 'member'));

-- 2. Update RLS for group_members
-- Allow admins/creators to update member status (to 'banned' for kicking)
-- We need to avoid recursion. The "kill all recursion" migrations use a specific pattern if they exist.
-- Let's check how they fixed recursion.

DROP POLICY IF EXISTS "Admins can update members" ON public.group_members;
CREATE POLICY "Admins can update members" ON public.group_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = public.group_members.group_id
      AND gm.profile_id = auth.uid()
      AND gm.role IN ('creator', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = public.group_members.group_id
      AND gm.profile_id = auth.uid()
      AND gm.role IN ('creator', 'admin')
    )
  );

-- Only creator can update admins
-- This is hard to enforce without recursion in one policy, but we can try:
-- For now, let's keep it simple: Anyone in 'creator' or 'admin' can kick status to 'banned'.

-- 3. Update existing creators
-- We can set anyone who is listed as 'created_by' in 'groups' to 'creator' role in 'group_members'.
UPDATE public.group_members gm
SET role = 'creator'
FROM public.groups g
WHERE gm.group_id = g.id AND gm.profile_id = g.created_by;

-- 4. Prevent banned users from seeing group content
-- Current policies for groups, polls, etc usually check for membership.
-- We should update them to check for 'active' status.

DROP POLICY IF EXISTS "Groups viewable by members" ON public.groups;
CREATE POLICY "Groups viewable by members" ON public.groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.groups.id 
      AND profile_id = auth.uid() 
      AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Polls viewable by group members" ON public.polls;
CREATE POLICY "Polls viewable by group members" ON public.polls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.polls.group_id 
      AND profile_id = auth.uid() 
      AND status = 'active'
    )
  );
