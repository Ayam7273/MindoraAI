import type { ReactNode } from "react";
import { ChevronLeft, MessageCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotifItem {
  icon: ReactNode;
  color: string;
  title: string;
  sub: string;
}

const TODAY: NotifItem[] = [
  { icon: <MessageCircle className="h-5 w-5" />, color: "bg-[var(--color-accent-green)]", title: "Alfonso messaged you", sub: "Hey, are you free?" },
  { icon: <MessageCircle className="h-5 w-5" />, color: "bg-[var(--color-accent-orange)]", title: "New comment on your post", sub: "This helped me today." },
  { icon: <span className="text-base font-bold">@</span>, color: "bg-purple-500", title: "You were mentioned", sub: "in a thread about sleep" },
];

const LAST: NotifItem[] = [
  { icon: <Play className="h-5 w-5 fill-current" />, color: "bg-[#8B7355]", title: "New content from Mindora AI", sub: "Mindfulness article — intro" },
];

export function CommunityNotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center bg-[#3B2A1A] px-2 py-3 text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Community Notifications</h1>
        <span className="w-10 shrink-0" />
      </header>

      <div className="flex gap-2 border-b border-[var(--color-border)] bg-white px-4 py-2">
        <span className="rounded-full bg-[var(--color-accent-green-light)] px-3 py-1 text-xs font-bold text-[#3B2A1A]">Today</span>
        <span className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">Last Week</span>
      </div>

      <ul className="space-y-2 px-4 pt-4">
        {TODAY.map((n, i) => (
          <li key={i} className="flex gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${n.color}`}>
              {n.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#3B2A1A]">{n.title}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{n.sub}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 px-4 text-xs font-bold uppercase text-[var(--color-text-muted)]">Last Week</p>
      <ul className="space-y-2 px-4 pt-2">
        {LAST.map((n, i) => (
          <li key={i} className="flex gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${n.color}`}>
              {n.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#3B2A1A]">{n.title}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{n.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
