DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('groups', 'group_members'))
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, 'public', pol.tablename);
    END LOOP;
END
$$;

-- Secure simple policies for Groups
CREATE POLICY "groups_select_safe" ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups_insert_safe" ON public.groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "groups_update_safe" ON public.groups FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "groups_delete_safe" ON public.groups FOR DELETE USING (created_by = auth.uid());

-- Secure simple policies for Group Members
CREATE POLICY "group_members_select_safe" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "group_members_insert_safe" ON public.group_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND profile_id = auth.uid());
CREATE POLICY "group_members_delete_safe" ON public.group_members FOR DELETE USING (profile_id = auth.uid() OR auth.uid() IN (SELECT created_by FROM public.groups WHERE id = group_id));
