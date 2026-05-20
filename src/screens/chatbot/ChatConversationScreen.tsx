import { useEffect, useRef, useState, useCallback } from "react";
import { Bot, ChevronLeft, RefreshCw, SendHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CrisisBanner } from "@/components/ui/CrisisBanner";
import { Sheet } from "@/components/ui/Sheet";
import { streamAIResponse } from "@/lib/aiService";
import type { ChatMessage } from "@/lib/chatStorage";
import { useChatbotMessages, useAddMessage } from "@/hooks/useChatbotMessages";
import { useDeleteConversation } from "@/hooks/useChatbotConversations";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const SEED_TEXT = "Hello, I'm Mindora. I'm here to listen and support you. How are you feeling today?";

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

/** Map a DB row to the local ChatMessage shape used by the UI and streamAIResponse. */
function rowToMsg(row: { id: string; role: string; content: string; created_at: string }): ChatMessage {
  return {
    id: row.id,
    role: row.role === "assistant" ? "ai" : "user",
    text: row.content,
    timestamp: row.created_at,
  };
}

export function ChatConversationScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);

  // Supabase queries / mutations
  const { data: dbMessages = [], isLoading } = useChatbotMessages(id);
  const addMessage = useAddMessage();
  const deleteConversation = useDeleteConversation();

  // Local streaming state — ephemeral, never persisted to DB until streaming is done
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [showCrisis, setShowCrisis] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Map DB rows to ChatMessage for use with streamAIResponse history
  const persistedMessages: ChatMessage[] = dbMessages.map(rowToMsg);

  // Full message list shown in the UI: seed when empty + persisted + optional streaming bubble
  const displayMessages: ChatMessage[] = (() => {
    const base =
      persistedMessages.length === 0 && !isLoading
        ? [
            {
              id: "seed-1",
              role: "ai" as const,
              text: SEED_TEXT,
              timestamp: new Date().toISOString(),
            },
          ]
        : persistedMessages;

    if (streamingText !== null) {
      return [
        ...base,
        {
          id: "streaming",
          role: "ai" as const,
          text: streamingText,
          timestamp: new Date().toISOString(),
        },
      ];
    }
    return base;
  })();

  const streaming = streamingText !== null;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [displayMessages, streaming]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming || !id) return;

    if (hasCrisisKeywords(text)) setShowCrisis(true);

    setInput("");

    // 1. Persist the user message to Supabase immediately
    await addMessage.mutateAsync({ conversation_id: id, role: "user", content: text });

    // Build history for the AI (persisted + the new user msg we just added)
    const historyForAI: ChatMessage[] = [
      ...persistedMessages,
      { id: crypto.randomUUID(), role: "user", text, timestamp: new Date().toISOString() },
    ];

    // 2. Stream the AI response
    setStreamingText("");
    abortRef.current = new AbortController();
    let fullText = "";

    try {
      for await (const chunk of streamAIResponse(historyForAI, abortRef.current.signal)) {
        fullText += chunk;
        setStreamingText(fullText);
      }
    } catch {
      // aborted or network error — leave whatever partial text we got
    } finally {
      abortRef.current = null;
      setStreamingText(null);

      // 3. Persist the completed AI response (only if we got something)
      if (fullText && id) {
        await addMessage.mutateAsync({ conversation_id: id, role: "assistant", content: fullText });
      }
    }
  }, [input, streaming, id, persistedMessages, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  function handleDelete() {
    if (id && userId) {
      deleteConversation.mutate({ id, userId });
    }
    navigate("/chatbot", { replace: true });
  }

  function newConversation() {
    navigate("/chatbot/new");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] chat-conversation-header">
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
        {displayMessages.map((msg) => (
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
                "max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed chat-bubble",
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

      <div className="border-t border-[var(--color-border)] bg-white px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] chat-input-bar">
        <div className="flex items-end gap-2 rounded-2xl bg-[var(--color-bg-secondary)] px-3 py-2">
          <textarea
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
            This will permanently remove this conversation and all its messages.
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
