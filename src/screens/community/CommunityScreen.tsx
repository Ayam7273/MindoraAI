import { formatDistanceToNow, format } from "date-fns";
import {
  Bell,
  Heart,
  MessageCircle,
  Pencil,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCommunityPosts, useAddPost } from "@/hooks/useCommunityPosts";
import { useMyLikes, useToggleLike } from "@/hooks/useCommunityLikes";
import { usePostComments, useAddComment } from "@/hooks/useCommunityComments";
import { useCommunityStore } from "@/store/communityStore";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import type { CommunityPostRow } from "@/types/database";

const CATS = ["Self Care", "Mindfulness", "Stories", "Support", "Stress", "Affirmation"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Self Care": "bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]",
  Mindfulness: "bg-[#e8f4fd] text-blue-600",
  Stories: "bg-[var(--color-accent-orange-light)] text-[var(--color-accent-orange)]",
  Support: "bg-[#ede8f5] text-purple-600",
  Stress: "bg-red-50 text-red-600",
  Affirmation: "bg-[var(--color-accent-yellow)]/20 text-amber-700",
  Default: "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]",
};

function avatarColor(seed: string): string {
  const colors = ["bg-[#7B6EC8]", "bg-[#E07A3A]", "bg-[#5BAD6F]", "bg-[#4a90d9]", "bg-[#d97b6c]", "bg-[#8B7355]"];
  const idx = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
}

function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

