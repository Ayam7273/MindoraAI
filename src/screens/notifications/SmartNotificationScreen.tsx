import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const CONFIG: Record<
  string,
  { emoji: string; title: string; body: string; badge?: string; cta: string; to: string }
> = {
  score: {
    emoji: "🎉",
    title: "+8 Mindora Score Increased",
    body: "You're 26% happier compared to last month. Congrats! 🥳",
    badge: "Score Now: 88.5",
    cta: "See Score 📈",
    to: "/mindora-score",
  },
  journal: {
    emoji: "📓",
    title: "21/30 Journal Completed",
    body: "You still need to complete 9 daily journals this month. Keep it up!",
    cta: "See Journal 📓",
    to: "/journal",
  },
  therapy: {
    emoji: "📱",
    title: "05:25AM Session with Mindora AI",
    body: "You have a session with Mindora AI in 8h 21m from now.",
    cta: "See Schedule 🗓️",
    to: "/chatbot",
  },
  stress: {
    emoji: "🧘",
    title: "Neutral — Stress Decreased!",
    body: "You are now Neutral, Congrats!",
    cta: "See Stress Level 🧘",
    to: "/stress",
  },
  meditation: {
    emoji: "🙏",
    title: "It's Time!",
    body: "Time for meditation session. Mindora AI suggests you do a 25m session today.",
    cta: "Let's Meditate →",
    to: "/mindful/exercise",
  },
  sleep: {
    emoji: "🛌",
    title: "7h 50m — Sleep Quality Increased!",
    body: "Your sleep quality is 55% higher compared to last month.",
    cta: "See Sleep Quality 🛌",
    to: "/sleep",
  },
};

export function SmartNotificationScreen() {
  const { type } = useParams();
  const navigate = useNavigate();
  const cfg = (type && CONFIG[type]) || CONFIG.score;

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]">
      <header className="px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]" aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
      </header>
      <main className="flex flex-1 flex-col px-4 pb-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="text-8xl" aria-hidden>
            {cfg.emoji}
          </div>
          <h1 className="mt-6 text-xl font-bold text-[#3B2A1A]">{cfg.title}</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">{cfg.body}</p>
          {cfg.badge ? (
            <span className="mt-4 rounded-full bg-[var(--color-accent-orange-light)] px-4 py-2 text-xs font-bold text-[#3B2A1A] ring-1 ring-[var(--color-accent-orange)]/30">{cfg.badge}</span>
          ) : null}
        </div>
        <Button type="button" fullWidth className="rounded-full" onClick={() => navigate(cfg.to)}>
          {cfg.cta}
        </Button>
      </main>
    </div>
  );
}
