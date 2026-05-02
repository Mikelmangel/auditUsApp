-- 20260502125149_profiles_app_language.sql
-- Añade columna app_language a profiles para almacenar el idioma preferido del usuario.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS app_language TEXT DEFAULT 'es';
