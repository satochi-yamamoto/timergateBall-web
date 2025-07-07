# TimerGateBall Web

This project uses Supabase as its backend. If you encounter `infinite recursion detected in policy` errors when fetching data from `team_members` or `teams`, apply the SQL in `docs/supabase-policies.sql` to reset the RLS policies.

```bash
supabase db query < docs/supabase-policies.sql
```

This defines a `public.is_member` function and policies that avoid self-referential checks.
