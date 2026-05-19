-- Ensure trigger function exists and handles both INSERT and DELETE
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

-- Backfill correct counts for all existing groups
UPDATE public.groups g
SET member_count = (
  SELECT COUNT(*)
  FROM public.group_members gm
  WHERE gm.group_id = g.id
    AND gm.status = 'active'
);
