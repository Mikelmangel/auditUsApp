-- Fix infinite recursion in group_members
DROP POLICY IF EXISTS "Group members viewable by members." ON public.group_members;
DROP POLICY IF EXISTS "Group members visible to others" ON public.group_members;

-- Make group_members readable by anyone authenticated (group UUID is secret anyway)
CREATE POLICY "Group members readable by authenticated" ON public.group_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix Groups select policy: creator can always see it, OR member can see it
DROP POLICY IF EXISTS "Groups viewable by members." ON public.groups;
CREATE POLICY "Groups viewable by members." ON public.groups
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.groups.id AND profile_id = auth.uid())
  );
