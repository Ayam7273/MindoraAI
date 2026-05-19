import { useState } from "react";
import { ChevronDown, ChevronLeft, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useT } from "@/store/languageStore";

const FAQ_KEYS = [
  {
    q: "What is Mindora AI?",
    a: "A mental wellness companion for journaling, sleep tracking, mood monitoring, and compassionate AI support — always available, wherever you are.",
  },
  {
    q: "How does Mindora AI work?",
    a: "It combines structured wellness trackers with conversational AI guidance. Mindora learns from your entries to provide personalised insights — always verify urgent mental health concerns with a professional.",
  },
  {
    q: "How do I access the AI chatbot?",
    a: "Sign in, complete onboarding, then open AI Chat from the Home screen or the sidebar navigation. You can start a new conversation any time.",
  },
  {
    q: "Is Mindora AI free?",
    a: "Mindora AI offers both free and premium tiers. Visit our website for current pricing and feature details.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is stored securely using Supabase infrastructure with encrypted connections. We do not sell your data to third parties. Review our Privacy Policy for full details.",
  },
  {
    q: "Can I delete my account and data?",
    a: "Yes. Go to Profile → Close Account to request account deletion. All your personal data will be permanently removed within 30 days.",
  },
  {
    q: "What should I do in a mental health crisis?",
    a: "Mindora is not a crisis service. If you are in immediate danger, please call emergency services (999 / 911). For emotional support call the Samaritans on 116 123 (UK) or text 988 (US).",
  },
];

export function HelpCenterScreen() {
  const navigate = useNavigate();
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      {/* Header */}
      <div className="bg-[var(--color-accent-green-light)] px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mb-4 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60"
            aria-label={t("action.back")}
          >
            <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
          </button>
          <span className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">
            {t("help.title")}
          </span>
          <span className="w-10 shrink-0" />
        </div>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/60">
            <MessageCircle className="h-8 w-8 text-[var(--color-accent-green)]" strokeWidth={1.5} />
          </div>
          <p className="mt-3 text-sm font-semibold text-[#3B2A1A]">Mindora AI</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{t("help.supportText")}</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="-mt-4 px-4">
        <div className="mb-3 flex items-center justify-between pt-2">
          <h2 className="text-sm font-bold text-[#3B2A1A]">{t("help.faq")}</h2>
        </div>
        <ul className="space-y-2">
          {FAQ_KEYS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="overflow-hidden rounded-xl bg-white ring-1 ring-[var(--color-border)]">
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm font-semibold text-[#3B2A1A]"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="flex-1">{item.q}</span>
                  <ChevronDown
                    className={cn("mt-0.5 h-4 w-4 shrink-0 transition-transform text-[var(--color-text-muted)]", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <p className="border-t border-[var(--color-border)] px-4 py-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    {item.a}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <Link
          to="/help/live-chat"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#3B2A1A] py-3 text-sm font-semibold text-[#FAF8F4] hover:bg-[#2a1d12]"
        >
          <MessageCircle className="h-4 w-4" />
          {t("help.liveChat")}
        </Link>

        <p className="mt-6 text-center text-[10px] text-[var(--color-text-muted)]">
          {t("misc.disclaimer")}
        </p>
      </div>
    </div>
  );
}
