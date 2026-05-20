import { useState } from "react";
import { format } from "date-fns";
import { BookOpen, ChevronLeft, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { streamAIResponse } from "@/lib/aiService";
import { useJournalEntries, useUpdateJournal, useDeleteJournal } from "@/hooks/useJournalEntries";
import { useUiStore } from "@/store/uiStore";
import type { JournalEntryRow } from "@/types/database";

export function JournalDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { data: entries = [], isLoading } = useJournalEntries(userId);
  const updateJournal = useUpdateJournal();
  const deleteJournal = useDeleteJournal();

  const entry: JournalEntryRow | undefined = entries.find((e) => e.id === id);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingReflection, setLoadingReflection] = useState(false);
  // Local streaming accumulator so we see incremental AI text before it's persisted
  const [streamedReflection, setStreamedReflection] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FAF8F4]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-text-muted)]" />
      </div>
    );
  }

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

  const handleDelete = async () => {
    if (!userId) return;
    await deleteJournal.mutateAsync({ id: entry.id, user_id: userId });
    navigate("/journal/list", { replace: true });
  };

  const getReflection = async () => {
    setLoadingReflection(true);
    setStreamedReflection("");
    const promptMessages = [
      {
        id: "ctx",
        role: "user" as const,
        text: `Here is my journal entry:\n\n"${entry.content}"\n\nPlease give me a short, warm, empathetic reflection (2-3 sentences) that validates my feelings and offers a gentle reframe or encouragement.`,
        timestamp: new Date().toISOString(),
      },
    ];
    let reflection = "";
    try {
      for await (const chunk of streamAIResponse(promptMessages)) {
        reflection += chunk;
        setStreamedReflection(reflection);
      }
      // Persist the reflection to Supabase via ai_suggestions field
      if (userId && reflection) {
        await updateJournal.mutateAsync({
          id: entry.id,
          user_id: userId,
          patch: { ai_suggestions: { reflection } },
        });
      }
    } catch {
      // ignore
    } finally {
      setLoadingReflection(false);
    }
  };

  // Resolve the AI reflection: prefer the live-streamed value, then fall back to what's stored
  const storedReflection =
    entry.ai_suggestions &&
    typeof entry.ai_suggestions === "object" &&
    !Array.isArray(entry.ai_suggestions)
      ? (entry.ai_suggestions as Record<string, unknown>).reflection as string | undefined
      : undefined;

  const displayReflection = streamedReflection ?? storedReflection ?? null;

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

      <div className="px-3 sm:px-4 pt-4">
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          {format(new Date(entry.created_at), "EEEE, MMMM d, yyyy · h:mm a")}
        </p>

        <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 text-sm leading-relaxed text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] journal-detail-content">
          <p className="whitespace-pre-wrap break-words">{entry.content}</p>
        </article>

        {displayReflection ? (
          <div className="mt-4 rounded-[var(--radius-lg)] bg-[var(--color-accent-green-light)] p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--color-accent-green)]">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wide">Mindora&apos;s Reflection</p>
            </div>
            <p className="text-sm italic leading-relaxed text-[var(--color-text-secondary)]">
              {displayReflection}
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
                  onClick={() => void handleDelete()}
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
