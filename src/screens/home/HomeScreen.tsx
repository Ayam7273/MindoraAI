import { format } from "date-fns";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
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
import { ARTICLES as ALL_ARTICLES } from "@/lib/articles";

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
    currentMood === "depressed" ? "Depressed"
    : currentMood === "sad" ? "Sad"
    : currentMood === "neutral" ? "Neutral"
    : currentMood === "happy" ? "Happy"
    : "Overjoyed";

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const affirmation = AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
  const ARTICLES = ALL_ARTICLES.slice(0, 4);

  const sharedHeader = (
    <header className="bg-[#3B2A1A] px-4 pb-6 pt-2 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
            {displayName.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{greeting}, {displayName}!</p>
            <p className="text-xs text-white/70">{today}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <MoodEmoji mood={currentMood} size={20} />
        <span className="text-xs text-white/80">{moodLabel}</span>
      </div>
    </header>
  );

  return (
    <div className="home-root min-h-dvh bg-[#FAF8F4]">

      {/* ══════════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
      ══════════════════════════════════════════════════ */}
      <div className="w-full overflow-x-hidden lg:hidden">
        {sharedHeader}

        {/* home-mobile-content: padded container; CSS overrides at 999px / 500px */}
        <div className="home-mobile-content w-full space-y-4 pb-28 pt-3">
          <CrisisBanner compact />

          {/* Affirmation — same component as desktop */}
          <DailyAffirmation text={affirmation} />

          {/* Mood check-in */}
          <button
            type="button"
            onClick={() => navigate("/mood/set")}
            className="home-checkin w-full rounded-2xl bg-[var(--color-accent-orange)] px-4 py-4 text-left text-white shadow-md transition-transform active:scale-[0.98]"
          >
            <p className="home-checkin-label text-xs font-semibold text-white/75">Daily Check-in</p>
            <p className="home-checkin-title mt-0.5 break-words text-base font-bold">How are you feeling today?</p>
            <p className="home-checkin-hint mt-0.5 text-xs text-white/65">Tap to log your mood</p>
          </button>

          {/* Score + Mood — stacked vertically; CSS enforces flex-col at 999px */}
          <div className="home-score-grid flex w-full flex-col gap-3">
            <Link
              to="/mindora-score"
              className="home-score-card flex w-full flex-row items-center justify-between rounded-2xl bg-[var(--color-accent-green-light)] px-5 py-4 ring-1 ring-[var(--color-accent-green)]/30"
            >
              <div>
                <span className="home-score-label text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
                  Mindora Score
                </span>
                <p className="home-score-value mt-1 text-3xl font-bold text-[var(--color-primary)]">{score}</p>
                <span className="home-score-sublabel text-xs text-[var(--color-text-secondary)]">Mentally Stable</span>
              </div>
              <div className="home-score-icon-wrap flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-green)]/10">
                <BarChart3 className="h-7 w-7 text-[var(--color-accent-green)]" strokeWidth={1.5} />
              </div>
            </Link>

            <Link
              to="/mood"
              className="home-mood-card flex w-full flex-row items-center justify-between rounded-2xl bg-[var(--color-accent-orange-light)] px-5 py-4 ring-1 ring-[var(--color-accent-orange)]/25"
            >
              <div>
                <span className="home-score-label text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-orange)]">
                  Current Mood
                </span>
                <p className="mt-1 text-base font-bold text-[var(--color-primary)]">{moodLabel}</p>
                <span className="text-xs text-[var(--color-text-secondary)]">Tap to view weekly</span>
              </div>
              <MoodEmoji mood={currentMood} size={48} className="shrink-0" />
            </Link>
          </div>

          {/* Quick Access — 2×2 grid; CSS enforces grid-template-columns at 999px */}
          <section>
            <p className="home-section-heading mb-3 text-xs font-bold text-[var(--color-primary)]">Quick Access</p>
            <div className="home-quick-grid grid w-full grid-cols-2 gap-3">
              {[
                { to: "/chatbot",      icon: <Bot      className="h-7 w-7 text-white"                         strokeWidth={1.75} />, label: "AI Chat",  bg: "bg-[#3d3d3d]",                      text: "text-white" },
                { to: "/journal",      icon: <BookOpen className="h-7 w-7 text-[var(--color-accent-green)]"   strokeWidth={1.75} />, label: "Journal",  bg: "bg-[var(--color-accent-green-light)]", text: "text-[var(--color-primary)]" },
                { to: "/mindful/exercise", icon: <Wind className="h-7 w-7 text-blue-500"                       strokeWidth={1.75} />, label: "Breathe",  bg: "bg-[#e8f4fd]",                      text: "text-[var(--color-primary)]" },
                { to: "/mindora-score",icon: <BarChart3 className="h-7 w-7 text-[var(--color-accent-orange)]" strokeWidth={1.75} />, label: "Progress", bg: "bg-[var(--color-accent-orange-light)]", text: "text-[var(--color-primary)]" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn("home-quick-card flex flex-col items-center justify-center gap-2 rounded-2xl py-5 shadow-sm", item.bg)}
                >
                  {item.icon}
                  <span className={cn("home-quick-label text-sm font-semibold", item.text)}>{item.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Mindful Tracker — horizontal scroll; min-width enforced by CSS at 999px & 500px */}
          <section>
            <p className="home-section-heading mb-3 text-xs font-bold text-[var(--color-primary)]">Mindful Tracker</p>
            <div className="home-tracker-scroll flex flex-row gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { to: "/mindful",           icon: <Sparkles  className="h-5 w-5 text-[var(--color-accent-green)]"   />, label: "Mindful Hours", value: "Today",     bg: "bg-[var(--color-accent-green-light)]" },
                { to: "/sleep",             icon: <Moon      className="h-5 w-5 text-[var(--color-accent-purple)]"  />, label: "Sleep Quality",  value: "Quality",   bg: "bg-[#ede8f5]" },
                { to: "/journal",           icon: <BookOpen  className="h-5 w-5 text-[var(--color-primary)]"        />, label: "Journal",        value: "Streak",    bg: "bg-[var(--color-bg-secondary)]" },
                { to: "/stress",            icon: <Brain     className="h-5 w-5 text-[var(--color-accent-orange)]"  />, label: "Stress Level",   value: "Level 2",   bg: "bg-[var(--color-accent-orange-light)]" },
                { to: "/mood",              icon: <Heart     className="h-5 w-5 text-[var(--color-danger)]"         />, label: "Mood Tracker",   value: "Today",     bg: "bg-[var(--color-surface)]" },
                { to: "/mindful/exercise",  icon: <Wind      className="h-5 w-5 text-blue-400"                      />, label: "Breathing",      value: "Exercises", bg: "bg-[#e8f4fd]" },
              ].map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  className={cn("home-tracker-card flex shrink-0 flex-col rounded-2xl ring-1 ring-[var(--color-border)] shadow-sm", item.bg)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="home-tracker-label text-[10px] font-bold uppercase leading-tight tracking-wide text-[var(--color-text-secondary)]">
                      {item.label}
                    </span>
                    {item.icon}
                  </div>
                  <p className="home-tracker-value mt-2 text-base font-bold text-[var(--color-primary)]">{item.value}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Mindful Resources — horizontal scroll; min-width enforced by CSS at 999px & 500px */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="home-section-heading text-xs font-bold text-[var(--color-primary)]">Mindful Resources</p>
              <Link to="/resources" className="text-xs font-semibold text-[var(--color-accent-green)]">See all</Link>
            </div>
            <div className="home-resources-scroll flex flex-row gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ARTICLES.map((a) => (
                <Link
                  key={a.id}
                  to={`/resources/article/${a.id}`}
                  className="home-resource-card shrink-0 overflow-hidden bg-white shadow-sm ring-1 ring-[var(--color-border)]"
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="home-resource-image h-28 w-full object-cover"
                  />
                  <div className="home-resource-body p-3">
                    <span className="home-resource-category text-[10px] font-bold uppercase text-[var(--color-accent-green)]">{a.category}</span>
                    <p className="home-resource-title mt-1 line-clamp-2 text-xs font-semibold leading-snug text-[var(--color-text-primary)]">{a.title}</p>
                    <p className="home-resource-read-time mt-1 text-[10px] text-[var(--color-text-muted)]">{a.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below lg)
      ══════════════════════════════════════════════════ */}
      <div className="hidden min-h-dvh flex-col lg:flex">
        {/* Desktop header — wider padding */}
        <header className="bg-[#3B2A1A] px-8 pb-6 pt-3 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                {displayName.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{greeting}, {displayName}!</p>
                <p className="text-xs text-white/70">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs">
                <MoodEmoji mood={currentMood} size={20} />
                <span className="text-white/90">{moodLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        {/* Desktop two-column body */}
        <div className="grid flex-1 grid-cols-[1fr_380px] gap-8 px-8 py-6">

          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <CrisisBanner compact />
            <DailyAffirmation text={affirmation} />

            {/* Mood check-in */}
            <button
              type="button"
              onClick={() => navigate("/mood/set")}
              className="w-full rounded-[var(--radius-xl)] bg-[var(--color-accent-orange)] px-6 py-5 text-left text-white shadow-[var(--shadow-md)] transition-transform active:scale-[0.98]"
            >
              <p className="text-sm font-semibold text-white/80">Daily Check-in</p>
              <p className="mt-1 text-xl font-bold">How are you feeling today?</p>
              <p className="mt-1 text-xs text-white/70">Tap to log your mood</p>
            </button>

            {/* Score + Mood */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/mindora-score" className="flex flex-col rounded-[var(--radius-xl)] bg-[var(--color-accent-green-light)] p-5 ring-1 ring-[var(--color-accent-green)]/30">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-green)]">Mindora Score</span>
                <span className="mt-1 text-4xl font-bold text-[var(--color-primary)]">{score}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Mentally Stable</span>
              </Link>
              <Link to="/mood" className="flex flex-col rounded-[var(--radius-xl)] bg-[var(--color-accent-orange-light)] p-5 ring-1 ring-[var(--color-accent-orange)]/25">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-orange)]">Mood</span>
                <div className="mt-2 flex items-center gap-2">
                  <MoodEmoji mood={currentMood} size={40} />
                  <BarChart3 className="h-9 w-9 text-[var(--color-accent-orange)]" strokeWidth={1.5} />
                </div>
                <span className="mt-1 text-xs text-[var(--color-text-secondary)]">Weekly view</span>
              </Link>
            </div>

            {/* Quick access — 4 columns */}
            <section>
              <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Quick Access</h2>
              <div className="grid grid-cols-4 gap-3">
                <DesktopQuickCard to="/chatbot" icon={<Bot className="h-7 w-7 text-white" strokeWidth={1.75} />} label="AI Chat" color="bg-[#3d3d3d]" textColor="text-white" />
                <DesktopQuickCard to="/journal" icon={<BookOpen className="h-7 w-7 text-[var(--color-accent-green)]" strokeWidth={1.75} />} label="Journal" color="bg-[var(--color-accent-green-light)]" textColor="text-[var(--color-primary)]" />
                <DesktopQuickCard to="/mindful/exercise" icon={<Wind className="h-7 w-7 text-blue-500" strokeWidth={1.75} />} label="Breathe" color="bg-[#e8f4fd]" textColor="text-[var(--color-primary)]" />
                <DesktopQuickCard to="/mindora-score" icon={<BarChart3 className="h-7 w-7 text-[var(--color-accent-orange)]" strokeWidth={1.75} />} label="Progress" color="bg-[var(--color-accent-orange-light)]" textColor="text-[var(--color-primary)]" />
              </div>
            </section>

            {/* Mindful Tracker — horizontal scroll on desktop too */}
            <section>
              <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Mindful Tracker</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <DesktopTrackerCard to="/mindful" icon={<Sparkles className="h-5 w-5 text-[var(--color-accent-green)]" />} title="Mindful Hours" value="2.5h Today" accent="bg-[var(--color-accent-green-light)]">
                  <div className="mt-3 h-8 w-full rounded-md bg-white/60">
                    <svg viewBox="0 0 100 32" className="h-full w-full text-[var(--color-accent-green)]" preserveAspectRatio="none">
                      <path d="M0 24 Q25 8 50 18 T100 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </DesktopTrackerCard>
                <DesktopTrackerCard to="/sleep" icon={<Moon className="h-5 w-5 text-[var(--color-accent-purple)]" />} title="Sleep Quality" value="Insomniac" sub="REM 7.8h" accent="bg-[#ede8f5]">
                  <div className="mt-3 flex justify-center">
                    <ProgressRing value={0.35} size={56} stroke={5} progressColor="var(--color-accent-purple)" />
                  </div>
                </DesktopTrackerCard>
                <DesktopTrackerCard to="/journal" icon={<BookOpen className="h-5 w-5 text-[var(--color-primary)]" />} title="Mindful Journal" value="Streak" accent="bg-[var(--color-bg-secondary)]">
                  <div className="mt-3 grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 21 }).map((_, i) => (
                      <span key={i} className={cn("aspect-square rounded-[2px]", i % 4 === 0 ? "bg-[var(--color-accent-green)]" : "bg-[var(--color-border)]")} />
                    ))}
                  </div>
                </DesktopTrackerCard>
                <DesktopTrackerCard to="/stress" icon={<Brain className="h-5 w-5 text-[var(--color-accent-orange)]" />} title="Stress Level" value="Level 2" sub="(Normal)" accent="bg-[var(--color-accent-orange-light)]">
                  <div className="mt-3 flex h-10 items-end gap-1">
                    {[8, 14, 11, 6, 4].map((h, i) => (
                      <span key={i} className="flex-1 rounded-full bg-[var(--color-accent-orange)]/85" style={{ height: `${h * 2}px` }} />
                    ))}
                  </div>
                </DesktopTrackerCard>
                <DesktopTrackerCard to="/mood" icon={<Heart className="h-5 w-5 text-[var(--color-danger)]" />} title="Mood Tracker" value="Today" accent="bg-[var(--color-surface)]">
                  <div className="mt-2 flex gap-1">
                    {(["sad", "happy", "neutral"] as const).map((m) => <MoodEmoji key={m} mood={m} size={26} />)}
                  </div>
                </DesktopTrackerCard>
                <DesktopTrackerCard to="/mindful/exercise" icon={<Wind className="h-5 w-5 text-blue-400" />} title="Breathing" value="Exercises" accent="bg-[#e8f4fd]" />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Mindful Resources — vertical cards with real images */}
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
                    className="flex overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[var(--color-bg-secondary)]">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center px-3 py-2">
                      <span className="text-[10px] font-bold uppercase text-[var(--color-accent-green)]">{a.category}</span>
                      <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[var(--color-text-primary)]">{a.title}</p>
                      <span className="mt-1 text-[10px] text-[var(--color-text-muted)]">{a.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Today at a Glance */}
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
                      {icon}{label}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desktop-only subcomponents ── */
function DesktopQuickCard({ to, icon, label, color, textColor }: { to: string; icon: ReactNode; label: string; color: string; textColor: string }) {
  return (
    <Link to={to} className={cn("flex flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] py-5 shadow-[var(--shadow-sm)] transition-transform active:scale-[0.97]", color)}>
      {icon}
      <span className={cn("text-xs font-semibold", textColor)}>{label}</span>
    </Link>
  );
}

function DesktopTrackerCard({ to, icon, title, value, sub, accent, children }: {
  to: string; icon: ReactNode; title: string; value: string; sub?: string; accent: string; children?: ReactNode;
}) {
  return (
    <Link to={to} className={cn("flex min-w-[10.5rem] max-w-[10.5rem] shrink-0 flex-col rounded-[var(--radius-xl)] p-4 shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]", accent)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">{title}</span>
        {icon}
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--color-primary)]">{value}</p>
      {sub && <p className="text-xs text-[var(--color-text-muted)]">{sub}</p>}
      {children}
    </Link>
  );
}
