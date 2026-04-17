-- =====================================================
-- 20260417000000_questions_overhaul.sql
-- Implementación del nuevo sistema de categorías y modos
-- =====================================================

-- 1. Crear ENUMs
CREATE TYPE question_category AS ENUM (
  'humor',        -- 😂
  'habilidades',  -- 💪
  'futuro',       -- 🔮
  'atrevidas',    -- 🌶️
  'hipoteticas',  -- 🧠
  'vinculos',     -- 💛
  'eventos',      -- 🎉
  'ia_custom'     -- 🤖
);

CREATE TYPE question_mode AS ENUM (
  'vs',       -- ⚔️  1 vs 1
  'poll',     -- 🗳️  todos votan a alguien
  'mc',       -- 🔢  multiple choice (respuestas fijas)
  'scale',    -- 🎚️  escala 1-10
  'free',     -- ✍️  respuesta libre + adivinanza
  'ranking'   -- 🏅  ordena a todo el grupo
);

-- 2. Eliminar viejos constraints de texto en la tabla questions (hacemos un fallback para evitar errores de nombre)
DO $$
DECLARE
    constraint_name_item record;
BEGIN
    FOR constraint_name_item IN 
        SELECT conname FROM pg_constraint 
        WHERE conrelid = 'public.questions'::regclass AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.questions DROP CONSTRAINT ' || constraint_name_item.conname;
    END LOOP;
END
$$;

-- 3. Modificar la tabla questions
-- Mapeo seguro de valores antiguos:
-- pool -> poll, boolean -> poll (por ahora), ranked -> ranking
UPDATE public.questions SET poll_type = 'poll' WHERE poll_type = 'pool' OR poll_type = 'boolean';
UPDATE public.questions SET poll_type = 'ranking' WHERE poll_type = 'ranked';
UPDATE public.questions SET poll_type = 'poll' WHERE poll_type NOT IN ('vs', 'poll', 'mc', 'scale', 'free', 'ranking');

-- Mapeo seguro de categorías antiguas
UPDATE public.questions SET category = 'humor' WHERE category = 'general' OR category = 'romance' OR category = 'skills' OR category = 'survival' OR category = 'money' OR category = 'social' OR category = 'adventure' OR category = 'deep' OR category = 'vs_challenge' OR category = 'group_dynamics';

ALTER TABLE public.questions
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN category TYPE question_category USING category::question_category,
  ALTER COLUMN category SET DEFAULT 'humor'::question_category;

ALTER TABLE public.questions
  RENAME COLUMN poll_type TO mode;

ALTER TABLE public.questions
  ALTER COLUMN mode DROP DEFAULT,
  ALTER COLUMN mode TYPE question_mode USING mode::question_mode,
  ALTER COLUMN mode SET DEFAULT 'poll'::question_mode;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS options text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_members int DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 4. Modificar tabla polls - el constraint del poll_type también debe arreglarse
DO $$
DECLARE
    constraint_name_item record;
BEGIN
    FOR constraint_name_item IN 
        SELECT conname FROM pg_constraint 
        WHERE conrelid = 'public.polls'::regclass AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.polls DROP CONSTRAINT ' || constraint_name_item.conname;
    END LOOP;
END
$$;

UPDATE public.polls SET poll_type = 'poll' WHERE poll_type = 'pool' OR poll_type = 'boolean';
UPDATE public.polls SET poll_type = 'ranking' WHERE poll_type = 'ranked';
-- we don't converting 'prediction' intentionally yet or we should map it to poll? Let's leave it as text for backward compatibility on polls

ALTER TABLE public.polls
  ADD COLUMN IF NOT EXISTS question_mode text DEFAULT 'poll'; -- we keep poll_type as is, add question_mode

-- 5. Índices de rendimiento
CREATE INDEX IF NOT EXISTS questions_category_mode ON public.questions(category, mode);
CREATE INDEX IF NOT EXISTS questions_min_members ON public.questions(min_members);
CREATE INDEX IF NOT EXISTS questions_is_active ON public.questions(is_active);

-- 6. Matriz de compatibilidad
CREATE TABLE IF NOT EXISTS public.question_mode_compat (
  category   question_category NOT NULL,
  mode       question_mode     NOT NULL,
  fit        smallint          NOT NULL CHECK (fit IN (0, 1, 2)),
  PRIMARY KEY (category, mode)
);

INSERT INTO public.question_mode_compat (category, mode, fit) VALUES
('humor', 'vs', 2), ('humor', 'poll', 2), ('humor', 'mc', 2), ('humor', 'scale', 1), ('humor', 'free', 1), ('humor', 'ranking', 1),
('habilidades', 'vs', 2), ('habilidades', 'poll', 1), ('habilidades', 'mc', 0), ('habilidades', 'scale', 2), ('habilidades', 'free', 0), ('habilidades', 'ranking', 2),
('futuro', 'vs', 2), ('futuro', 'poll', 2), ('futuro', 'mc', 1), ('futuro', 'scale', 1), ('futuro', 'free', 1), ('futuro', 'ranking', 0),
('atrevidas', 'vs', 2), ('atrevidas', 'poll', 0), ('atrevidas', 'mc', 0), ('atrevidas', 'scale', 0), ('atrevidas', 'free', 2), ('atrevidas', 'ranking', 0),
('hipoteticas', 'vs', 2), ('hipoteticas', 'poll', 1), ('hipoteticas', 'mc', 2), ('hipoteticas', 'scale', 0), ('hipoteticas', 'free', 2), ('hipoteticas', 'ranking', 0),
('vinculos', 'vs', 1), ('vinculos', 'poll', 2), ('vinculos', 'mc', 0), ('vinculos', 'scale', 2), ('vinculos', 'free', 2), ('vinculos', 'ranking', 0),
('eventos', 'vs', 2), ('eventos', 'poll', 2), ('eventos', 'mc', 1), ('eventos', 'scale', 0), ('eventos', 'free', 0), ('eventos', 'ranking', 2),
('ia_custom', 'vs', 2), ('ia_custom', 'poll', 2), ('ia_custom', 'mc', 2), ('ia_custom', 'scale', 2), ('ia_custom', 'free', 2), ('ia_custom', 'ranking', 2)
ON CONFLICT (category, mode) DO UPDATE SET fit = EXCLUDED.fit;

-- 7. Trigger para atrevidas -> is_anonymous = true
CREATE OR REPLACE FUNCTION public.force_anonymous_atrevidas()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category = 'atrevidas' THEN
    NEW.is_anonymous = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_force_anon_atrevidas ON public.questions;
CREATE TRIGGER trigger_force_anon_atrevidas
  BEFORE INSERT OR UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.force_anonymous_atrevidas();
