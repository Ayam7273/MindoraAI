import { format, formatDistanceToNow } from "date-fns";
import { BookOpen, ChevronRight, Flame, PenLine, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useUiStore } from "@/store/uiStore";

function computeStreak(entries: { created_at: string }[]): number {
  if (entries.length === 0) return 0;
  const dateset = new Set(entries.map((e) => e.created_at.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (dateset.has(dateStr)) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else break;
  }
  return streak;
}


export function JournalScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { data: entries = [], isLoading } = useJournalEntries(userId);

  const streak = computeStreak(entries);
  const thisYear = entries.filter(
    (e) => new Date(e.created_at).getFullYear() === new Date().getFullYear(),
  ).length;

  const filtered = entries;

  return (
    <div className="min-h-dvh bg-[#FAF8F4]">

      {/* ── Header ── */}
      <div className="bg-[#3B2A1A] px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))] text-white lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              My Journal
            </h1>
            <p className="mt-0.5 text-sm text-white/60">{thisYear} entries this year</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <Flame className="h-3.5 w-3.5 text-orange-400" strokeWidth={1.75} />
              {streak}-day streak
            </div>
          )}
        </div>

      </div>

      {/* ── "Write Today" prompt card ── floats over the header */}
      <div className="-mt-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/journal/new")}
          className="w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[var(--color-border)] transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-green-light)]">
              <PenLine className="h-6 w-6 text-[var(--color-accent-green)]" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-bold text-[var(--color-primary)]">Write today's entry</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {format(new Date(), "EEEE, MMMM d")} · Tap to begin
              </p>
            </div>
            <Plus className="h-5 w-5 shrink-0 text-[var(--color-accent-green)]" strokeWidth={2} />
          </div>
        </button>
      </div>

      {/* ── Recent Entries ── */}
      <div className="mt-6 px-4 pb-28 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--color-primary)]">Recent Entries</h2>
          <Link
            to="/journal/list"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-green)]"
          >
            See all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--color-border)]" />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--color-border)] py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-green-light)]">
              <BookOpen className="h-8 w-8 text-[var(--color-accent-green)]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-bold text-[var(--color-primary)]">No entries yet</p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Your first entry is just a tap away.</p>
            </div>
            {true && (
              <button
                type="button"
                onClick={() => navigate("/journal/new")}
                className="rounded-full bg-[var(--color-accent-green)] px-5 py-2.5 text-sm font-bold text-white"
              >
                Write first entry
              </button>
            )}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {filtered.slice(0, 12).map((e) => {
              const wordCount = e.content?.split(/\s+/).filter(Boolean).length ?? 0;
              const ts = new Date(e.created_at);
              return (
                <li key={e.id}>
                  <Link
                    to={`/journal/${e.id}`}
                    className="group flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[var(--color-border)] transition-all hover:ring-[var(--color-accent-green)]/40 hover:shadow-md active:scale-[0.98]"
                  >
                    {/* Date + time row */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-green)]">
                        {format(ts, "EEE, MMM d")}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {formatDistanceToNow(ts, { addSuffix: true })}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="font-bold leading-snug text-[var(--color-primary)] group-hover:text-[var(--color-accent-green)]">
                      {e.title || "Untitled entry"}
                    </p>

                    {/* Content preview */}
                    {e.content && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                        {e.content}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {wordCount} word{wordCount !== 1 ? "s" : ""}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
