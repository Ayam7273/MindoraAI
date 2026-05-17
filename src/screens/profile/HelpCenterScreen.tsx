import { useState } from "react";
import { ChevronDown, ChevronLeft, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const FAQ = [
  { q: "What is Mindora AI?", a: "A mental wellness companion for journaling, sleep, mood, and guided support ." },
  { q: "How does Mindora AI work?", a: "It combines structured trackers with conversational guidance — always verify urgent matters with a professional." },
  { q: "How do I access Mindora AI?", a: "Sign in, complete onboarding, then open Chatbot from Home or the quick action button." },
  { q: "Is Mindora AI free?", a: "Mindora AI offers both free and premium tiers. Visit our website for current pricing details." },
  { q: "Is my data secure?", a: "Treat this as a prototype. Production apps need encryption, policies, and compliance review." },
];

export function HelpCenterScreen() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className="bg-[var(--color-accent-green-light)] px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))] text-center">
        <div className="mb-4 flex items-center">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60" aria-label="Back">
            <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
          </button>
          <span className="flex-1 text-lg font-bold text-[#3B2A1A]">Help Center</span>
          <span className="w-10" />
        </div>
        <div className="text-5xl" aria-hidden>
          ✿
        </div>
        <p className="mt-2 text-sm font-semibold text-[#3B2A1A]">Mindora AI</p>
        <p className="text-xs text-[var(--color-text-secondary)]">Supportive tools for everyday mental wellness.</p>
      </div>

      <div className="-mt-4 space-y-3 px-4">
        {["Our Office Address", "Our Email Address", "Our Phone Number"].map((t) => (
          <div key={t} className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#3B2A1A] shadow-sm ring-1 ring-[var(--color-border)]">
            {t}
            <p className="mt-1 text-xs font-normal text-[var(--color-text-muted)]"></p>
          </div>
        ))}
      </div>

      <div className="mt-8 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#3B2A1A]">FAQ</h2>
        </div>
        <ul className="space-y-2">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="overflow-hidden rounded-xl bg-white ring-1 ring-[var(--color-border)]">
                <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#3B2A1A]" onClick={() => setOpen(isOpen ? null : i)}>
                  {item.q}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen ? <p className="border-t border-[var(--color-border)] px-4 py-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">{item.a}</p> : null}
              </li>
            );
          })}
        </ul>
        <Link
          to="/help/live-chat"
          className={cn(
            "mt-6 flex w-full items-center justify-center rounded-full bg-[#3B2A1A] py-3 text-sm font-semibold text-[#FAF8F4] hover:bg-[#2a1d12]",
          )}
        >
          <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" />Live Chat</span>
        </Link>
      </div>
    </div>
  );
}
