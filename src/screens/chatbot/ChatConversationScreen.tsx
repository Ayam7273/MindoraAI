import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, ChevronLeft, RefreshCw, SendHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CrisisBanner } from "@/components/ui/CrisisBanner";
import { Sheet } from "@/components/ui/Sheet";
import { streamAIResponse } from "@/lib/aiService";
import {
  type ChatMessage,
  getConversation,
  updateConversation,
  deleteConversation,
} from "@/lib/chatStorage";
import { cn } from "@/lib/utils";

const SEED: ChatMessage[] = [
  {
    id: "seed-1",
    role: "ai",
    text: "Hello, I'm Mindora. I'm here to listen and support you. How are you feeling today?",
    timestamp: new Date().toISOString(),
  },
];

function hasCrisisKeywords(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes("suicide") ||
    t.includes("kill myself") ||
    t.includes("end my life") ||
    t.includes("self-harm") ||
    t.includes("hurt myself") ||
    t.includes("don't want to live")
  );
}

export function ChatConversationScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!id) return SEED;
    const saved = getConversation(id);
    return saved?.messages?.length ? saved.messages : SEED;
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Persist messages whenever they change
  useEffect(() => {
    if (id) updateConversation(id, messages);
  }, [messages, id]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    if (hasCrisisKeywords(text)) setShowCrisis(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    const aiId = crypto.randomUUID();
    const aiMsg: ChatMessage = {
      id: aiId,
      role: "ai",
      text: "",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMsg]);

    abortRef.current = new AbortController();

    try {
      for await (const chunk of streamAIResponse(nextMessages, abortRef.current.signal)) {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiId ? { ...m, text: m.text + chunk } : m)),
        );
      }
    } catch {
      // aborted or network error — leave partial message
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  function handleDelete() {
    if (id) deleteConversation(id);
    navigate("/chatbot", { replace: true });
  }

  function newConversation() {
    navigate("/chatbot/new");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-bg-secondary)]"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#3B2A1A]">Mindora AI</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {streaming ? "Responding…" : "Ready to listen"}
          </p>
        </div>
        <button
          type="button"
          onClick={newConversation}
          className="flex h-9 items-center gap-1 rounded-full bg-[var(--color-bg-secondary)] px-3 text-xs font-semibold text-[var(--color-primary)]"
          aria-label="New conversation"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          New
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="text-xs font-semibold text-[var(--color-accent-orange)]"
        >
          Delete
        </button>
      </header>

      {showCrisis && (
        <div className="px-3 pt-2">
          <CrisisBanner />
        </div>
      )}

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "ai" ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
                <Bot className="h-5 w-5" strokeWidth={1.75} />
              </div>
            ) : null}
            <div
              className={cn(
                "max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "rounded-br-md bg-[#3B2A1A] text-[#FAF8F4]"
                  : "rounded-bl-md bg-white ring-1 ring-[var(--color-border)]",
              )}
            >
              {msg.text || (
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-text-muted)] [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-text-muted)] [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-text-muted)] [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)] bg-white px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2 rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message Mindora…"
            className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-sm outline-none"
            disabled={streaming}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={!input.trim() || streaming}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity",
              input.trim() && !streaming
                ? "bg-[#3B2A1A] opacity-100"
                : "bg-[var(--color-text-muted)] opacity-50",
            )}
            aria-label="Send message"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-center text-[10px] text-[var(--color-text-muted)]">
          Mindora is not a substitute for professional care.
        </p>
      </div>

      <Sheet open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete This Conversation?">
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            This will permanently remove this conversation from your device.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="rounded-full"
              onClick={() => setDeleteOpen(false)}
            >
              Keep it
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
      </Sheet>
    </div>
  );
}
