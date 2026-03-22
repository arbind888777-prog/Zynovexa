# Supabase Setup

This repository is already prepared to use Supabase as the main database and auth provider.

What is already done in code:

- Prisma is wired to use `DATABASE_URL` and `DIRECT_URL` from Supabase.
- API auth can exchange a Supabase access token for local API JWTs.
- Web login and signup already use Supabase email/password when keys are present.
- Google login on the web app already prefers Supabase OAuth.
- Uploads can use Supabase Storage when the service role key is configured.
- Queue metadata is saved through Prisma, so queue-related database rows also go to Supabase.

What still needs your values:

- Supabase project URL
- Supabase anon key
- Supabase service role key
- Supabase database password and project ref
- Google OAuth credentials inside Supabase and, if you keep the legacy fallback, inside the API env
- Your own JWT secrets, SMTP, Stripe, and OpenAI keys

## 1. Create or open your Supabase project

In Supabase Dashboard collect these values:

- Project URL: `https://PROJECT_REF.supabase.co`
- Anon key: from Project Settings -> API
- Service role key: from Project Settings -> API
- Database password: the password for the `postgres` user
- Project ref: the `PROJECT_REF` part of the URL

## 2. Fill backend env

Edit `apps/api/.env` and replace placeholders for these keys:

```env
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
DIRECT_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=media
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=generate_a_real_secret_here
JWT_REFRESH_SECRET=generate_a_real_secret_here
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:4000
API_URL=http://localhost:4000
```

Notes:

- `DATABASE_URL` should use port `6543` with `pgbouncer=true`.
- `DIRECT_URL` should use port `5432` for migrations.
- Bull queues still need Redis. Supabase does not replace Redis in the current architecture.

## 3. Fill web env

Edit `apps/web/.env.local` and replace placeholders:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Important:

- `NEXT_PUBLIC_SUPABASE_URL` must match API `SUPABASE_URL`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` must match API `SUPABASE_ANON_KEY`.

## 4. Configure Supabase Auth

In Supabase Dashboard:

1. Go to Authentication -> URL Configuration
2. Set Site URL to your frontend URL
   - Local: `http://localhost:3001`
3. Add these redirect URLs:
   - `http://localhost:3001/auth/confirm`
   - `http://localhost:3001/auth/google/callback`
   - Your production equivalents if deploying

For Google auth:

1. Go to Authentication -> Providers -> Google
2. Enable Google provider
3. Put the Google Client ID and Client Secret there
4. In Google Cloud Console add the callback URL that Supabase shows on that provider page

## 5. Configure Storage

If you want uploads in Supabase Storage:

1. Go to Storage
2. Create bucket named `media`
3. Keep `SUPABASE_STORAGE_BUCKET=media` in `apps/api/.env`

If you skip this, local upload fallback may still work in some paths, but Supabase storage will remain disabled.

## 6. Run verification

After filling the env values run:

```bash
npm run supabase:check
```

If the check passes, continue with:

```bash
npm run db:migrate
npm run dev
```

If you need queues or scheduled jobs locally, also run Redis before starting the API.

## 7. What you must do yourself

I cannot do these parts from inside your editor because they require access to your external accounts or secrets:

1. Create the Supabase project or open your existing one
2. Copy the real Supabase URL, anon key, service role key, and DB password
3. Enable Google provider in Supabase and Google Cloud
4. Create the `media` storage bucket in Supabase
5. Provide your real Redis, SMTP, Stripe, OpenAI, and JWT secret values

## 8. What I already handled in this repo

These parts are already implemented:

1. Supabase-first env structure
2. Prisma direct URL support
3. Supabase auth token exchange endpoint in the API
4. Supabase login and signup flow in the web app
5. Supabase storage integration in uploads
6. Optional local database hiding in Docker and deploy scripts
7. Queue compile fix and queue persistence compatibility with Supabase via Prisma