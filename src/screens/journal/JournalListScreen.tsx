import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";

const ITEMS = [
  { id: "1", day: "Mon", title: "Feeling low again", sentiment: "Negative" as const, snippet: "Today was rough at work...", suggestions: 7 },
  { id: "critical", day: "Sun", title: "Dark thoughts", sentiment: "Depressed" as const, snippet: "I don't want to be here...", suggestions: 12 },
];

export function JournalListScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[var(--color-primary)]">Journal timeline</h1>
        <span className="w-10" />
      </header>
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
          <span key={d} className="shrink-0 rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold ring-1 ring-[var(--color-border)]">
            {d}
          </span>
        ))}
      </div>
      <ul className="space-y-3 px-4">
        {ITEMS.map((j) => (
          <li key={j.id}>
            <Link to={`/journal/${j.id}`}>
              <Card className="relative">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">{j.day}</p>
                    <p className="font-semibold text-[var(--color-primary)]">{j.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-secondary)]">{j.snippet}</p>
                  </div>
                  <button type="button" className="shrink-0 rounded-full p-1 hover:bg-[var(--color-bg-secondary)]" onClick={(e) => e.preventDefault()}>
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-text-secondary)]">
                    {j.sentiment}
                  </span>
                  <span className="rounded-full bg-[#ede8f5] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-accent-purple)]">
                    {j.suggestions} AI Suggestions
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
