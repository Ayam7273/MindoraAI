import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TokenLimitScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
      <div aria-hidden>
        <Bot className="h-8 w-8 text-[var(--color-text-secondary)]" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#3B2A1A]">Ready to Chat</h1>
      <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">
        Start a new conversation with Mindora AI.
      </p>
      <Button
        type="button"
        className="mt-8 w-full max-w-xs rounded-full"
        onClick={() => navigate("/chatbot/new")}
      >
        New Conversation
      </Button>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-[var(--color-accent-green)] underline"
        onClick={() => navigate("/chatbot")}
      >
        Back to conversations
      </button>
    </div>
  );
}
