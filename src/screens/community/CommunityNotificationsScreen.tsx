import { format, formatDistanceToNow } from "date-fns";
import { Bell, ChevronLeft, Heart, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunityStore } from "@/store/communityStore";
import { cn } from "@/lib/utils";

export function CommunityNotificationsScreen() {
  const navigate = useNavigate();
  const notifications = useCommunityStore((s) => s.notifications);
  const markAllRead = useCommunityStore((s) => s.markAllRead);

  // Mark all read when screen opens
  useEffect(() => {
    const timer = setTimeout(markAllRead, 800);
    return () => clearTimeout(timer);
  }, [markAllRead]);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      {/* Header */}
      <header className="flex items-center gap-2 bg-[#3B2A1A] px-2 py-3 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold">Notifications</h1>
        <span className="w-10 shrink-0" />
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
            <Bell className="h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.25} />
          </div>
          <p className="font-semibold text-[var(--color-primary)]">No notifications yet</p>
          <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
            When someone likes or comments on your post, you'll see it here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {notifications.map((n) => {
            const isLike = n.type === "like";
            const ts = new Date(n.createdAt);
            return (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-4 transition-colors",
                  !n.read && "bg-[var(--color-accent-green-light)]/40",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isLike
                      ? "bg-red-100 text-red-500"
                      : "bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]",
                  )}
                >
                  {isLike ? (
                    <Heart className="h-5 w-5 fill-red-400" strokeWidth={0} />
                  ) : (
                    <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-primary)]">
                    {isLike
                      ? `${n.actorName} liked your post`
                      : `${n.actorName} commented on your post`}
                  </p>

                  {/* Post snippet */}
                  <p className="mt-0.5 line-clamp-1 text-xs text-[var(--color-text-muted)]">
                    "{n.postSnippet}{n.postSnippet.length === 60 ? "…" : ""}"
                  </p>

                  {/* Comment preview */}
                  {!isLike && n.commentPreview && (
                    <p className="mt-1 line-clamp-2 rounded-lg bg-[var(--color-bg-secondary)] px-2 py-1 text-xs text-[var(--color-text-secondary)]">
                      {n.commentPreview}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p className="mt-1.5 text-[10px] text-[var(--color-text-muted)]">
                    {formatDistanceToNow(ts, { addSuffix: true })}
                    {" · "}
                    {format(ts, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent-green)]" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
