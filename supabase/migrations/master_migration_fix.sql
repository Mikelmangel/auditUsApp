-- =========================================================================
-- MASTER FIX - EJECUTAR ESTO DIRECTAMENTE EN EL SQL EDITOR DE SUPABASE
-- =========================================================================

-- 0. CONFIRMACIÓN: REHACER BBDD (LIMPIEZA TOTAL)
TRUNCATE public.questions CASCADE;
TRUNCATE public.polls CASCADE;
TRUNCATE public.votes CASCADE;

-- 1. Asegurarnos que los tipos existen de forma segura
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_category') THEN
        CREATE TYPE question_category AS ENUM ('humor', 'habilidades', 'futuro', 'atrevidas', 'hipoteticas', 'vinculos', 'eventos', 'ia_custom');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_mode') THEN
        CREATE TYPE question_mode AS ENUM ('vs', 'poll', 'mc', 'scale', 'free', 'ranking');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Limpiar constraints de texto para evitar problemas con los enums
DO $$
DECLARE
    constraint_name_item record;
BEGIN
    FOR constraint_name_item IN 
        SELECT conname FROM pg_constraint 
        WHERE conrelid = 'public.questions'::regclass AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS ' || constraint_name_item.conname;
    END LOOP;

    FOR constraint_name_item IN 
        SELECT conname FROM pg_constraint 
        WHERE conrelid = 'public.polls'::regclass AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS ' || constraint_name_item.conname;
    END LOOP;
END
$$;

-- 3. Convertir target_id a TEXT
ALTER TABLE public.votes 
  ALTER COLUMN target_id DROP DEFAULT,
  ALTER COLUMN target_id TYPE TEXT USING target_id::text;

-- Asegurar políticas rls seguras para insertar sin problemas
DROP POLICY IF EXISTS "votes_insert_safe" ON public.votes;
CREATE POLICY "votes_insert_safe" ON public.votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "polls_select_safe" ON public.polls;
CREATE POLICY "polls_select_safe" ON public.polls FOR SELECT USING (true);

-- Renombrar poll_type a mode si existe
DO $$ 
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name='questions' AND column_name='poll_type') THEN
      EXECUTE 'ALTER TABLE public.questions RENAME COLUMN poll_type TO mode';
  END IF;
END $$;

-- Aplicar tipos correctos
ALTER TABLE public.questions
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN category TYPE question_category USING category::question_category,
  ALTER COLUMN category SET DEFAULT 'humor'::question_category;

ALTER TABLE public.questions
  ALTER COLUMN mode DROP DEFAULT,
  ALTER COLUMN mode TYPE question_mode USING mode::question_mode,
  ALTER COLUMN mode SET DEFAULT 'poll'::question_mode;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS options text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS min_members int DEFAULT 2,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

ALTER TABLE public.polls
  ADD COLUMN IF NOT EXISTS question_mode text DEFAULT 'poll',
  ADD COLUMN IF NOT EXISTS question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS phase text DEFAULT 'answering', 
  ADD COLUMN IF NOT EXISTS vs_member_a uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS vs_member_b uuid REFERENCES public.profiles(id);

