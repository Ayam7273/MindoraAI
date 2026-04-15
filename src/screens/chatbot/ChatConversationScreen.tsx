import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Mic, SendHorizontal, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CrisisBanner } from "@/components/ui/CrisisBanner";
import { Sheet } from "@/components/ui/Sheet";
import { detectCrisisLanguage } from "@/lib/crisisDetection";
import { hapticError } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";

type Msg = { id: string; role: "user" | "ai"; text: string; limited?: boolean };

const SEED: Msg[] = [
  { id: "1", role: "ai", text: "Hello, I'm Mindora AI. How can I help you today?" },
];

export function ChatConversationScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isPro = Boolean(useUiStore((s) => s.profile?.is_pro));
  const decrement = useUiStore((s) => s.decrementChatbotTokens);
  const tokensLeft = useUiStore((s) => s.chatbotTokensLeft);
  const activateCrisisProtocol = useUiStore((s) => s.setCrisisMode);
  const crisisProtocolActive = useUiStore((s) => s.crisisMode);
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showLimited, setShowLimited] = useState(true);
  const [localCrisis, setLocalCrisis] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const showCrisisBanner = crisisProtocolActive || localCrisis;

  const send = () => {
    const t = input.trim();
    if (!t) return;
    if (!isPro && tokensLeft <= 0) {
      hapticError();
      navigate("/chatbot/tokens");
      return;
    }
    const crisis = detectCrisisLanguage(t);
    if (crisis) {
      activateCrisisProtocol(true);
      setLocalCrisis(true);
    }
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: t }]);
    if (!isPro) decrement(2);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const reply = crisis
        ? "I hear that you’re hurting. You deserve support right now — please consider calling 988 (US) or your local crisis line. I’m here to listen, but I’m not a substitute for professional care."
        : "Thanks for sharing. A small next step: try 60s of slow breathing, then note one thing that went okay today.";
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: reply,
          limited: showLimited,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex items-center gap-2 border-b border-[var(--color-border)] bg-white px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#3B2A1A]">Conversation {id ?? ""}</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">Tokens: {isPro ? "∞" : tokensLeft}</p>
        </div>
        <button type="button" onClick={() => setDeleteOpen(true)} className="text-xs font-semibold text-[var(--color-accent-orange)]">
          Delete
        </button>
      </header>

      {showLimited ? (
        <div className="mx-3 mt-2 flex items-center gap-2 rounded-full bg-[var(--color-accent-orange-light)] px-3 py-1.5 text-[11px] font-semibold text-[#3B2A1A]">
          <Sparkles className="h-3.5 w-3.5" />
          Limited Knowledge — some sources disabled for this chat.
        </div>
      ) : null}

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {showCrisisBanner ? <CrisisBanner /> : null}
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "ai" ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-lg">👨‍⚕️</div>
            ) : null}
            <div
              className={cn(
                "max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user" ? "rounded-br-md bg-[#3B2A1A] text-[#FAF8F4]" : "rounded-bl-md bg-white ring-1 ring-[var(--color-border)]",
              )}
            >
              {msg.text}
              {msg.limited ? <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Context: restricted mode</p> : null}
            </div>
          </div>
        ))}
        {typing ? (
          <div className="flex gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-lg">👨‍⚕️</div>
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-[var(--color-border)]">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#3B2A1A] [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#3B2A1A] [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#3B2A1A] [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm">
          <p className="text-xs font-bold text-[#3B2A1A]">AI suggestion</p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Try a 4-7-8 breathing cycle (Relaxation)</p>
          <Button type="button" variant="secondary" className="mt-2 h-8 w-full rounded-full text-xs">
            Expand resource
          </Button>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] bg-white px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2 rounded-2xl bg-[var(--color-bg-secondary)] px-2 py-2">
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white" aria-label="Voice">
            <Mic className="h-5 w-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Message…"
            className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-sm outline-none"
          />
          <button type="button" onClick={send} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B2A1A] text-white" aria-label="Send">
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
        <button type="button" className="mt-2 w-full text-center text-[11px] text-[var(--color-text-muted)]" onClick={() => setShowLimited((v) => !v)}>
          Toggle “Limited Knowledge” demo
        </button>
      </div>

      <Sheet open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete This AI Conversation?">
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">This removes the thread from this device (demo).</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" fullWidth className="rounded-full" onClick={() => setDeleteOpen(false)}>
              No, keep
            </Button>
            <Button type="button" fullWidth className="rounded-full bg-red-600 hover:bg-red-700" onClick={() => navigate("/chatbot")}>
              Yes, delete
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
