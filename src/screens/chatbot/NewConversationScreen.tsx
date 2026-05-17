import { useState } from "react";
import { ChevronLeft, MessageSquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";
import { useUpsertConversation } from "@/hooks/useChatbotConversations";
import { useUiStore } from "@/store/uiStore";
import { createConversation } from "@/lib/chatStorage";

const SOURCES = ["mindora.ai", "web", "journals"];
const TAGS = ["Mood", "Stress", "Anxiety", "Sleep", "General"] as const;

export function NewConversationScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const upsert = useUpsertConversation();
  const [name, setName] = useState("");
  const [sources, setSources] = useState<string[]>(["mindora.ai"]);
  const [journalCtx, setJournalCtx] = useState(true);
  const [tags, setTags] = useState<string[]>(["Mood"]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleSource = (s: string) =>
    setSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const handleCreate = async () => {
    const title = name.trim() || "New conversation";
    setBusy(true);
    try {
      if (userId) {
        const row = await upsert.mutateAsync({
          user_id: userId,
          name: title,
          tags,
          is_private: isPrivate,
        });
        navigate(`/chatbot/${row.id}`, { replace: true });
      } else {
        const convo = createConversation(title);
        navigate(`/chatbot/${convo.id}`, { replace: true });
      }
    } catch {
      const convo = createConversation(title);
      navigate(`/chatbot/${convo.id}`, { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] lg:flex lg:items-center lg:justify-center lg:py-12">
      <div className="w-full px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))] lg:max-w-xl lg:rounded-2xl lg:bg-white lg:px-8 lg:py-8 lg:shadow-[var(--shadow-md)] lg:ring-1 lg:ring-[var(--color-border)]">
        <header className="mb-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)]"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">New Conversation</h1>
          <span className="w-10 shrink-0" />
        </header>

        <div className="space-y-5">
          {/* Conversation name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-secondary)]">
              Conversation name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Evening check-in"
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-strong)]"
            />
          </div>

          {/* Knowledge sources */}
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">Knowledge sources</p>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSource(s)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold capitalize transition-colors",
                    sources.includes(s)
                      ? "bg-[#3B2A1A] text-white"
                      : "bg-white text-[var(--color-primary)] ring-1 ring-[var(--color-border)]",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            label="Pull context from journal entries"
            checked={journalCtx}
            onChange={(e) => setJournalCtx(e.target.checked)}
          />

          {/* Tags */}
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">Topic tags</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                    tags.includes(t)
                      ? "bg-[var(--color-accent-orange)] text-white"
                      : "bg-white text-[var(--color-primary)] ring-1 ring-[var(--color-border)]",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Toggle
            label="Make this conversation private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />

          <Button
            type="button"
            fullWidth
            disabled={busy}
            className="rounded-full"
            onClick={() => void handleCreate()}
          >
            <span className="inline-flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              {busy ? "Creating…" : "Start Conversation"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
