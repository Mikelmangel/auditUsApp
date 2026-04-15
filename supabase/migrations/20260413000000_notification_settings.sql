-- Migration: Create notification_settings table for granular Web Push preferences
-- Date: 2026-04-13

CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('nudges', 'new_poll', 'results_ready', 'new_comment')),
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, group_id, type)
);

-- RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own settings" ON public.notification_settings;
CREATE POLICY "Users manage own settings" ON public.notification_settings
  FOR ALL USING (profile_id = auth.uid());
