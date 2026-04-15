-- Add INSERT policy for AI Summaries since API uses anon key
CREATE POLICY "Allow anon insert for backend API" ON public.group_summaries
  FOR INSERT WITH CHECK (true);
