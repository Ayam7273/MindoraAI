# Supabase Setup (Mindora)

This project uses **Supabase Auth** + **Supabase Postgres** for persistence, with **React Query** for server state and a small Zustand `uiStore` for ephemeral UI state (no localStorage persistence).

## 1) Create a Supabase project

- Create a project in the Supabase dashboard.
- Wait until the database is ready.

## 2) Get your Supabase URL + anon key

In Supabase dashboard:
- **Project Settings → API**
  - Copy **Project URL** → `VITE_SUPABASE_URL`
  - Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 3) Configure local environment variables

In your repo root, set these in `.env` (or `.env.local`):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Notes:
- These are read by Vite via `import.meta.env`.
- Restart `npm run dev` after changing env vars.

## 4) Run the database schema + RLS policies

This repo includes the migration SQL:
- `supabase/migrations/001_initial_schema.sql`

In Supabase dashboard:
- **SQL Editor → New query**
- Paste the contents of `supabase/migrations/001_initial_schema.sql`
- Run it.

### Verify tables exist

In Supabase dashboard:
- **Database → Tables**
- Confirm you see tables like:
  - `profiles`
  - `mood_entries`
  - `journal_entries`
  - `stress_entries`
  - `sleep_entries`
  - `sleep_schedules`
  - `mindful_sessions`
  - `chatbot_conversations`
  - `chatbot_messages`
  - `mindora_score_history`
  - `community_posts`
  - `assessment_responses`

### Verify RLS is enabled

In Supabase dashboard:
- **Database → Tables → (pick a table) → RLS**
- Ensure **RLS is enabled** on all tables (the migration does this).

## 5) Configure Auth

Open Supabase dashboard:
- **Authentication → Providers**

### Email/password

- Enable **Email** provider (default).
- Decide whether **Confirm email** is required:
  - If enabled, users must confirm via email before they can sign in.

### Google OAuth

If you want the “Continue with Google” button to work:
- Enable **Google** provider
- Add your Google **Client ID** and **Client Secret**

#### Redirect URLs (important)

Set these in Supabase:
- **Authentication → URL Configuration**
  - **Site URL**:
    - Local dev (Vite default): `http://localhost:5173`
    - If you changed ports, use your actual dev URL.
  - **Redirect URLs** (add both):
    - `http://localhost:5173`
    - `http://localhost:5173/#/` (HashRouter support)

If you deploy later, add your production domain(s) too.

## 6) Confirm the app is wired to Supabase

Key files:
- **Client**: `src/lib/supabase.ts`
- **Auth**: `src/services/authService.ts`
- **Session + profile sync**: `src/providers/AuthProvider.tsx`
- **UI store (no persistence)**: `src/store/uiStore.ts`
- **Data hooks (React Query)**: `src/hooks/*`

Expected behavior:
- Visiting protected routes without a session redirects to `/signin`.
- After signing in, `AuthProvider` syncs:
  - `session` + `user` (from Supabase auth)
  - `profile` (from `public.profiles`)
- The migration includes a trigger that **auto-creates `public.profiles`** when a user is created in `auth.users`.

## 7) Quick local test checklist

1. Run the app:

```bash
npm run dev
```

2. Open the app and:
- Go to **Sign Up** and create a user
- Then **Sign In**
- Complete **Assessment** and **Profile Setup**
- Toggle **Dark Mode** in Profile (should update `profiles.dark_mode`)

## 8) Common issues & fixes

### “Invalid API key” / “Failed to fetch”
- Ensure `.env` values are correct.
- Restart `npm run dev`.
- Make sure the Supabase project is not paused.

### Google sign-in opens but doesn’t return to the app
- Add correct **Redirect URLs** in Supabase Auth settings:
  - `http://localhost:5173`
  - `http://localhost:5173/#/`

### Profile is null after login
- Confirm you ran `supabase/migrations/001_initial_schema.sql`.
- Confirm the `handle_new_user` trigger exists.
- In Supabase, check **Authentication → Users**: user exists
- In **Database → Table Editor → profiles**: a row exists with the same UUID.

### Permission/RLS errors when inserting/selecting
- Confirm **RLS policies** were created (migration section “RLS Policies”).
- Confirm you are logged in (no session → `auth.uid()` is null → RLS blocks access).

## 9) Optional (recommended): don’t commit secrets

Keep `.env` out of git commits. If you need, create `.env.example` with placeholders instead.

