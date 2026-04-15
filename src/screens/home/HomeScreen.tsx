import { format } from "date-fns";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Heart,
  Moon,
  Search,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatusBar } from "@/components/ui/StatusBar";
import { cn } from "@/lib/utils";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { useUiStore } from "@/store/uiStore";

const ARTICLES = [
  { id: "1", title: "Will meditation help you escape the rat race?", tag: "Mindfulness" },
  { id: "2", title: "Sleep hygiene in 10 minutes a day", tag: "Sleep" },
  { id: "3", title: "Understanding anxiety spirals", tag: "Stress" },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const displayName = useUiStore((s) => s.profile?.full_name ?? "Friend");
  const isPro = Boolean(useUiStore((s) => s.profile?.is_pro));
  const { score, mood: currentMood } = useMindoraScore(userId);
  const today = format(new Date(), "EEEE, MMM d");

  const moodLabel =
    currentMood === "depressed"
      ? "Depressed"
      : currentMood === "sad"
        ? "Sad"
        : currentMood === "neutral"
          ? "Neutral"
          : currentMood === "happy"
            ? "Happy"
            : "Overjoyed";

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-4">
      <StatusBar />
      <header className="bg-[#3B2A1A] px-4 pb-5 pt-2 text-[#FAF8F4]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              {displayName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">
                Hi, {displayName}! 👋
              </p>
              <p className="text-xs text-white/70">{today}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/search")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
            aria-label="Search"
          >
            <Search className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isPro ? (
            <span className="rounded-full bg-[var(--color-accent-green)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Pro
            </span>
          ) : null}
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <MoodEmoji mood={currentMood} size={22} />
            <span className="text-white/90">{moodLabel}</span>
          </span>
        </div>
      </header>

      <div className="-mt-4 space-y-5 px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/mindora-score"
            className="flex min-w-[9.5rem] shrink-0 flex-col rounded-[var(--radius-xl)] bg-[var(--color-accent-green-light)] p-4 ring-1 ring-[var(--color-accent-green)]/30"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-green)]">
              Mindora Score
            </span>
            <span className="mt-1 text-3xl font-bold text-[var(--color-primary)]">{score}</span>
            <span className="text-xs text-[var(--color-text-secondary)]">Mentally Stable</span>
          </Link>
          <Link
            to="/mood"
            className="flex min-w-[9.5rem] shrink-0 flex-col rounded-[var(--radius-xl)] bg-[var(--color-accent-orange-light)] p-4 ring-1 ring-[var(--color-accent-orange)]/25"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-orange)]">
              Mood
            </span>
            <div className="mt-2 flex items-center gap-2">
              <MoodEmoji mood="sad" size={36} />
              <BarChart3 className="h-8 w-8 text-[var(--color-accent-orange)]" strokeWidth={1.5} />
            </div>
            <span className="mt-1 text-xs text-[var(--color-text-secondary)]">Weekly view</span>
          </Link>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Mindful Tracker</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TrackerCard
              to="/mindful"
              icon={<Sparkles className="h-5 w-5 text-[var(--color-accent-green)]" />}
              title="Mindful Hours"
              value="2.5h Today"
              accent="bg-[var(--color-accent-green-light)]"
            />
            <TrackerCard
              to="/sleep"
              icon={<Moon className="h-5 w-5 text-[var(--color-accent-purple)]" />}
              title="Sleep Quality"
              value="Insomniac"
              sub="REM 7.8h"
              accent="bg-[#ede8f5]"
            />
            <TrackerCard
              to="/journal"
              icon={<BookOpen className="h-5 w-5 text-[var(--color-primary)]" />}
              title="Mindful Journal"
              value="64 Day Streak"
              accent="bg-[var(--color-bg-secondary)]"
            />
            <TrackerCard
              to="/stress"
              icon={<Brain className="h-5 w-5 text-[var(--color-accent-orange)]" />}
              title="Stress Level"
              value="Level 2"
              sub="(Normal)"
              accent="bg-[var(--color-accent-orange-light)]"
            />
            <TrackerCard
              to="/mood"
              icon={<Heart className="h-5 w-5 text-[var(--color-danger)]" />}
              title="Mood Tracker"
              value="Today"
              extra={
                <div className="mt-2 flex gap-1">
                  {(["sad", "happy", "neutral"] as const).map((m) => (
                    <MoodEmoji key={m} mood={m} size={26} />
                  ))}
                </div>
              }
              accent="bg-[var(--color-surface)]"
            />
          </div>
        </section>

        <Link
          to="/chatbot"
          className="flex items-stretch gap-3 overflow-hidden rounded-[var(--radius-xl)] bg-[#3d3d3d] p-4 text-left text-white shadow-[var(--shadow-md)]"
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="text-xs text-white/60">AI Therapy Chatbot</p>
            <p className="mt-1 text-lg font-bold">2,541</p>
            <p className="text-xs text-white/70">Conversations</p>
            <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
              Go Pro Now
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
          <div className="flex w-24 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-white/10 text-4xl">
            🤖
          </div>
        </Link>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--color-primary)]">Mindful Resources</h2>
            <Link to="/resources" className="text-xs font-semibold text-[var(--color-accent-green)]">
              See all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ARTICLES.map((a) => (
              <Link
                key={a.id}
                to={`/resources/article/${a.id}`}
                className="min-w-[11rem] max-w-[11rem] shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]"
              >
                <div className="h-24 bg-gradient-to-br from-[var(--color-accent-green-light)] to-[var(--color-bg-secondary)]" />
                <div className="p-3">
                  <span className="text-[10px] font-semibold uppercase text-[var(--color-accent-green)]">
                    {a.tag}
                  </span>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-[var(--color-text-primary)]">
                    {a.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TrackerCard({
  to,
  icon,
  title,
  value,
  sub,
  extra,
  accent,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  value: string;
  sub?: string;
  extra?: ReactNode;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-w-[10.5rem] max-w-[10.5rem] shrink-0 flex-col rounded-[var(--radius-xl)] p-4 shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]",
        accent,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">
          {title}
        </span>
        {icon}
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--color-primary)]">{value}</p>
      {sub ? <p className="text-xs text-[var(--color-text-muted)]">{sub}</p> : null}
      {title === "Mindful Hours" ? (
        <div className="mt-3 h-8 w-full rounded-md bg-white/60">
          <svg viewBox="0 0 100 32" className="h-full w-full text-[var(--color-accent-green)]" preserveAspectRatio="none">
            <path
              d="M0 24 Q25 8 50 18 T100 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : null}
      {title === "Sleep Quality" ? (
        <div className="mt-3 flex justify-center">
          <ProgressRing value={0.35} size={56} stroke={5} progressColor="var(--color-accent-purple)" />
        </div>
      ) : null}
      {title === "Mindful Journal" ? (
        <div className="mt-3 grid grid-cols-7 gap-0.5">
          {Array.from({ length: 21 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "aspect-square rounded-[2px]",
                i % 4 === 0 ? "bg-[var(--color-accent-green)]" : "bg-[var(--color-border)]",
              )}
            />
          ))}
        </div>
      ) : null}
      {title === "Stress Level" ? (
        <div className="mt-3 flex h-10 items-end gap-1">
          {[8, 14, 11, 6, 4].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-[var(--color-accent-orange)]/85"
              style={{ height: `${h * 2}px` }}
            />
          ))}
        </div>
      ) : null}
      {extra}
      <ChevronRight className="mt-2 h-4 w-4 self-end text-[var(--color-text-muted)]" />
    </Link>
  );
}
