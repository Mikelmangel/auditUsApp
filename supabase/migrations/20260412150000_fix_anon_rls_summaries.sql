-- Fix RLS: allow anon to read and insert group_summaries for API functionality
DROP POLICY IF EXISTS "Summaries viewable by members" ON public.group_summaries;
CREATE POLICY "Summaries viewable by members" ON public.group_summaries
  FOR SELECT USING (
    auth.uid() IS NULL OR 
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_summaries.group_id 
      AND profile_id = auth.uid() 
      AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Allow anon insert for backend API" ON public.group_summaries;
CREATE POLICY "Allow anon insert for backend API" ON public.group_summaries
  FOR INSERT WITH CHECK (true);
