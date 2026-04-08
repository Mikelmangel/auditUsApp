-- =====================================================
-- MIGRACIÓN COMPLETA AUDITUS v2
-- Añade: questions, comments, push_tokens, group_poll_history
-- Mejora: profiles, groups, group_members, polls
-- =====================================================

-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. MEJORAS A PROFILES
-- =====================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_voted_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- 2. MEJORAS A GROUPS
-- =====================================================
ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS avatar_emoji TEXT DEFAULT '🔮',
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0;

-- =====================================================
-- 3. MEJORAS A GROUP_MEMBERS
-- =====================================================
ALTER TABLE public.group_members
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- 4. SISTEMA DE PREGUNTAS (BANCO ESCALABLE)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Texto con placeholders: {member_A}, {member_B}, {group_name}, {member_count}
  text TEXT NOT NULL,
  -- Tipo de poll que genera
  poll_type TEXT DEFAULT 'pool' CHECK (poll_type IN (
    'pool',     -- Vota por cualquier miembro del grupo
    'vs',       -- Enfrenta solo a {member_A} vs {member_B}
    'boolean',  -- Sí/No sobre el grupo
    'ranked'    -- Ordena a todos los miembros
  )),
  -- Categoría temática para filtrar/escalar
  category TEXT DEFAULT 'general' CHECK (category IN (
    'general', 'humor', 'romance', 'skills', 'survival', 'money',
    'social', 'adventure', 'deep', 'vs_challenge', 'group_dynamics'
  )),
  language TEXT DEFAULT 'es',
  -- Para preguntas VS: texto alternativo para la opción contraria
  vs_option_b_text TEXT,
  is_active BOOLEAN DEFAULT true,
  -- Para preguntas que usan {member_A}/{member_B}, requieren ≥N miembros
  min_members INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. HISTORIAL DE PREGUNTAS POR GRUPO (anti-repetición)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.group_poll_history (
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (group_id, question_id)
);

-- =====================================================
-- 6. MEJORAS A POLLS (enlazar con question)
-- =====================================================
ALTER TABLE public.polls
  ADD COLUMN IF NOT EXISTS question_id UUID REFERENCES public.questions(id),
  ADD COLUMN IF NOT EXISTS poll_type TEXT DEFAULT 'pool' CHECK (poll_type IN ('pool', 'vs', 'boolean', 'ranked')),
  -- Para polls VS, guardar los IDs de los dos miembros enfrentados
  ADD COLUMN IF NOT EXISTS vs_member_a UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS vs_member_b UUID REFERENCES public.profiles(id),
  -- El texto renderizado (con placeholders sustituidos)
  ADD COLUMN IF NOT EXISTS rendered_question TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours');

-- =====================================================
-- 7. COMENTARIOS POST-VOTO
-- =====================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (LENGTH(content) BETWEEN 1 AND 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. PUSH NOTIFICATION TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- =====================================================
-- 9. BADGES (si no existen ya)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profile_badges (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (profile_id, badge_id)
);

-- =====================================================
-- 10. RLS POLICIES (nuevas tablas)
-- =====================================================
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_poll_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_badges ENABLE ROW LEVEL SECURITY;

-- Questions: todos pueden leer
DROP POLICY IF EXISTS "Questions viewable by all" ON public.questions;
CREATE POLICY "Questions viewable by all" ON public.questions
  FOR SELECT USING (true);

-- Group poll history: solo miembros del grupo
DROP POLICY IF EXISTS "Group poll history by members" ON public.group_poll_history;
CREATE POLICY "Group poll history by members" ON public.group_poll_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = public.group_poll_history.group_id AND profile_id = auth.uid())
  );

-- Comments: miembros del grupo pueden leer y escribir
DROP POLICY IF EXISTS "Comments viewable by group members" ON public.comments;
CREATE POLICY "Comments viewable by group members" ON public.comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.group_members gm ON gm.group_id = p.group_id
      WHERE p.id = public.comments.poll_id AND gm.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can insert comments" ON public.comments;
CREATE POLICY "Members can insert comments" ON public.comments
  FOR INSERT WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.group_members gm ON gm.group_id = p.group_id
      WHERE p.id = poll_id AND gm.profile_id = auth.uid()
    )
  );

-- Push tokens: each user manages their own
DROP POLICY IF EXISTS "Users manage own push tokens" ON public.push_tokens;
CREATE POLICY "Users manage own push tokens" ON public.push_tokens
  FOR ALL USING (user_id = auth.uid());

-- Badges
DROP POLICY IF EXISTS "Badges viewable by all" ON public.badges;
CREATE POLICY "Badges viewable by all" ON public.badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profile badges viewable by all" ON public.profile_badges;
CREATE POLICY "Profile badges viewable by all" ON public.profile_badges FOR SELECT USING (true);

-- Policies para INSERT en groups y group_members
DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.groups;
CREATE POLICY "Authenticated users can create groups" ON public.groups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Members can join groups" ON public.group_members;
CREATE POLICY "Members can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 11. FUNCIÓN: incrementar member_count automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_member_count ON public.group_members;
CREATE TRIGGER trigger_update_member_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.update_group_member_count();

-- =====================================================
-- 12. FUNCIÓN: auto-crear perfil tras signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

