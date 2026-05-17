import { format } from "date-fns";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  ChevronRight,
  Heart,
  Moon,
  Search,
  Sparkles,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { useUiStore } from "@/store/uiStore";
import { DailyAffirmation } from "@/components/ui/DailyAffirmation";
import { CrisisBanner } from "@/components/ui/CrisisBanner";

const AFFIRMATIONS = [
  "You are stronger than you think.",
  "It's okay to take things one step at a time.",
  "Your feelings are valid.",
  "You deserve kindness — especially from yourself.",
  "Progress, not perfection.",
  "Taking care of your mind is a brave act.",
  "You are not alone in this.",
  "Small steps forward still count as progress.",
  "Rest is productive too.",
  "You are enough, exactly as you are.",
  "Healing is not linear — and that's okay.",
  "Your presence matters to the people around you.",
  "It's okay to ask for help.",
  "Every day is a new chance to begin again.",
  "You have overcome hard things before.",
  "Breathing is always available to you.",
  "Your mental health is worth prioritizing.",
  "Today, you showed up. That matters.",
  "Gentleness with yourself is strength.",
  "You are worthy of support and care.",
  "Growth happens at your own pace.",
  "It's okay to not be okay.",
  "You are doing better than you think.",
  "Even on hard days, you are not defined by them.",
  "One moment at a time is enough.",
  "Your feelings will pass — you will get through this.",
  "There is hope, even when it's hard to see.",
  "You are resilient.",
  "Asking for what you need is courageous.",
  "You matter.",
];

