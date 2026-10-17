-- portfolio-projects is a public-delivery bucket. Public object URLs are
-- intentional for the portfolio homepage; do not store private files here.
-- Uploads use the server-only service-role client after adminRequired().
-- The service role bypasses RLS, so browser roles need no write access.
-- This restrictive policy blocks anon/authenticated list, upload, update,
-- and delete requests for this bucket, even if a broader permissive policy
-- exists elsewhere. Public URL downloads from this public bucket still work.
drop policy if exists "portfolio-projects server-only access" on storage.objects;
create policy "portfolio-projects server-only access"
  on storage.objects as restrictive
  for all to anon, authenticated
  using (bucket_id <> 'portfolio-projects')
  with check (bucket_id <> 'portfolio-projects');

-- Verify the bucket-specific policy after running this file:
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname = 'portfolio-projects server-only access';
