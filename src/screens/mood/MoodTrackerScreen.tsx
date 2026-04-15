import { format } from "date-fns";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { StatusBar } from "@/components/ui/StatusBar";
import { useFreudScore } from "@/hooks/useFreudScore";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

const MOODS: MoodKey[] = ["depressed", "sad", "neutral", "happy", "overjoyed"];
const WEEK = [0.35, 0.55, 0.45, 0.7, 0.5, 0.65, 0.4];

const BG: Record<MoodKey, string> = {
  depressed: "var(--mood-depressed)",
  sad: "var(--mood-sad)",
  neutral: "var(--mood-neutral)",
  happy: "var(--mood-happy)",
  overjoyed: "var(--mood-overjoyed)",
};

const LABEL: Record<MoodKey, string> = {
  depressed: "Depressed",
  sad: "Sad",
  neutral: "Neutral",
  happy: "Happy",
  overjoyed: "Overjoyed",
};

export function MoodTrackerScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { mood: currentMood } = useFreudScore(userId);

  return (
    <div className="min-h-dvh" style={{ background: BG[currentMood] }}>
      <StatusBar />
      <header className="flex items-center px-2 py-1 text-[#3B2A1A]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/30"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
      </header>

      <div className="flex flex-col items-center px-6 pb-8 pt-4 text-center text-[#1A1208]">
        <MoodEmoji mood={currentMood} size={120} className="shadow-lg ring-4 ring-white/40" />
        <h1 className="mt-6 text-3xl font-bold">{LABEL[currentMood]}</h1>
        <p className="mt-2 text-sm text-black/60">Updated {format(new Date(), "h:mm a")}</p>
      </div>

      <div className="rounded-t-[var(--radius-xl)] bg-[#FAF8F4] px-4 pb-28 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--color-primary)]">Mood Statistics</h2>
          <button
            type="button"
            className="text-xs font-semibold text-[var(--color-accent-green)]"
            onClick={() => navigate("/mood/history")}
          >
            History →
          </button>
        </div>
        <div className="flex h-40 items-end justify-between gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]">
          {WEEK.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full max-w-8 rounded-md bg-gradient-to-t from-[var(--color-accent-orange)] to-[var(--color-accent-green)]"
                style={{ height: `${h * 100}%` }}
              />
              <MoodEmoji mood={MOODS[i % MOODS.length]} size={22} />
            </div>
          ))}
        </div>

        <Button
          type="button"
          fullWidth
          className="mt-8 rounded-full"
          onClick={() => navigate("/mood/set")}
        >
          How are you feeling? Set mood →
        </Button>
        <Button
          type="button"
          fullWidth
          variant="secondary"
          className="mt-3 rounded-full"
          onClick={() => navigate("/mood/suggestions")}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI suggestions for mood
          </span>
        </Button>
      </div>
    </div>
  );
}
