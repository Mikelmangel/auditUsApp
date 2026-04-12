DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('polls', 'votes', 'group_poll_history'))
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, 'public', pol.tablename);
    END LOOP;
END
$$;

-- Secure simple policies for Polls
CREATE POLICY "polls_select_safe" ON public.polls FOR SELECT USING (true);
CREATE POLICY "polls_insert_safe" ON public.polls FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "polls_update_safe" ON public.polls FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "polls_delete_safe" ON public.polls FOR DELETE USING (auth.uid() IS NOT NULL);

-- Secure simple policies for Votes
CREATE POLICY "votes_select_safe" ON public.votes FOR SELECT USING (true);
CREATE POLICY "votes_insert_safe" ON public.votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "votes_update_safe" ON public.votes FOR UPDATE USING (voter_id = auth.uid());
CREATE POLICY "votes_delete_safe" ON public.votes FOR DELETE USING (voter_id = auth.uid());

-- Secure simple policies for Group Poll History
CREATE POLICY "gph_select_safe" ON public.group_poll_history FOR SELECT USING (true);
CREATE POLICY "gph_insert_safe" ON public.group_poll_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
