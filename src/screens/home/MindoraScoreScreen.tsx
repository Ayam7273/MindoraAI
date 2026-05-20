import { useMemo } from "react";
import { format } from "date-fns";
import { BookOpen, Brain, ChevronLeft, MessageSquare, Moon, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MindoraScoreBadge } from "@/components/ui/MindoraScoreBadge";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

const MOOD_SCORE: Record<MoodKey, number> = {
  depressed: 1,
  sad: 2,
  neutral: 3,
  happy: 4,
  overjoyed: 5,
};

const BREAKDOWN_ROWS: {
  key: keyof ReturnType<typeof useMindoraScore>["breakdown"];
  label: string;
  weight: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "moodScore",
    label: "Mood",
    weight: "25%",
    icon: <Smile className="h-4 w-4 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
  },
  {
    key: "journalScore",
    label: "Journal",
    weight: "20%",
    icon: <BookOpen className="h-4 w-4 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
  },
  {
    key: "stressScore",
    label: "Stress",
    weight: "20%",
    icon: <Brain className="h-4 w-4 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
  },
  {
    key: "sleepScore",
    label: "Sleep",
    weight: "20%",
    icon: <Moon className="h-4 w-4 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
  },
  {
    key: "chatScore",
    label: "AI Chat",
    weight: "15%",
    icon: <MessageSquare className="h-4 w-4 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
  },
];

export function MindoraScoreScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { score, breakdown } = useMindoraScore(userId);

  const { data: moodEntries = [] } = useMoodEntries(userId);

  const status = useMemo(() => {
    if (score >= 70) return "Mentally Stable";
    if (score >= 45) return "Needs Attention";
    return "Seek Support";
  }, [score]);

  // Last 7 mood entries for display
  const recentMoods = moodEntries.slice(0, 7);

  // Mood trend derived from real Supabase entries
  const trend = useMemo((): "up" | "down" | "stable" | null => {
    if (moodEntries.length < 2) return null;
    const SCORE: Record<MoodKey, number> = { depressed: 1, sad: 2, neutral: 3, happy: 4, overjoyed: 5 };
    const recent = moodEntries.slice(0, 3).map((e) => SCORE[e.mood as MoodKey] ?? 3);
    const older = moodEntries.slice(3, 6).map((e) => SCORE[e.mood as MoodKey] ?? 3);
    if (!older.length) return null;
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    if (recentAvg > olderAvg + 0.3) return "up";
    if (recentAvg < olderAvg - 0.3) return "down";
    return "stable";
  }, [moodEntries]);

  const trendLabel =
    trend === "up"
      ? "You've been feeling better recently"
      : trend === "down"
        ? "You've had some tough days lately"
        : trend === "stable"
          ? "Your mood has been steady"
          : null;

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="relative overflow-hidden bg-[#d8e8cc] px-3 sm:px-4 pb-8 pt-[max(0.5rem,env(safe-area-inset-top))]">
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

      <div className="-mt-4 space-y-4 rounded-t-[var(--radius-xl)] bg-[#FAF8F4] px-3 sm:px-4 pb-6 pt-5">
        {/* Score Breakdown */}
        <section>
          <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Score Breakdown</h2>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] space-y-3">
            {BREAKDOWN_ROWS.map(({ key, label, weight, icon }) => {
              const factorScore = breakdown[key];
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex-shrink-0">{icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">{weight}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                        style={{ width: `${factorScore}%` }}
                      />
                    </div>
                  </div>
                  <span className="flex-shrink-0 w-8 text-right text-xs font-semibold tabular-nums text-[var(--color-primary)]">
                    {factorScore}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trend */}
        {trendLabel && (
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-accent-green-light)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--color-accent-green)]">{trendLabel}</p>
          </div>
        )}


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
                  <MoodEmoji mood={entry.mood as MoodKey} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {format(new Date(entry.created_at), "EEE, MMM d · h:mm a")}
                    </p>
                    <p className="text-sm capitalize text-[var(--color-text-primary)]">
                      {entry.mood}
                    </p>
                  </div>
                  <MindoraScoreBadge score={MOOD_SCORE[entry.mood as MoodKey] * 20} size={36} stroke={3} />
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

