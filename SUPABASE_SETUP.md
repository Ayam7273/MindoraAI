# Mindora — Supabase Database Setup

Run these queries in the **Supabase SQL Editor** (`Project → SQL Editor → New query`).

---

## Existing Tables (already in your schema)

These are referenced by the app and should already exist:
`profiles`, `mood_entries`, `journal_entries`, `stress_entries`, `sleep_entries`,
`sleep_schedules`, `mindful_sessions`, `chatbot_conversations`, `chatbot_messages`,
`mindora_score_history`, `community_posts`, `assessment_responses`

---

## 1 — Community Posts: add missing columns

If `community_posts` does not yet have `likes_count` or `comments_count`, add them first:

```sql
alter table public.community_posts
  add column if not exists likes_count    integer not null default 0,
  add column if not exists comments_count integer not null default 0;
```

---

## 2 — Community Likes Table

Stores which users have liked which posts (one like per user per post).

```sql
-- Create table
create table if not exists public.community_likes (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.community_posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id)             on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)   -- prevents duplicate likes
);

-- Enable Row-Level Security
alter table public.community_likes enable row level security;

-- Any authenticated user can read likes (needed to check if they already liked)
create policy "Authenticated users can read likes"
  on public.community_likes for select
  using (auth.role() = 'authenticated');

-- Users can only insert their own like
create policy "Users can like posts"
  on public.community_likes for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own like (unlike)
create policy "Users can unlike posts"
  on public.community_likes for delete
  using (auth.uid() = user_id);

-- Indexes for fast lookups
create index if not exists community_likes_post_id_idx on public.community_likes (post_id);
create index if not exists community_likes_user_id_idx on public.community_likes (user_id);

-- RPC: increment likes_count when a like is added
create or replace function public.increment_post_likes(pid uuid)
returns void language sql security definer as $$
  update public.community_posts
  set likes_count = coalesce(likes_count, 0) + 1
  where id = pid;
$$;

-- RPC: decrement likes_count when a like is removed (floors at 0)
create or replace function public.decrement_post_likes(pid uuid)
returns void language sql security definer as $$
  update public.community_posts
  set likes_count = greatest(coalesce(likes_count, 0) - 1, 0)
  where id = pid;
$$;
```

---

## 3 — Community Comments Table

Stores all comments on community posts, ordered oldest-first.

```sql
-- Create table
create table if not exists public.community_comments (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.community_posts(id) on delete cascade,
  user_id    uuid        not null references auth.users(id)             on delete cascade,
  content    text        not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);

-- Enable Row-Level Security
alter table public.community_comments enable row level security;

-- Any authenticated user can read comments
create policy "Authenticated users can read comments"
  on public.community_comments for select
  using (auth.role() = 'authenticated');

-- Users can only insert their own comments
create policy "Users can add comments"
  on public.community_comments for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own comments
create policy "Users can delete own comments"
  on public.community_comments for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists community_comments_post_id_idx on public.community_comments (post_id, created_at asc);
create index if not exists community_comments_user_id_idx on public.community_comments (user_id);

-- RPC: increment comments_count when a comment is added
create or replace function public.increment_post_comments(pid uuid)
returns void language sql security definer as $$
  update public.community_posts
  set comments_count = coalesce(comments_count, 0) + 1
  where id = pid;
$$;

-- RPC: decrement comments_count when a comment is deleted
create or replace function public.decrement_post_comments(pid uuid)
returns void language sql security definer as $$
  update public.community_posts
  set comments_count = greatest(coalesce(comments_count, 0) - 1, 0)
  where id = pid;
$$;
```

---

## 4 — Community Notifications Table (optional — for server-side persistence)

Currently notifications live in the client-side Zustand store (lost on page refresh).
Run this to persist them in Supabase instead:

```sql
create table if not exists public.community_notifications (
  id                uuid        primary key default gen_random_uuid(),
  recipient_user_id uuid        not null references auth.users(id) on delete cascade,
  actor_user_id     uuid        not null references auth.users(id) on delete cascade,
  post_id           uuid        not null references public.community_posts(id) on delete cascade,
  type              text        not null check (type in ('like', 'comment')),
  comment_preview   text,
  read              boolean     not null default false,
  created_at        timestamptz not null default now()
);

alter table public.community_notifications enable row level security;

-- Users read only their own notifications
create policy "Users read own notifications"
  on public.community_notifications for select
  using (auth.uid() = recipient_user_id);

-- Any authenticated user can create a notification for another user
create policy "Authenticated users can create notifications"
  on public.community_notifications for insert
  with check (auth.role() = 'authenticated');

-- Users can mark their own notifications as read
create policy "Users update own notifications"
  on public.community_notifications for update
  using (auth.uid() = recipient_user_id);

create index if not exists community_notifications_recipient_idx
  on public.community_notifications (recipient_user_id, created_at desc);
```

---

---

## 5 — Profile Avatar: Storage Bucket + Policies

User profile pictures are uploaded to **Supabase Storage** in a bucket called `avatars`.
The `profiles.avatar_url` column already exists in your schema.

### Step 1 — Create the storage bucket

