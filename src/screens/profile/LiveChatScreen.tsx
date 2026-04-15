import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LiveChatScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center bg-[#FAF8F4] px-6 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))] text-center">
      <header className="mb-6 flex w-full items-center">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]" aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <span className="flex-1" />
      </header>
      <div className="text-7xl" aria-hidden>
        🎧
      </div>
      <h1 className="mt-6 text-xl font-bold text-[#3B2A1A]">We are here to help you with your mental health needs!</h1>
      <p className="mt-3 max-w-sm text-sm text-[var(--color-text-secondary)]">We aim to reply within a few minutes 🙂</p>
      <Link
        to="/help/live-chat/session"
        className={cn(
          "mt-10 flex w-full max-w-xs items-center justify-center rounded-full bg-[#3B2A1A] px-4 py-3 text-sm font-semibold text-[#FAF8F4] hover:bg-[#2a1d12]",
        )}
      >
        Live Chat 💬
      </Link>
    </div>
  );
}
