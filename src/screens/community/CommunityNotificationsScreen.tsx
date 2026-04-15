import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TODAY = [
  { icon: "💬", color: "bg-[var(--color-accent-green)]", title: "Alfonso messaged you", sub: "“Hey, are you free?”" },
  { icon: "💬", color: "bg-[var(--color-accent-orange)]", title: "New comment on your post", sub: "“This helped me today.”" },
  { icon: "@", color: "bg-purple-500", title: "You were mentioned", sub: "in a thread about sleep" },
];

const LAST = [{ icon: "🎬", color: "bg-[#8B7355]", title: "New video from Freud.ai", sub: "Mindfulness 101 — intro" }];

export function CommunityNotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center bg-[#3B2A1A] px-2 py-3 text-[#FAF8F4]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Community Notification</h1>
        <span className="w-10" />
      </header>
      <div className="flex gap-2 border-b border-[var(--color-border)] bg-white px-4 py-2">
        <span className="rounded-full bg-[var(--color-accent-green-light)] px-3 py-1 text-xs font-bold text-[#3B2A1A]">Today</span>
        <span className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">Last Week</span>
      </div>
      <ul className="space-y-2 px-4 pt-4">
        {TODAY.map((n, i) => (
          <li key={i} className="flex gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${n.color}`}>{n.icon}</div>
            <div>
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
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${n.color}`}>{n.icon}</div>
            <div>
              <p className="text-sm font-semibold text-[#3B2A1A]">{n.title}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{n.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
