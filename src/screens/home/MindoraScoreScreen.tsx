import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { BookOpen, ChevronLeft, Flame, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MindoraScoreBadge } from "@/components/ui/MindoraScoreBadge";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { getMoodEntries, getMoodTrend } from "@/lib/moodStorage";
import { getJournalStreak } from "@/lib/journalStorage";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";
import { cn } from "@/lib/utils";

const MOOD_SCORE: Record<MoodKey, number> = {
  depressed: 1,
  sad: 2,
  neutral: 3,
  happy: 4,
  overjoyed: 5,
};

const MOOD_COLOR: Record<MoodKey, string> = {
  depressed: "bg-[var(--mood-depressed)]",
  sad: "bg-[var(--mood-sad)]",
  neutral: "bg-[var(--mood-neutral)]",
  happy: "bg-[var(--mood-happy)]",
  overjoyed: "bg-[var(--mood-overjoyed)]",
};

export function MindoraScoreScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { score } = useMindoraScore(userId);

  const moodEntries = useMemo(() => getMoodEntries(), []);
  const journalStreak = useMemo(() => getJournalStreak(), []);
  const trend = useMemo(() => getMoodTrend(), []);

  const status = useMemo(() => {
    if (score >= 70) return "Mentally Stable";
    if (score >= 45) return "Needs Attention";
    return "Seek Support";
  }, [score]);

  // Last 7 mood entries for display
  const recentMoods = moodEntries.slice(0, 7);

  // Average mood score over last 7 days
  const avgMood =
    recentMoods.length > 0
      ? (recentMoods.reduce((s, e) => s + MOOD_SCORE[e.mood], 0) / recentMoods.length).toFixed(1)
      : null;

  // Check-in streak (consecutive days with mood entry)
  const moodStreak = useMemo(() => {
    if (!moodEntries.length) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = subDays(today, i);
      const dateStr = d.toISOString().slice(0, 10);
      const hasEntry = moodEntries.some((e) => e.timestamp.startsWith(dateStr));
      if (!hasEntry) break;
      streak++;
    }
    return streak;
  }, [moodEntries]);

  // 28-day mood heatmap
  const heatmap = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 28 }, (_, i) => {
      const d = subDays(today, 27 - i);
      const dateStr = d.toISOString().slice(0, 10);
      const entry = moodEntries.find((e) => e.timestamp.startsWith(dateStr));
      return { date: d, mood: entry?.mood ?? null };
    });
  }, [moodEntries]);

  const trendLabel =
    trend === "up"
      ? "📈 You've been feeling better recently"
      : trend === "down"
        ? "📉 You've had some tough days lately"
        : trend === "stable"
          ? "➡️ Your mood has been steady"
          : null;

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="relative overflow-hidden bg-[#d8e8cc] px-4 pb-8 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(107,143,71,0.35) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-[var(--color-primary)]"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="relative mt-6 flex flex-col items-center">
          <span className="text-6xl font-bold tabular-nums text-white drop-shadow-sm">{score}</span>
          <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">{status}</p>
        </div>
      </header>

      <div className="-mt-4 space-y-4 rounded-t-[var(--radius-xl)] bg-[#FAF8F4] px-4 pb-6 pt-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            value={`${moodStreak}d`}
            label="Check-in streak"
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={1.75} />}
            value={`${journalStreak}d`}
            label="Journal streak"
          />
          <StatCard
            icon={<Smile className="h-5 w-5 text-[var(--color-text-secondary)]" strokeWidth={1.75} />}
            value={avgMood ?? "–"}
            label="Avg mood (7d)"
          />
        </div>

        {/* Trend */}
        {trendLabel && (
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-accent-green-light)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--color-accent-green)]">{trendLabel}</p>
          </div>
        )}

        {/* 28-day mood heatmap */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">
            Mood Calendar (28 days)
          </h2>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-7 gap-1">
              {heatmap.map(({ date, mood }, i) => (
                <div
                  key={i}
                  title={`${format(date, "MMM d")}${mood ? ` — ${mood}` : ""}`}
                  className={cn(
                    "aspect-square rounded-sm",
                    mood ? MOOD_COLOR[mood] : "bg-[var(--color-border)]",
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.entries(MOOD_COLOR) as [MoodKey, string][]).map(([m, c]) => (
                <span key={m} className="flex items-center gap-1">
                  <span className={cn("h-2.5 w-2.5 rounded-sm", c)} />
                  <span className="text-[10px] capitalize text-[var(--color-text-muted)]">{m}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recent mood entries */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Recent moods</h2>
          {recentMoods.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">No mood entries yet.</p>
              <Button
                type="button"
                className="rounded-full"
                onClick={() => navigate("/mood/set")}
              >
                Log your first mood
              </Button>
            </div>
          ) : (
            <ul className="space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-sm)]">
              {recentMoods.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5"
                >
                  <MoodEmoji mood={entry.mood} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {format(new Date(entry.timestamp), "EEE, MMM d · h:mm a")}
                    </p>
                    <p className="text-sm capitalize text-[var(--color-text-primary)]">
                      {entry.mood}
                    </p>
                  </div>
                  <MindoraScoreBadge score={MOOD_SCORE[entry.mood] * 20} size={36} stroke={3} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <Button
          type="button"
          fullWidth
          className="rounded-full"
          onClick={() => navigate("/mindora-score/suggestions")}
        >
          Get AI Suggestions
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center shadow-[var(--shadow-sm)]">
      {icon}
      <p className="text-lg font-bold text-[var(--color-primary)]">{value}</p>
      <p className="text-[10px] text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
