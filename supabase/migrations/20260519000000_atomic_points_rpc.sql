-- Race-safe atomic point and streak updates via RPC functions
-- This replaces the read-then-write pattern in services.ts with atomic operations

-- 1. Atomic point addition (used for prediction rewards, battle royale, etc.)
CREATE OR REPLACE FUNCTION add_points(p_user_id UUID, p_amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles 
  SET points = COALESCE(points, 0) + p_amount
  WHERE id = p_user_id;
END;
$$;

-- 2. Atomic group point addition
CREATE OR REPLACE FUNCTION add_group_points(p_user_id UUID, p_group_id UUID, p_amount INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE group_members
  SET group_points = COALESCE(group_points, 0) + p_amount
  WHERE profile_id = p_user_id AND group_id = p_group_id;
END;
$$;

-- 3. Atomic streak + points update (all in one transaction)
CREATE OR REPLACE FUNCTION update_streak_and_points(p_user_id UUID, p_points INT DEFAULT 10)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_voted DATE;
  v_current_streak INT;
  v_today DATE := CURRENT_DATE;
  v_diff INT;
  v_new_streak INT;
BEGIN
  SELECT 
    (last_voted_at AT TIME ZONE 'UTC')::DATE,
    COALESCE(current_streak, 0)
  INTO v_last_voted, v_current_streak
  FROM profiles 
  WHERE id = p_user_id;

  IF v_last_voted IS NULL THEN
    v_new_streak := 1;
  ELSE
    v_diff := v_today - v_last_voted;
    IF v_diff = 1 THEN
      v_new_streak := v_current_streak + 1;
    ELSIF v_diff > 1 THEN
      v_new_streak := 1;
    ELSE
      -- Same day, keep streak, still add points
      v_new_streak := v_current_streak;
    END IF;
  END IF;

  UPDATE profiles SET
    current_streak = v_new_streak,
    last_voted_at = NOW(),
    points = COALESCE(points, 0) + p_points
  WHERE id = p_user_id;
END;
$$;
