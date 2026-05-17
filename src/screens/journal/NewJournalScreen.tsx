import { useState } from "react";
import { CheckCircle, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TopBar } from "@/components/ui/TopBar";
import { addJournalEntry } from "@/lib/journalStorage";
import { hapticSuccess } from "@/lib/haptics";

export function NewJournalScreen() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!body.trim() && !title.trim()) return;
    setSaving(true);
    const entry = addJournalEntry(title.trim() || "Journal entry", body.trim());
    hapticSuccess();
    setEntryId(entry.id);
    setSaved(true);
    setSaving(false);
  };

  if (saved && entryId) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
        <CheckCircle className="h-20 w-20 text-[var(--color-accent-green)]" strokeWidth={1.5} />
        <p className="mt-6 text-2xl font-bold text-[var(--color-primary)]">Entry saved!</p>
        <p className="mt-3 max-w-xs text-sm text-[var(--color-text-secondary)]">
          Your journal entry has been saved to your device.
        </p>
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
      <div className="space-y-4 px-4 pt-6">
        <div className="flex items-center gap-3 rounded-[var(--radius-xl)] bg-white p-4 ring-1 ring-[var(--color-border)]">
          <PenLine className="h-6 w-6 text-[var(--color-accent-green)]" />
          <div>
            <p className="font-semibold text-[var(--color-primary)]">Text Journal</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Write freely — your entries are private and saved locally.
            </p>
          </div>
        </div>

        <Input
          label="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Feeling anxious today"
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
          onClick={handleSave}
          disabled={(!body.trim() && !title.trim()) || saving}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
}
