-- Migration: Add AI Summaries table
-- Date: 2026-04-11

CREATE TABLE IF NOT EXISTS public.group_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'annual')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.group_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Summaries viewable by members" ON public.group_summaries;
CREATE POLICY "Summaries viewable by members" ON public.group_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members 
      WHERE group_id = public.group_summaries.group_id 
      AND profile_id = auth.uid() 
      AND status = 'active'
    )
  );