// ── Compose sheet ──────────────────────────────────────────────────────────────
function ComposeSheet({
  open,
  onClose,
  userId,
  displayName,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  displayName: string;
  onPosted: () => void;
}) {
  const [body, setBody] = useState("");
  const [cat, setCat] = useState<string>("Mindfulness");
  const addPost = useAddPost();
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => textRef.current?.focus(), 80);
    else setBody("");
  }, [open]);

  if (!open) return null;

  const handlePost = async () => {
    if (!body.trim()) return;
    await addPost.mutateAsync({
      user_id: userId,
      content: body.trim(),
      category: cat,
      post_type: "regular",
      tags: [],
      is_hidden: false,
    });
    setBody("");
    onPosted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div
        className="absolute inset-0"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative mt-auto w-full rounded-t-3xl bg-[#FAF8F4] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--color-border)]" />

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-primary)]">New post</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Author row */}
        <div className="mb-3 flex items-center gap-2">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", avatarColor(userId))}>
            {initials(displayName)}
          </div>
          <span className="text-sm font-semibold text-[var(--color-primary)]">{displayName}</span>
        </div>

        {/* Text area */}
        <textarea
          ref={textRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind? Share openly and kindly…"
          rows={4}
          maxLength={500}
          className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
        />
        <p className="mt-1 text-right text-[10px] text-[var(--color-text-muted)]">{body.length}/500</p>

        {/* Category chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors",
                cat === c
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={!body.trim() || addPost.isPending}
          onClick={() => void handlePost()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {addPost.isPending ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}

// ── Comments section ────────────────────────────────────────────────────────────
function CommentsSection({
  post,
  userId,
  displayName,
}: {
  post: CommunityPostRow;
  userId: string;
  displayName: string;
}) {
  const { data: comments = [] } = usePostComments(post.id);
  const addComment = useAddComment();
  const [text, setText] = useState("");
  const addNotif = useCommunityStore((s) => s.addNotification);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const preview = text.trim().slice(0, 60);
    await addComment.mutateAsync({ post_id: post.id, user_id: userId, content: text.trim() });
    setText("");
    // Notify the post owner if different from commenter
    if (post.user_id !== userId) {
      addNotif({
        id: crypto.randomUUID(),
        type: "comment",
        postId: post.id,
        postSnippet: post.content.slice(0, 60),
        actorName: displayName,
        commentPreview: preview,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  };

  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pt-3 pb-4">
      {/* Existing comments */}
      {comments.length > 0 && (
        <ul className="mb-3 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2">
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", avatarColor(c.user_id))}>
                {initials(c.user_id.slice(0, 2))}
              </div>
              <div className="min-w-0 flex-1 rounded-2xl rounded-tl-none bg-[var(--color-bg-secondary)] px-3 py-2">
                <p className="text-xs font-semibold text-[var(--color-primary)]">
                  {c.user_id === userId ? displayName : "Community member"}
                </p>
                <p className="mt-0.5 break-words text-sm text-[var(--color-text-primary)]">{c.content}</p>
                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  {format(new Date(c.created_at), "MMM d, h:mm a")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Compose comment */}
      <div className="flex items-end gap-2">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", avatarColor(userId))}>
          {initials(displayName)}
        </div>
        <div className="flex min-w-0 flex-1 items-end gap-2 rounded-2xl rounded-bl-none border border-[var(--color-border)] bg-white px-3 py-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a kind reply…"
            rows={1}
            className="min-h-[1.5rem] w-full resize-none bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
          />
          <button
            type="button"
            disabled={!text.trim() || addComment.isPending}
            onClick={() => void handleSubmit()}
            className="shrink-0 rounded-full p-1.5 text-[var(--color-primary)] disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Post card ───────────────────────────────────────────────────────────────────
function PostCard({
  post,
  userId,
  displayName,
  likedSet,
  onLike,
}: {
  post: CommunityPostRow;
  userId: string;
  displayName: string;
  likedSet: Set<string>;
  onLike: (post: CommunityPostRow) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const liked = likedSet.has(post.id);
  const catColor = CATEGORY_COLORS[post.category ?? ""] ?? CATEGORY_COLORS.Default;
  const isOwn = post.user_id === userId;

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", avatarColor(post.user_id))}>
          {isOwn ? initials(displayName) : initials(post.user_id.slice(0, 4))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--color-primary)]">
            {isOwn ? displayName : "Community member"}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {timeAgo(post.created_at)} · {format(new Date(post.created_at), "MMM d, yyyy h:mm a")}
          </p>
        </div>
        {post.category ? (
          <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold", catColor)}>
            {post.category}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-6 border-t border-[var(--color-border)] px-4 py-2">
        {/* Like */}
        <button
          type="button"
          onClick={() => onLike(post)}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors",
            liked ? "text-red-500" : "text-[var(--color-text-muted)] hover:text-red-400",
          )}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart
            className={cn("h-5 w-5 transition-all", liked && "fill-red-500")}
            strokeWidth={liked ? 0 : 1.75}
          />
          <span>{(post.likes_count ?? 0) + (liked ? 1 : 0)}</span>
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
          aria-label="Comments"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          <span>{post.comments_count ?? 0}</span>
        </button>
      </div>

      {/* Comments section — toggle */}
      {showComments && (
        <CommentsSection post={post} userId={userId} displayName={displayName} />
      )}
    </article>
  );
}

// ── Main screen ─────────────────────────────────────────────────────────────────
export function CommunityScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id) ?? "";
  const displayName = useUiStore((s) => s.profile?.full_name ?? "Community member");
  const { data: posts = [], isLoading } = useCommunityPosts();
  const { data: myLikes = [] } = useMyLikes(userId);
  const toggleLike = useToggleLike();
  const addNotif = useCommunityStore((s) => s.addNotification);
  const likedSetFromDb = new Set(myLikes.map((l) => l.post_id));
  const localLiked = useCommunityStore((s) => s.likedPostIds);
  const storeToggle = useCommunityStore((s) => s.toggleLike);
  const unread = useCommunityStore((s) => s.unreadCount());
  const [composeOpen, setComposeOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Merge DB likes with local optimistic likes
  const likedSet = new Set([...likedSetFromDb, ...localLiked]);

  const filters = ["All", ...CATS];
  const filtered =
    activeFilter === "All"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  const handleLike = (post: CommunityPostRow) => {
    const wasLiked = likedSet.has(post.id);
    storeToggle(post.id);
    toggleLike.mutate({ postId: post.id, userId, liked: wasLiked });
    if (!wasLiked && post.user_id !== userId) {
      addNotif({
        id: crypto.randomUUID(),
        type: "like",
        postId: post.id,
        postSnippet: post.content.slice(0, 60),
        actorName: displayName,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }
  };

  return (
    <div className="relative min-h-dvh bg-[#FAF8F4]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#3B2A1A] px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-3 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", avatarColor(userId))}>
              {initials(displayName)}
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Community</p>
              <p className="text-[10px] text-white/60">Mindora AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/search")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Search"
            >
              <Search className="h-4 w-4" strokeWidth={2} />
            </button>
            <Link
              to="/community/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                activeFilter === f
                  ? "bg-white text-[#3B2A1A]"
                  : "bg-white/15 text-white/80 hover:bg-white/25",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Feed */}
      <div className="space-y-3 px-3 py-3 pb-32 sm:px-4 lg:mx-auto lg:max-w-2xl lg:px-0 lg:py-6">
        {isLoading && (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent-green)]" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading community…</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
            <MessageCircle className="h-10 w-10 text-[var(--color-border)]" strokeWidth={1.25} />
            <p className="font-semibold text-[var(--color-primary)]">No posts yet</p>
            <p className="max-w-[22rem] text-sm text-[var(--color-text-muted)]">
              Be the first to share — tap the pen icon to create a post.
            </p>
          </div>
        )}

        {filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            userId={userId}
            displayName={displayName}
            likedSet={likedSet}
            onLike={handleLike}
          />
        ))}
      </div>

      {/* Compose FAB */}
      <button
        type="button"
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px)+12px)] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_24px_rgba(59,42,26,0.45)] transition-transform active:scale-95 lg:bottom-8 lg:right-8"
        aria-label="Create post"
      >
        <Pencil className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Compose sheet */}
      <ComposeSheet
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        userId={userId}
        displayName={displayName}
        onPosted={() => {}}
      />
    </div>
  );
}
