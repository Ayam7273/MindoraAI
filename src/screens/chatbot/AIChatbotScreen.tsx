import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, MessageSquarePlus, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/store/uiStore";

const CONVERSATIONS = [
  { id: "1", title: "Anxiety at work", preview: "Let's try a grounding exercise…", time: "2h ago", mood: "😟" },
  { id: "2", title: "Sleep & rumination", preview: "Small steps tonight could be…", time: "Yesterday", mood: "😴" },
  { id: "3", title: "Family stress", preview: "It sounds like you care deeply…", time: "Mon", mood: "💛" },
];

export function AIChatbotScreen() {
  const navigate = useNavigate();
  const isPro = Boolean(useUiStore((s) => s.profile?.is_pro));
  const tokensLeft = useUiStore((s) => s.chatbotTokensLeft);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="rounded-b-3xl bg-[#3B2A1A] px-4 pb-8 pt-[max(0.5rem,env(safe-area-inset-top))] text-[#FAF8F4]">
        <div className="flex items-start gap-3">
          <div className="text-5xl" aria-hidden>
            🤖
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold">Mindful AI Chatbot</h1>
            <p className="mt-1 text-xs text-white/70">Talk with Mindora AI — supportive, not a substitute for care.</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-white/10 p-4">
          <p className="text-3xl font-bold tabular-nums">2,541</p>
          <p className="text-xs text-white/70">Total conversations (demo)</p>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-xs">
            <span>Tokens left this month</span>
            <span className="font-bold text-[var(--color-accent-green-light)]">{isPro ? "∞" : tokensLeft}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" className="flex-1 rounded-full" onClick={() => navigate("/chatbot/new")}>
            <span className="inline-flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              New Conversation +
            </span>
          </Button>
          <Button type="button" variant="secondary" className="rounded-full px-4" onClick={() => navigate("/chatbot/voice")}>
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        <button type="button" onClick={() => navigate("/chatbot/custom-instructions")} className="mt-3 w-full text-center text-xs text-white/80 underline">
          Custom AI instructions
        </button>
      </header>

      <section className="px-4 pt-5">
        <h2 className="mb-2 text-sm font-bold text-[#3B2A1A]">Recent</h2>
        <ul className="space-y-2">
          {CONVERSATIONS.map((c) => (
            <li key={c.id}>
              <Link
                to={`/chatbot/${c.id}`}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-lg">👨‍⚕️</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#3B2A1A]">{c.title}</p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{c.preview}</p>
                </div>
                <span className="shrink-0 text-lg">{c.mood}</span>
                <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">{c.time}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => navigate("/chatbot/tokens")} className="mt-6 w-full text-center text-xs font-semibold text-[var(--color-accent-orange)]">
          Simulate token limit screen →
        </button>
      </section>
    </div>
  );
}
