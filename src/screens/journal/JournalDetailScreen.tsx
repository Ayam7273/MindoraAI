import { useState } from "react";
import { format } from "date-fns";
import { BookOpen, ChevronLeft, Sparkles, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { streamAIResponse } from "@/lib/aiService";
import {
  deleteJournalEntry,
  getJournalEntry,
  updateJournalEntry,
} from "@/lib/journalStorage";

export function JournalDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(() => (id ? getJournalEntry(id) : undefined));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingReflection, setLoadingReflection] = useState(false);

  if (!entry) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
        <BookOpen className="h-12 w-12 text-[var(--color-text-muted)]" strokeWidth={1.5} />
        <p className="mt-4 font-semibold text-[var(--color-primary)]">Entry not found</p>
        <Button
          type="button"
          className="mt-6 rounded-full"
          onClick={() => navigate("/journal/list")}
        >
          Back to Journal
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteJournalEntry(entry.id);
    navigate("/journal/list", { replace: true });
  };

  const getReflection = async () => {
    setLoadingReflection(true);
    const promptMessages = [
      {
        id: "ctx",
        role: "user" as const,
        text: `Here is my journal entry:\n\n"${entry.body}"\n\nPlease give me a short, warm, empathetic reflection (2-3 sentences) that validates my feelings and offers a gentle reframe or encouragement.`,
        timestamp: new Date().toISOString(),
      },
    ];
    let reflection = "";
    try {
      for await (const chunk of streamAIResponse(promptMessages)) {
        reflection += chunk;
        // Update state incrementally so user sees it streaming
        setEntry((prev) => (prev ? { ...prev, aiReflection: reflection } : prev));
      }
      if (id) updateJournalEntry(id, { aiReflection: reflection });
    } catch {
      // ignore
    } finally {
      setLoadingReflection(false);
    }
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
        <h1 className="min-w-0 flex-1 truncate px-2 text-center text-base font-semibold text-[var(--color-primary)]">
          {entry.title}
        </h1>
        <span className="w-10" />
      </header>

      <div className="px-4 pt-4">
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          {format(new Date(entry.timestamp), "EEEE, MMMM d, yyyy · h:mm a")}
        </p>

        <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-sm leading-relaxed text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
          <p className="whitespace-pre-wrap">{entry.body}</p>
        </article>

        {entry.aiReflection ? (
          <div className="mt-4 rounded-[var(--radius-lg)] bg-[var(--color-accent-green-light)] p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--color-accent-green)]">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wide">Mindora&apos;s Reflection</p>
            </div>
            <p className="text-sm italic leading-relaxed text-[var(--color-text-secondary)]">
              {entry.aiReflection}
            </p>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="mt-4 rounded-full"
            onClick={() => void getReflection()}
            disabled={loadingReflection}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {loadingReflection ? "Getting reflection…" : "Get AI Reflection"}
            </span>
          </Button>
        )}

        <div className="mt-6">
          {confirmDelete ? (
            <div className="rounded-[var(--radius-lg)] bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-sm font-semibold text-red-800">
                Are you sure you want to delete this entry? This cannot be undone.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  className="rounded-full"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  fullWidth
                  className="rounded-full bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Yes, delete
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
