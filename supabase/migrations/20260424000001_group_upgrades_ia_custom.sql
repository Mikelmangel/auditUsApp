CREATE TABLE IF NOT EXISTS group_upgrades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE UNIQUE,
  ia_custom_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE group_upgrades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own group upgrades" ON group_upgrades;
CREATE POLICY "Users can view own group upgrades"
  ON group_upgrades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_upgrades.group_id
      AND group_members.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own group upgrades" ON group_upgrades;
CREATE POLICY "Users can update own group upgrades"
  ON group_upgrades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_upgrades.group_id
      AND group_members.profile_id = auth.uid()
      AND group_members.role IN ('creator', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can insert own group upgrades" ON group_upgrades;
CREATE POLICY "Users can insert own group upgrades"
  ON group_upgrades FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_upgrades.group_id
      AND group_members.profile_id = auth.uid()
      AND group_members.role IN ('creator', 'admin')
    )
  );
