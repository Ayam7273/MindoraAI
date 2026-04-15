import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";

const AVATARS = ["👨‍⚕️", "👩‍⚕️", "🧑‍🔬", "🤖", "🦉", "🧘"];
const SOURCES = ["mindora.ai", "web", "medic", "journals"];
const TAGS = ["Mood", "Stress", "Trauma", "Anxiety"] as const;

export function NewConversationScreen() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(0);
  const [name, setName] = useState("");
  const [sources, setSources] = useState<string[]>(["mindora.ai"]);
  const [journalCtx, setJournalCtx] = useState(true);
  const [tags, setTags] = useState<string[]>(["Mood"]);
  const [isPrivate, setIsPrivate] = useState(false);

  const toggleSource = (s: string) => {
    setSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]" aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">New Conversation</h1>
        <span className="w-10" />
      </header>

      <p className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">Doctor avatar</p>
      <div className="mb-6 grid grid-cols-3 gap-2">
        {AVATARS.map((a, i) => (
          <button
            key={a}
            type="button"
            onClick={() => setAvatar(i)}
            className={cn(
              "flex h-16 items-center justify-center rounded-2xl text-3xl ring-2",
              avatar === i ? "bg-[var(--color-accent-green-light)] ring-[var(--color-accent-green)]" : "bg-white ring-transparent",
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <label className="mb-4 block text-sm font-medium text-[var(--color-text-secondary)]">
        Conversation name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Evening check-in"
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-[var(--color-text-primary)]"
        />
      </label>

      <p className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">Knowledge sources</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {SOURCES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleSource(s)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold capitalize",
              sources.includes(s) ? "bg-[#3B2A1A] text-white" : "bg-white ring-1 ring-[var(--color-border)]",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <Toggle label="Pull context from journal" checked={journalCtx} onChange={(e) => setJournalCtx(e.target.checked)} />

      <p className="mb-2 mt-4 text-sm font-semibold text-[var(--color-text-secondary)]">Tags</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggleTag(t)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold",
              tags.includes(t) ? "bg-[var(--color-accent-orange)] text-white" : "bg-white ring-1 ring-[var(--color-border)]",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Toggle label="Make private" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />

      <Button
        type="button"
        fullWidth
        className="mt-8 rounded-full"
        onClick={() => navigate(`/chatbot/${Date.now()}`)}
      >
        Create Conversation →
      </Button>
    </div>
  );
}