In **Supabase → Storage → New bucket**:
- **Name:** `avatars`
- **Public:** ✅ Yes (avatars must be publicly readable for the community feed)
- **File size limit:** 5 MB
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`

Or via SQL:

```sql
-- Create the avatars bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,   -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
```

### Step 2 — Storage RLS policies

```sql
-- Allow any authenticated user to read avatars (bucket is public but add policy for safety)
create policy "Anyone can view avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Users can upload/overwrite only their own avatar (path starts with their user ID)
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update (overwrite) their own avatar
create policy "Users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
create policy "Users can delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Step 3 — Ensure profiles.avatar_url column exists

```sql
alter table public.profiles
  add column if not exists avatar_url text;
```

### How it works in the app

1. User taps "Change photo" on the Personal Information page
2. A file picker opens (JPEG / PNG / WebP, max 5 MB)
3. The image uploads to `avatars/{userId}/avatar.{ext}` with `upsert: true`
4. Supabase returns a **public URL** which is saved to `profiles.avatar_url`
5. The community feed fetches posts with `.select("*, profiles(full_name, avatar_url)")` — so every post card shows the author's real photo automatically

---

## 6 — Chatbot Messages Table

The `chatbot_messages` table should already exist in your schema. If it does not, run the following
to create it and apply the correct RLS policies and index:

```sql
create table if not exists public.chatbot_messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references public.chatbot_conversations(id) on delete cascade,
  role            text        not null check (role in ('user', 'assistant')),
  content         text        not null,
  created_at      timestamptz not null default now()
);

alter table public.chatbot_messages enable row level security;

create policy "Users read own conversation messages"
  on public.chatbot_messages for select
  using (
    conversation_id in (
      select id from public.chatbot_conversations
      where user_id = auth.uid()
    )
  );

create policy "Users insert own conversation messages"
  on public.chatbot_messages for insert
  with check (
    conversation_id in (
      select id from public.chatbot_conversations
      where user_id = auth.uid()
    )
  );

create index if not exists chatbot_messages_conversation_id_idx
  on public.chatbot_messages (conversation_id, created_at asc);
```

> **Note:** The app now reads and writes messages exclusively via this table.
> The old localStorage stubs in `chatStorage.ts` are no-ops and no longer used for message storage.

---

---

## 7 — Profiles: Allow Public Read of Display Name + Avatar

**Why this is needed:** By default Supabase only lets users read their own profile row. The community feed queries other users' profiles to show their display name and avatar. Without this policy, those queries silently return null and the feed shows "Community member" for everyone.

```sql
-- Allow any authenticated user to read the public fields of any profile
-- (id, full_name, avatar_url only — everything else stays private)
create policy "Authenticated users can read public profile fields"
  on public.profiles for select
  using (auth.role() = 'authenticated');
```

> **Scope note:** This allows reading ALL columns of other profiles. If you want to restrict it to only public fields, use a database view instead:
> ```sql
> create view public.community_profiles as
>   select id, full_name, avatar_url from public.profiles;
> grant select on public.community_profiles to authenticated;
> ```

---

## 8 — Community Notifications: Fix Direction + Actor Name

The notifications table already exists (Section 4). These queries fix two bugs:

**Bug A — Wrong direction:** Notifications were being stored client-side in Zustand for the *actor* (liker/commenter) instead of the *post owner*. The app now inserts into Supabase with the correct `recipient_user_id`. No schema change needed — just run the table creation from Section 4 if you haven't already.

**Bug B — Actor name shows as "Someone":** To show the actor's real display name in notifications, store it at insert time:

```sql
-- Add actor_name column to community_notifications (stores the actor's display name at notification time)
alter table public.community_notifications
  add column if not exists actor_name text;
```

The app writes `actor_name` when inserting a notification so it's preserved even if the actor later changes their display name.

---

## Run Order

Execute in this sequence to avoid foreign-key errors:

| Step | Query |
|------|-------|
| 1 | Patch `community_posts` columns |
| 2 | `community_likes` table + policies + RPCs |
| 3 | `community_comments` table + policies + RPCs |
| 4 | `community_notifications` table + policies |
| 5 | Avatars storage bucket + policies |
| 6 | `chatbot_messages` table + RLS + index |
| 7 | Profiles public-read policy **← NEW — fixes "Community member" bug** |
| 8 | `community_notifications.actor_name` column **← NEW — fixes notification direction** |

---

## Verify

After running, confirm in **Supabase**:

- **Table Editor:** `community_likes`, `community_comments`, `community_notifications` — RLS enabled
- **Table Editor → `community_notifications`:** has columns `id`, `recipient_user_id`, `actor_user_id`, `post_id`, `type`, `comment_preview`, `actor_name`, `read`, `created_at`
- **Database → Functions:** `increment_post_likes`, `decrement_post_likes`, `increment_post_comments`, `decrement_post_comments`
- **Storage:** `avatars` bucket exists, is marked **public**
- **Table Editor → `profiles`:** `avatar_url` column exists; **Authentication → Policies → profiles** shows a SELECT policy for `authenticated` role
- **Test:** Log in as two different users. User A posts. User B likes it. Check User A's Notifications page — User A should see the notification, not User B.
