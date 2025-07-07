-- SQL setup for Supabase RLS
-- function to check membership without recursion
CREATE OR REPLACE FUNCTION public.is_member(p_team_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members tm
    WHERE tm.team_id = p_team_id
      AND tm.user_id = auth.uid()
  );
$$;

-- policy using the function
DROP POLICY IF EXISTS "Team members can read" ON team_members;
CREATE POLICY "Team members can read"
  ON team_members
  FOR SELECT
  USING (public.is_member(team_id));

-- ensure the same check for teams table
DROP POLICY IF EXISTS "Team members can select" ON teams;
CREATE POLICY "Team members can select"
  ON teams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.team_members tm
      WHERE tm.team_id = id
        AND tm.user_id = auth.uid()
    )
  );
