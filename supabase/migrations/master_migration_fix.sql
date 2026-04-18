-- =========================================================================
-- MASTER FIX - EJECUTAR ESTO DIRECTAMENTE EN EL SQL EDITOR DE SUPABASE
-- =========================================================================

-- 1. Asegurarnos que los tipos existen de forma segura
DO $$ BEGIN
    CREATE TYPE question_category AS ENUM ('humor', 'habilidades', 'futuro', 'atrevidas', 'hipoteticas', 'vinculos', 'eventos', 'ia_custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_mode AS ENUM ('vs', 'poll', 'mc', 'scale', 'free', 'ranking');
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

-- 3. ESTO ES LO QUE ESTABA ROMPIENDO LOS VOTOS EN LIVE:
-- Convertir target_id a TEXT en lugar de UUID para permitir respuestas como 'Hola' o '5'
ALTER TABLE public.votes 
  ALTER COLUMN target_id DROP DEFAULT,
  ALTER COLUMN target_id TYPE TEXT USING target_id::text;

-- Asegurar políticas rls seguras para insertar sin problemas
DROP POLICY IF EXISTS "votes_insert_safe" ON public.votes;
CREATE POLICY "votes_insert_safe" ON public.votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "polls_select_safe" ON public.polls;
CREATE POLICY "polls_select_safe" ON public.polls FOR SELECT USING (true);

-- 4. Adaptar preguntas y polls
ALTER TABLE public.questions RENAME COLUMN poll_type TO mode;

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
  ADD COLUMN IF NOT EXISTS max_members int DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

ALTER TABLE public.polls
  ADD COLUMN IF NOT EXISTS question_mode text DEFAULT 'poll';

ALTER TABLE public.polls
  ADD COLUMN IF NOT EXISTS question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL;
