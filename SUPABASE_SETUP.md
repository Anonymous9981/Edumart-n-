# Supabase Setup (Auth + Roles + RLS)

This repo currently uses custom JWT auth in API routes and Prisma for data access.
You can still host PostgreSQL on Supabase today, then migrate auth gradually.

## 1) Create Supabase project

1. Create a project in Supabase.
2. Copy these values from Project Settings -> API:
   - Project URL
   - anon key (publishable)
   - service_role key
3. Copy Postgres connection strings from Project Settings -> Database.

## 2) Set environment variables

In `apps/web/.env.local` add:

```env
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"

# Prisma to Supabase Postgres
# Use direct URL for migrations and pooled URL for runtime where possible.
DATABASE_URL="postgresql://postgres.YOUR_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_REF.supabase.co:5432/postgres"
```

Also keep your existing JWT variables until you fully migrate auth:

```env
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
```

## 3) Apply Prisma schema to Supabase Postgres

From workspace root:

```bash
pnpm install
cd apps/web
pnpm prisma db push
```

If migration uses direct connections only, set `DIRECT_URL` and use `pnpm prisma migrate dev`.

## 4) Enable Supabase roles + RLS

Run the SQL file in Supabase SQL Editor:

- `supabase/rls.sql`

This creates:
- `public.user_profiles`
- role enum (`customer`, `vendor`, `admin`)
- signup trigger from `auth.users`
- RLS policies for profile access

## 5) Important architecture note (must read)

Current Prisma `User.id` is a CUID string, while Supabase `auth.users.id` is UUID.
That means full one-to-one auth replacement requires one of these paths:

1. **Fast path (recommended now):**
   - Keep current JWT login/signup API routes.
   - Use Supabase only as managed PostgreSQL host.
   - Add RLS only on new Supabase-native tables you query through Supabase client.

2. **Full Supabase Auth migration:**
   - Add identity mapping table (`auth_user_id UUID` <-> `app_user_id TEXT`) or migrate `User.id` to UUID.
   - Refactor API auth routes to use Supabase session tokens.
   - Update middleware/authorization to trust Supabase session instead of custom JWT cookies.

## 6) How to test login + role + RLS quickly

1. In Supabase dashboard, disable email confirmation temporarily for testing.
2. Sign up a user via your app or Supabase auth UI.
3. Confirm a `public.user_profiles` row is created.
4. Promote one user to admin:

```sql
update public.user_profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

5. In Supabase SQL editor, test policies with authenticated user context (or through app queries).

## 7) Keep secrets out of git

- Never commit `.env.local`.
- If you need CI/CD secrets, store them in GitHub Actions secrets.