export function HomeScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const displayName = useUiStore((s) => s.profile?.full_name ?? "Friend");
  const { score, mood: currentMood } = useMindoraScore(userId);
  const today = format(new Date(), "EEEE, MMM d");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const affirmation = AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];

  const ARTICLES = [
    { id: "1", title: "Will meditation help you escape the rat race?", tag: "Mindfulness" },
    { id: "2", title: "Sleep hygiene in 10 minutes a day", tag: "Sleep" },
    { id: "3", title: "Understanding anxiety spirals", tag: "Stress" },
  ];

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-4">
      {/* ── HEADER ── */}
      <header className="bg-[#3B2A1A] px-4 pb-6 pt-2 text-white lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              {displayName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{greeting}, {displayName}!</p>
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
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs">
            <MoodEmoji mood={currentMood} size={22} />
            <span className="text-white/90">{moodLabel}</span>
          </span>
        </div>
      </header>

      {/* ── MOBILE: single column / DESKTOP: two-column grid ── */}
      <div className="-mt-4 px-4 lg:px-8 lg:mt-0 lg:pt-6">
        {/* Desktop two-column layout */}
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-5">
            <CrisisBanner compact />
            <DailyAffirmation text={affirmation} />

            {/* Mood check-in CTA */}
            <button
              type="button"
              onClick={() => navigate("/mood/set")}
              className="w-full rounded-[var(--radius-xl)] bg-[var(--color-accent-orange)] px-5 py-4 text-left text-white shadow-[var(--shadow-md)] transition-transform active:scale-[0.98]"
            >
              <p className="text-sm font-semibold text-white/80">Daily Check-in</p>
              <p className="mt-1 text-lg font-bold">How are you feeling today?</p>
              <p className="mt-1 text-xs text-white/70">Tap to log your mood →</p>
            </button>

            {/* Score + Mood stat cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2">
              <Link
                to="/mindora-score"
                className="flex flex-col rounded-[var(--radius-xl)] bg-[var(--color-accent-green-light)] p-4 ring-1 ring-[var(--color-accent-green)]/30"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-green)]">Mindora Score</span>
                <span className="mt-1 text-3xl font-bold text-[var(--color-primary)]">{score}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Mentally Stable</span>
              </Link>
              <Link
                to="/mood"
                className="flex flex-col rounded-[var(--radius-xl)] bg-[var(--color-accent-orange-light)] p-4 ring-1 ring-[var(--color-accent-orange)]/25"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent-orange)]">Mood</span>
                <div className="mt-2 flex items-center gap-2">
                  <MoodEmoji mood={currentMood} size={36} />
                  <BarChart3 className="h-8 w-8 text-[var(--color-accent-orange)]" strokeWidth={1.5} />
                </div>
                <span className="mt-1 text-xs text-[var(--color-text-secondary)]">Weekly view</span>
              </Link>
            </div>

            {/* Quick access */}
            <section>
              <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
                <QuickCard to="/chatbot" icon={<Bot className="h-6 w-6 text-white" strokeWidth={1.75} />} label="AI Chat" color="bg-[#3d3d3d]" textColor="text-white" />
                <QuickCard to="/journal" icon={<BookOpen className="h-6 w-6 text-[var(--color-accent-green)]" strokeWidth={1.75} />} label="Journal" color="bg-[var(--color-accent-green-light)]" textColor="text-[var(--color-primary)]" />
                <QuickCard to="/mindful/exercise" icon={<Wind className="h-6 w-6 text-blue-500" strokeWidth={1.75} />} label="Breathe" color="bg-[#e8f4fd]" textColor="text-[var(--color-primary)]" />
                <QuickCard to="/mindora-score" icon={<BarChart3 className="h-6 w-6 text-[var(--color-accent-orange)]" strokeWidth={1.75} />} label="Progress" color="bg-[var(--color-accent-orange-light)]" textColor="text-[var(--color-primary)]" />
              </div>
            </section>

            {/* Mindful Tracker — horizontal scroll on mobile, grid on desktop */}
            <section>
              <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Mindful Tracker</h2>
              <div className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-3 lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <TrackerCard to="/mindful" icon={<Sparkles className="h-5 w-5 text-[var(--color-accent-green)]" />} title="Mindful Hours" value="2.5h Today" accent="bg-[var(--color-accent-green-light)]" />
                <TrackerCard to="/sleep" icon={<Moon className="h-5 w-5 text-[var(--color-accent-purple)]" />} title="Sleep Quality" value="Insomniac" sub="REM 7.8h" accent="bg-[#ede8f5]" />
                <TrackerCard to="/journal" icon={<BookOpen className="h-5 w-5 text-[var(--color-primary)]" />} title="Mindful Journal" value="Streak" accent="bg-[var(--color-bg-secondary)]" />
                <TrackerCard to="/stress" icon={<Brain className="h-5 w-5 text-[var(--color-accent-orange)]" />} title="Stress Level" value="Level 2" sub="(Normal)" accent="bg-[var(--color-accent-orange-light)]" />
                <TrackerCard to="/mood" icon={<Heart className="h-5 w-5 text-[var(--color-danger)]" />} title="Mood Tracker" value="Today" extra={<div className="mt-2 flex gap-1">{(["sad", "happy", "neutral"] as const).map((m) => <MoodEmoji key={m} mood={m} size={26} />)}</div>} accent="bg-[var(--color-surface)]" />
                <TrackerCard to="/mindful/exercise" icon={<Wind className="h-5 w-5 text-blue-400" />} title="Breathing" value="Exercises" accent="bg-[#e8f4fd]" />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN — desktop only sidebar panel */}
          <div className="hidden space-y-5 lg:block">
            {/* Mindful Resources — vertical list on desktop */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--color-primary)]">Mindful Resources</h2>
                <Link to="/resources" className="text-xs font-semibold text-[var(--color-accent-green)]">See all</Link>
              </div>
              <div className="space-y-3">
                {ARTICLES.map((a) => (
                  <Link
                    key={a.id}
                    to={`/resources/article/${a.id}`}
                    className="flex gap-3 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]"
                  >
                    <div className="h-20 w-20 shrink-0 bg-gradient-to-br from-[var(--color-accent-green-light)] to-[var(--color-bg-secondary)]" />
                    <div className="flex flex-col justify-center py-2 pr-3">
                      <span className="text-[10px] font-semibold uppercase text-[var(--color-accent-green)]">{a.tag}</span>
                      <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[var(--color-text-primary)]">{a.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Desktop quick stats panel */}
            <section className="rounded-[var(--radius-xl)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]">
              <h2 className="mb-4 text-sm font-bold text-[var(--color-primary)]">Today at a Glance</h2>
              <div className="space-y-3">
                {[
                  { icon: <Sparkles className="h-4 w-4 text-[var(--color-accent-green)]" />, label: "Mindful Hours", value: "2.5h" },
                  { icon: <Moon className="h-4 w-4 text-[var(--color-accent-purple)]" />, label: "Sleep", value: "7.8h" },
                  { icon: <Brain className="h-4 w-4 text-[var(--color-accent-orange)]" />, label: "Stress Level", value: "2 / 10" },
                  { icon: <Heart className="h-4 w-4 text-[var(--color-danger)]" />, label: "Mood", value: moodLabel },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      {icon}
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Resources — mobile only, horizontal scroll */}
        <section className="mt-5 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--color-primary)]">Mindful Resources</h2>
            <Link to="/resources" className="text-xs font-semibold text-[var(--color-accent-green)]">See all</Link>
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
                  <span className="text-[10px] font-semibold uppercase text-[var(--color-accent-green)]">{a.tag}</span>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-[var(--color-text-primary)]">{a.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickCard({
  to,
  icon,
  label,
  color,
  textColor,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] p-4 shadow-[var(--shadow-sm)] transition-transform active:scale-[0.97]",
        color,
      )}
    >
      {icon}
      <span className={cn("text-xs font-semibold", textColor)}>{label}</span>
    </Link>
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
