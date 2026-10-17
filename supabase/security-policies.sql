-- Apply this in the Supabase SQL editor after confirming table columns.
-- Public portfolio reads and anonymous contact submissions only.
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;

-- Public visitors read project and skill content through the anon client.
-- All writes go through server API routes that check the admin claim and use
-- the server-only service role. Remove any inherited/default table grants so
-- an older permissive policy cannot allow browser writes.
revoke all privileges on table public.projects from public, anon, authenticated;
revoke all privileges on table public.skills from public, anon, authenticated;
revoke all privileges on table public.messages from public, anon, authenticated;
grant select on table public.projects, public.skills to anon, authenticated;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects for select to anon, authenticated using (true);
drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills" on public.skills for select to anon, authenticated using (true);

-- Supabase Auth administrator identity is stored in app_metadata, which users
-- cannot change themselves. Server API handlers also validate this claim.
drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins manage skills" on public.skills;
create policy "Admins manage skills" on public.skills for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages" on public.messages for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admin writes use the server-only service role key in guarded API handlers.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to a client or NEXT_PUBLIC variable.
-- Message submissions also pass through the server, so no public messages write
-- policy is needed. No public/authenticated select/update/delete policy exists.
-- Public roles have no project or skill write policies.
-- Verify browser table privileges after applying this file. Expected: only
-- SELECT on projects/skills; no privileges on messages for anon/authenticated.
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('projects', 'skills', 'messages')
  and grantee in ('PUBLIC', 'anon', 'authenticated')
order by table_name, grantee, privilege_type;
