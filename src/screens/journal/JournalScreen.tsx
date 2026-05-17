import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Flame, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { getJournalEntries, getJournalStreak } from "@/lib/journalStorage";
import { format } from "date-fns";

export function JournalScreen() {
  const navigate = useNavigate();
  const entries = getJournalEntries();
  const streak = getJournalStreak();
  const thisYear = entries.filter(
    (e) => new Date(e.timestamp).getFullYear() === new Date().getFullYear(),
  ).length;

  // Build a 35-day heatmap (today is last cell)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const HEAT = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today.getTime() - (34 - i) * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const hasEntry = entries.some((e) => e.timestamp.startsWith(dateStr));
    return { i, hasEntry };
  });

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className="relative overflow-hidden rounded-b-[var(--radius-xl)] bg-[#3B2A1A] px-5 pb-16 pt-4 text-white lg:rounded-[var(--radius-xl)] lg:mx-8 lg:mt-6">
        <p className="text-4xl font-bold">{thisYear}</p>
        <p className="text-sm text-white/70">Journals this year</p>
        {streak > 0 && (
          <p className="mt-1 flex items-center gap-1 text-xs text-white/60">
            <Flame className="h-3 w-3" strokeWidth={1.75} />
            {streak}-day streak
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate("/journal/new")}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#3B2A1A] shadow-lg"
          aria-label="Add journal"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="-mt-8 space-y-5 px-4 lg:mt-6 lg:max-w-none lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:px-8 lg:pt-0 lg:space-y-0">
        {/* Left column: heatmap + new button */}
        <div className="space-y-5">
          <Card className="relative z-10">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-primary)]">Journal Overview</h2>
              <Link to="/journal/list" className="text-xs font-semibold text-[var(--color-accent-green)]">
                Timeline
              </Link>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {HEAT.map(({ i, hasEntry }) => (
                <span
                  key={i}
                  title={format(
                    new Date(today.getTime() - (34 - i) * 86400000),
                    "MMM d",
                  )}
                  className={cn(
                    "aspect-square rounded-sm",
                    hasEntry
                      ? "bg-[var(--color-accent-green)]"
                      : "bg-[var(--color-border)]",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
              Last 35 days — green = entry logged
            </p>
          </Card>

          <Button
            type="button"
            fullWidth
            className="rounded-full"
            onClick={() => navigate("/journal/new")}
          >
            New journal +
          </Button>
        </div>

        {/* Right column: recent entries */}
        <div>
          {entries.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] bg-white px-4 py-8 text-center ring-1 ring-[var(--color-border)]">
              <BookOpen className="h-10 w-10 text-[var(--color-text-muted)]" strokeWidth={1.5} />
              <p className="font-semibold text-[var(--color-primary)]">No entries yet</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Start your first journal entry to track your thoughts and feelings.
              </p>
            </div>
          ) : (
            <Card>
              <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Recent Entries</h2>
              <ul className="space-y-2">
                {entries.slice(0, 3).map((e) => (
                  <li key={e.id}>
                    <Link
                      to={`/journal/${e.id}`}
                      className="block rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] p-3 hover:bg-[var(--color-border)]"
                    >
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {format(new Date(e.timestamp), "EEEE, MMM d")}
                      </p>
                      <p className="mt-0.5 font-semibold text-[var(--color-primary)]">{e.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--color-text-secondary)]">
                        {e.body}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
