-- Migration: Zumbidos and Predictions
-- Date: 2026-04-11

-- 1. Zumbidos (Nudges)
CREATE TABLE IF NOT EXISTS public.nudges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Prevent spamming: max 1 nudge per (sender, receiver, poll)
  UNIQUE(poll_id, sender_id, receiver_id)
);

ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Nudges viewable by receiver" ON public.nudges;
CREATE POLICY "Nudges viewable by receiver" ON public.nudges
  FOR SELECT USING (auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert nudges" ON public.nudges;
CREATE POLICY "Users can insert nudges" ON public.nudges
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their received nudges" ON public.nudges;
CREATE POLICY "Users can update their received nudges" ON public.nudges
  FOR UPDATE USING (auth.uid() = receiver_id);

-- 2. Predicciones (Update Polls)
-- Add new poll type allowing future predictions
ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS polls_poll_type_check;
ALTER TABLE public.polls ADD CONSTRAINT polls_poll_type_check 
  CHECK (poll_type IN ('pool', 'vs', 'boolean', 'ranked', 'prediction'));

-- Add prediction resolution fields
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS resolution_status TEXT DEFAULT 'open' CHECK (resolution_status IN ('open', 'resolved'));
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS resolved_target_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
