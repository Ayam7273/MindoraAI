import { useState } from "react";
import { CheckCircle, Loader2, PenLine, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TopBar } from "@/components/ui/TopBar";
import { useAddJournal } from "@/hooks/useJournalEntries";
import { useUiStore } from "@/store/uiStore";
import { hapticSuccess } from "@/lib/haptics";
import { generateText } from "@/lib/aiHelpers";

export function NewJournalScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const addJournal = useAddJournal();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);

  const handleSave = async () => {
    if (!body.trim() && !title.trim()) return;
    if (!userId) return;
    setSaving(true);
    try {
      const entry = await addJournal.mutateAsync({
        user_id: userId,
        title: title.trim() || "Journal entry",
        content: body.trim(),
        type: "text",
      });
      hapticSuccess();
      setEntryId(entry.id);
      setSaved(true);

      // Ask AI for an empathetic reflection on the journal entry
      if (body.trim().length > 20) {
        setReflectionLoading(true);
        const prompt = `The following is a personal journal entry. Provide a brief, empathetic reflection that:
- Validates the user's feelings in 1-2 sentences
- Offers one gentle, practical insight
- Ends with an encouraging closing sentence
Do not give medical advice. Keep the total response to 3-4 sentences. Be warm and human.

Journal entry:
"${body.trim().slice(0, 800)}"`;
        const reply = await generateText(prompt).catch(() => null);
        setReflection(reply);
        setReflectionLoading(false);
      }
    } catch {
      // insert failed — stay on the form
    } finally {
      setSaving(false);
    }
  };

  if (saved && entryId) {
    return (
      <div className="flex min-h-dvh flex-col items-center bg-[#FAF8F4] px-6 pb-16 pt-16 text-center">
        <CheckCircle className="h-20 w-20 text-[var(--color-accent-green)]" strokeWidth={1.5} />
        <p className="mt-6 text-2xl font-bold text-[var(--color-primary)]">Entry saved!</p>
        <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">
          Your journal entry has been saved.
        </p>

        {/* Gemini AI reflection */}
        {reflectionLoading && (
          <div className="mt-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white py-5 text-sm text-[var(--color-text-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Mindora AI is reflecting on your entry…
          </div>
        )}

        {reflection && !reflectionLoading && (
          <div className="mt-6 w-full max-w-sm rounded-2xl border border-[var(--color-accent-green)]/30 bg-[var(--color-accent-green-light)] p-5 text-left">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--color-accent-green)]" strokeWidth={1.75} />
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
                Mindora AI Reflection
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{reflection}</p>
          </div>
        )}

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <Button
            type="button"
            fullWidth
            className="rounded-full"
            onClick={() => navigate(`/journal/${entryId}`, { replace: true })}
          >
            View Entry
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="rounded-full"
            onClick={() => navigate("/journal/list")}
          >
            See All Entries
          </Button>
          <button
            type="button"
            className="text-xs text-[var(--color-text-muted)] underline"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="New Journal Entry" />
      <div className="space-y-4 px-3 sm:px-4 pt-6">
        <div className="flex items-start gap-3 rounded-[var(--radius-xl)] bg-white p-4 ring-1 ring-[var(--color-border)] overflow-hidden journal-info-card">
          <PenLine className="h-6 w-6 shrink-0 text-[var(--color-accent-green)]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[var(--color-primary)]">Text Journal</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Write freely — your entries are private and saved securely.
            </p>
          </div>
        </div>

        <Input
          label="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Feeling anxious today"
          className="journal-title-input"
        />

        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Entry
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-accent-green)]"
            placeholder="Write your thoughts, feelings, or anything on your mind..."
            autoFocus
          />
        </label>

        <Button
          type="button"
          fullWidth
          className="rounded-full"
          onClick={() => void handleSave()}
          disabled={(!body.trim() && !title.trim()) || saving}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
}
