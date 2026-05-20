import { format, formatDistanceToNow } from "date-fns";
import { Bell, ChevronLeft, Heart, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCommunityNotifications,
  useMarkAllNotificationsRead,
} from "@/hooks/useCommunityNotifications";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function CommunityNotificationsScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id) ?? "";
  const { data: notifications = [], isLoading } = useCommunityNotifications(userId);
  const markAllRead = useMarkAllNotificationsRead();

  // Mark all read after 800ms so the unread count badge clears
  useEffect(() => {
    if (!userId) return;
    const timer = setTimeout(() => markAllRead.mutate(userId), 800);
    return () => clearTimeout(timer);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {isLoading && (
        <div className="flex flex-col gap-2 px-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--color-border)]" />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
            <Bell className="h-8 w-8 text-[var(--color-text-muted)]" strokeWidth={1.25} />
          </div>
          <p className="font-semibold text-[var(--color-primary)]">No notifications yet</p>
          <p className="max-w-xs text-sm text-[var(--color-text-muted)]">
            When someone likes or comments on your post, you'll see it here.
          </p>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <ul className="divide-y divide-[var(--color-border)]">
          {notifications.map((n) => {
            const isLike = n.type === "like";
            const ts = new Date(n.created_at);
            const actorLabel = n.actor_name ?? "Someone";

            return (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-4 transition-colors",
                  !n.read && "bg-[var(--color-accent-green-light)]/40",
                )}
              >
                {/* Type icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isLike ? "bg-red-100 text-red-500" : "bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]",
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
                      ? `${actorLabel} liked your post`
                      : `${actorLabel} commented on your post`}
                  </p>

                  {/* Comment preview */}
                  {!isLike && n.comment_preview && (
                    <p className="mt-1 line-clamp-2 rounded-lg bg-[var(--color-bg-secondary)] px-2 py-1 text-xs text-[var(--color-text-secondary)]">
                      {n.comment_preview}
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
