import { Link, useNavigate } from "react-router-dom";
import { Bot, ChevronRight, MessageSquarePlus, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useChatStorage } from "@/lib/chatStorage";

export function AIChatbotScreen() {
  const navigate = useNavigate();
  const { conversations } = useChatStorage();

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28 lg:flex lg:gap-0 lg:pb-0">
      {/* Left panel: header + conversation list */}
      <aside className="lg:w-[300px] lg:shrink-0 lg:border-r lg:border-[var(--color-border)] lg:min-h-dvh lg:flex lg:flex-col">
        <header className="rounded-b-3xl bg-[#3B2A1A] px-4 pb-8 pt-[max(0.5rem,env(safe-area-inset-top))] text-[#FAF8F4] lg:rounded-none lg:rounded-b-none lg:flex-shrink-0">
          <div className="flex items-start gap-3">
            <div aria-hidden>
              <Bot className="h-12 w-12" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold">Mindora AI</h1>
              <p className="mt-1 text-xs text-white/70">
                A compassionate companion — not a substitute for professional care.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              className="flex-1 rounded-full"
              onClick={() => navigate("/chatbot/new")}
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4" />
                New Conversation +
              </span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="rounded-full px-4"
              onClick={() => navigate("/chatbot/voice")}
              aria-label="Voice chat"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/chatbot/custom-instructions")}
            className="mt-3 w-full text-center text-xs text-white/80 underline"
          >
            Custom AI instructions
          </button>
        </header>

        <section className="px-4 pt-5 lg:flex-1 lg:overflow-y-auto">
          <h2 className="mb-2 text-sm font-bold text-[#3B2A1A]">Recent Conversations</h2>
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-10 text-center">
              <span className="text-4xl">💬</span>
              <p className="font-semibold text-[var(--color-primary)]">No conversations yet</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Start a new conversation with Mindora AI.
              </p>
              <Button
                type="button"
                className="rounded-full"
                onClick={() => navigate("/chatbot/new")}
              >
                Start a conversation
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {sorted.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/chatbot/${c.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
                      <Bot className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#3B2A1A]">{c.title}</p>
                      <p className="truncate text-xs text-[var(--color-text-muted)]">
                        {c.messages[c.messages.length - 1]?.text.slice(0, 60) ?? ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                      {formatRelative(c.updatedAt)}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      {/* Right panel: chat area placeholder (desktop only) */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:bg-[#FAF8F4]">
        <Bot className="h-16 w-16 text-[var(--color-text-muted)]" strokeWidth={1.25} />
        <p className="mt-4 text-base font-semibold text-[var(--color-primary)]">Select a conversation</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Choose from the list or start a new one.</p>
        <Button
          type="button"
          className="mt-6 rounded-full"
          onClick={() => navigate("/chatbot/new")}
        >
          <span className="inline-flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            New Conversation
          </span>
        </Button>
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
