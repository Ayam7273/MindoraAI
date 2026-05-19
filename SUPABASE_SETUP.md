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

## Run Order

Execute in this sequence to avoid foreign-key errors:

| Step | Query |
|------|-------|
| 1 | Patch `community_posts` columns |
| 2 | `community_likes` table + policies + RPCs |
| 3 | `community_comments` table + policies + RPCs |
| 4 | `community_notifications` table + policies *(optional)* |

---

## Verify

After running, confirm in **Supabase → Table Editor**:

- `community_likes`: columns `id`, `post_id`, `user_id`, `created_at` — RLS enabled
- `community_comments`: columns `id`, `post_id`, `user_id`, `content`, `created_at` — RLS enabled
- **Database → Functions**: four RPCs exist:
  - `increment_post_likes` / `decrement_post_likes`
  - `increment_post_comments` / `decrement_post_comments`
