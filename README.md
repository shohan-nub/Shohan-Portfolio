# Portfolio setup and deployment notes

## Required server environment

Keep these values in `.env.local` for local development and the deployment provider's secret manager in production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the public/anon key only)
- `SUPABASE_SERVICE_ROLE_KEY` (server only; never prefix with `NEXT_PUBLIC_`)

## Supabase security

Review and apply `supabase/security-policies.sql` and `supabase/storage-policies.sql` in the Supabase SQL editor. The storage policy blocks anon/authenticated list and write operations for `portfolio-projects`; the server upload endpoint uses the service role after the admin check, and public object URLs remain readable by design. Also inspect `pg_policies` for old permissive policies. The public app reads projects and skills using the anon key. Contact submissions and protected admin reads/writes run through server code using the service role key, which bypasses RLS. Do not deploy until the service role key is configured and existing policies have been audited.

## Admin panel setup

Local development (`next dev`) uses the same Supabase Auth checks as production. Sign in at `/admin/login` with an administrator account; there is no development bypass for admin pages or API operations.

Open `/admin/login` and sign in with a Supabase Auth email/password account. There is no public signup flow. The account must have `app_metadata.role` set to `admin`; user-editable `user_metadata` is deliberately not accepted. For the initial administrator:

1. Create or invite the account in Supabase Dashboard → Authentication → Users. Choose the email/password provider and use a strong password.
2. In a trusted local terminal, run `node --env-file=.env.local scripts/set-admin-role.mjs` from this project directory. The script finds the existing account and assigns `app_metadata.role = "admin"` using the Auth Admin API. It is idempotent and never creates users. It requires `NEXT_PUBLIC_SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`; it does not print either value or ask for a password.
3. Sign in at `/admin/login`. If the role was changed while the user had an active session, sign out and sign in again to refresh the token.

Never put the service-role credential in browser code or a `NEXT_PUBLIC_` variable. The script is local-only; no admin-creation endpoint is exposed.

The admin pages and protected API operations validate the Supabase Auth user session on the server. Project and skill list endpoints remain public for the portfolio; their create/update/delete operations require an administrator session. All message reads and changes require an administrator session. The validated project upload endpoint is also protected. Apply `supabase/security-policies.sql` in the Supabase SQL editor after confirming table columns and inspect `pg_policies` for old permissive policies (Postgres permissive policies combine with OR). The application still uses its existing server-only service-role repository methods for protected data writes; those requests bypass RLS, so the server session check remains essential.

## Image uploads and contact spam

The admin browser posts images to `POST /api/projects/upload`. The server checks the file type and 5 MB limit, then uploads through the server-only Supabase service-role client to the public `portfolio-projects` bucket under `projects/<uuid>.<extension>`. The response contains a public URL, object path, and short-lived server-verifiable receipt; project create/update accepts new image URLs only when that receipt validates. The bucket is public for portfolio delivery, while uploads and project changes remain behind server-side administrator checks. Apply `supabase/storage-policies.sql` to keep direct anon/authenticated Storage operations blocked. `POST /api/projects/upload-signature` remains a protected `410 Gone` response for older clients.

`POST /api/messages` validates fields, accepts a honeypot field, and currently limits each observed address to five submissions per ten minutes. The limiter uses process memory and is suitable only as a basic single-instance safeguard; configure a shared store or provider-level rate limiting for a multi-instance production deployment, and add a managed challenge such as Turnstile if spam becomes material.

## Verification

Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` from this directory. Keep `SUPABASE_SERVICE_ROLE_KEY` in server-side environment configuration only. The `portfolio-projects` bucket is configured with a 5 MB size limit and JPEG, PNG, WebP, and AVIF content types.
