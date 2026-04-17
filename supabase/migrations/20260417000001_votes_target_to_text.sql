-- =====================================================
-- 20260417000001_votes_target_to_text.sql
-- Migra la columna target_id de UUID a TEXT para soportar
-- votos en escalas (1-10), respuesta múltiple (M/C), etc.
-- =====================================================

DO $$
DECLARE
    constraint_name_item record;
BEGIN
    -- Eliminar las foreign keys que dependan de target_id hacia profiles
    FOR constraint_name_item IN 
        SELECT conname FROM pg_constraint 
        WHERE conrelid = 'public.votes'::regclass 
        AND contype = 'f' 
        AND conkey[1] = (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.votes'::regclass AND attname = 'target_id')
    LOOP
        EXECUTE 'ALTER TABLE public.votes DROP CONSTRAINT ' || constraint_name_item.conname;
    END LOOP;
END
$$;

-- Alteramos el tipo de dato con CAST explícito
ALTER TABLE public.votes
  ALTER COLUMN target_id TYPE text USING target_id::text;
