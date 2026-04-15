import type { ReactNode } from "react";
import { Check, ChevronLeft, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { StatusBar } from "@/components/ui/StatusBar";

const TODAY = [
  { id: "m1", kind: "freud", title: "Message from Dr Freud AI", sub: "32 Total Unread Messages ⚠️", color: "bg-[var(--color-accent-green)]", href: "/notifications/smart/therapy" },
  { id: "j1", kind: "journal", title: "Journal Incomplete!", sub: "23m Remaining Time ⚠️", color: "bg-purple-500", href: "/notifications/smart/journal", ring: "8/32" },
  { id: "e1", kind: "exercise", title: "Exercise Complete!", sub: "15m Breathing Done ✓", color: "bg-[#8B7355]", href: "/notifications/smart/meditation" },
  { id: "d1", kind: "data", title: "Mental Health Data is Here", sub: "Your Monthly Mental Analysis is here", color: "bg-[var(--color-accent-yellow)]", href: "/home" },
  { id: "mo1", kind: "mood", title: "Mood Improved", sub: "Neutral → Happy", color: "bg-[var(--color-accent-green)]", href: "/notifications/smart/stress" },
];

const LAST_WEEK = [
  { id: "s1", kind: "stress", title: "Stress Decreased", sub: "Stress Level is now 3", color: "bg-[var(--color-accent-orange)]", href: "/notifications/smart/stress" },
  { id: "r1", kind: "rec", title: "Dr Freud Recommendations", sub: "48 Health Recommendations", color: "bg-[#8B7355]", href: "/home" },
];

function Row({
  title,
  sub,
  color,
  href,
  ring,
  extra,
}: {
  title: string;
  sub: string;
  color: string;
  href: string;
  ring?: string;
  extra?: ReactNode;
}) {
  return (
    <Link to={href} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${color}`}>●</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#3B2A1A]">{title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{sub}</p>
        {extra}
      </div>
      {ring ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-purple-200 text-[10px] font-bold text-purple-700">{ring}</div>
      ) : (
        <Check className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
      )}
    </Link>
  );
}

export function NotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <StatusBar />
      <header className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-2 py-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full" aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Notifications</h1>
        <span className="rounded-full bg-[var(--color-accent-orange)] px-2 py-0.5 text-[10px] font-bold text-white">12</span>
        <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--color-bg-secondary)]" />
      </header>

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Earlier This Day</h2>
        <ul className="space-y-2">
          {TODAY.map((n) => (
            <li key={n.id}>
              <Row
                title={n.title}
                sub={n.sub}
                color={n.color}
                href={n.href}
                ring={n.ring}
                extra={
                  n.kind === "data" ? (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-secondary)] px-2 py-1 text-[10px] font-bold">
                      <Download className="h-3 w-3" /> Download Data.pdf
                    </span>
                  ) : null
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Last Week</h2>
        <ul className="space-y-2">
          {LAST_WEEK.map((n) => (
            <li key={n.id}>
              <Row title={n.title} sub={n.sub} color={n.color} href={n.href} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
