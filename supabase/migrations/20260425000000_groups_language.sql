-- 20260425000000_groups_language.sql
-- Añade columna language a groups para soporte multilingüe

ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es';
