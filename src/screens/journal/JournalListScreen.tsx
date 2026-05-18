import { useState } from "react";
import { format } from "date-fns";
import { BookOpen, ChevronDown, ChevronLeft, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { deleteJournalEntry, getJournalEntries, type JournalEntry } from "@/lib/journalStorage";

export function JournalListScreen() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>(getJournalEntries);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    setEntries(getJournalEntries());
    setConfirmDelete(null);
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-bg-secondary)]"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-center text-lg font-semibold text-[var(--color-primary)]">
          Journal Timeline
        </h1>
        <button
          type="button"
          onClick={() => navigate("/journal/new")}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-bg-secondary)]"
          aria-label="New entry"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <BookOpen className="h-12 w-12 text-[var(--color-text-muted)]" strokeWidth={1.5} />
          <p className="font-semibold text-[var(--color-primary)]">No journal entries yet</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Start writing to track your thoughts and feelings over time.
          </p>
          <Button
            type="button"
            className="rounded-full"
            onClick={() => navigate("/journal/new")}
          >
            Write first entry
          </Button>
        </div>
      ) : (
        <ul className="space-y-3 px-3 sm:px-4 pt-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0 lg:px-8 journal-list journal-list-grid">
          {entries.map((entry) => (
            <li key={entry.id} className="overflow-hidden rounded-[var(--radius-xl)] bg-white ring-1 ring-[var(--color-border)] journal-list-entry">
              <button
                type="button"
                className="flex w-full items-start gap-3 p-4 text-left"
                onClick={() => setExpanded((v) => (v === entry.id ? null : entry.id))}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-[var(--color-text-muted)]">
                    {format(new Date(entry.timestamp), "EEEE, MMM d · h:mm a")}
                  </p>
                  <p className="mt-0.5 truncate font-semibold text-[var(--color-primary)]">{entry.title}</p>
                  {expanded !== entry.id && (
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                      {entry.body}
                    </p>
                  )}
                </div>
                {expanded === entry.id ? (
                  <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                )}
              </button>

              {expanded === entry.id && (
                <div className="border-t border-[var(--color-border)] px-4 pb-4 pt-3">
                  <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-primary)]">
                    {entry.body}
                  </p>
                  {entry.aiReflection && (
                    <div className="mt-3 rounded-[var(--radius-lg)] bg-[var(--color-accent-green-light)] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
                        AI Reflection
                      </p>
                      <p className="mt-1 text-xs italic text-[var(--color-text-secondary)]">
                        {entry.aiReflection}
                      </p>
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1 rounded-full text-xs"
                      onClick={() => navigate(`/journal/${entry.id}`)}
                    >
                      View full
                    </Button>
                    {confirmDelete === entry.id ? (
                      <div className="flex flex-1 gap-1">
                        <Button
                          type="button"
                          variant="secondary"
                          className="flex-1 rounded-full text-xs"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          className="flex-1 rounded-full bg-red-600 text-xs hover:bg-red-700"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(entry.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
