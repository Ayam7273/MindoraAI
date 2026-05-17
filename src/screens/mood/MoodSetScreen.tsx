import { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { useAddMoodEntry } from "@/hooks/useMoodEntries";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { computeMindoraScore } from "@/lib/mindoraScoreModel";
import { hapticSuccess } from "@/lib/haptics";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

const ORDER: MoodKey[] = ["depressed", "sad", "neutral", "happy", "overjoyed"];

const TRACK_COLOR: Record<MoodKey, string> = {
  depressed: "#7B6EC8",
  sad: "#E07A3A",
  neutral: "#8B7355",
  happy: "#F5C842",
  overjoyed: "#5BAD6F",
};

const LABEL: Record<MoodKey, string> = {
  depressed: "Depressed",
  sad: "Sad",
  neutral: "Neutral",
  happy: "Happy",
  overjoyed: "Overjoyed",
};

const AFFIRMATION: Record<MoodKey, string> = {
  depressed: "It takes courage to check in with yourself. You are not alone.",
  sad: "Acknowledging sadness is the first step. Be gentle with yourself today.",
  neutral: "A calm day is still a good day. You showed up — that counts.",
  happy: "Happiness is worth celebrating. Keep noticing what is going well!",
  overjoyed: "Your joy today is real and valid. Savour this moment!",
};

export function MoodSetScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const setActiveMood = useUiStore((s) => s.setActiveMood);
  const addMoodDb = useAddMoodEntry();
  const updateMindora = useUpdateMindoraScore();
  const [index, setIndex] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const mood = ORDER[index];
  const trackColor = TRACK_COLOR[mood];

  const handleSet = async () => {
    setActiveMood(mood);
    hapticSuccess();
    if (userId) {
      try {
        await addMoodDb.mutateAsync({ user_id: userId, mood });
        const score = computeMindoraScore({
          mood,
          sleepHours: 7,
          stressLevel: 2,
          journalStreakDays: 0,
        });
        await updateMindora.mutateAsync({ userId, score, reason: "Mood check-in" });
      } catch {
        // backend unavailable
      }
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div
        className="fixed inset-0 z-[80] flex flex-col items-center justify-center px-6"
        style={{ background: trackColor }}
      >
        <button
          type="button"
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-black/15"
          onClick={() => navigate("/mood", { replace: true })}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        <CheckCircle className="h-20 w-20 text-white" strokeWidth={1.5} />
        <p className="mt-6 text-2xl font-bold text-white">Mood logged: {LABEL[mood]}</p>
        <p className="mt-4 max-w-xs text-center text-sm text-white/80">{AFFIRMATION[mood]}</p>
        <Button
          type="button"
          className="mt-10 w-full max-w-xs rounded-full bg-white text-[#000] hover:bg-white/90"
          onClick={() => navigate("/home", { replace: true })}
        >
          Back to Home
        </Button>
        <button
          type="button"
          className="mt-3 text-xs text-white/70 underline"
          onClick={() => navigate("/mood", { replace: true })}
        >
          View mood history
        </button>
      </div>
    );
  }

  const fillPercent = (index / (ORDER.length - 1)) * 100;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-[#FAF8F4]">
      <button
        type="button"
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-[#1A1208]"
        onClick={() => navigate(-1)}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-16">
        <h1
          className="text-center text-2xl font-bold text-[var(--color-primary)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          How are you feeling?
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
          Slide to select your current mood
        </p>

        {/* Mood face */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <MoodEmoji
            mood={mood}
            size={130}
            className="shadow-xl ring-4 ring-[var(--color-border)]"
          />
          <p
            className="text-xl font-bold transition-colors"
            style={{ color: trackColor }}
          >
            {LABEL[mood]}
          </p>
        </div>

        {/* Drag slider */}
        <div className="mt-10 w-full max-w-sm px-2">
          <div className="relative h-8 flex items-center">
            {/* Track background */}
            <div className="absolute inset-y-0 left-0 right-0 my-auto h-3 rounded-full bg-[var(--color-border)]" />
            {/* Filled track */}
            <div
              className="absolute inset-y-0 left-0 my-auto h-3 rounded-full transition-all"
              style={{
                width: `${fillPercent}%`,
                background: `linear-gradient(to right, #7B6EC8, ${trackColor})`,
              }}
            />
            {/* Native range input */}
            <input
              type="range"
              min={0}
              max={ORDER.length - 1}
              step={1}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              className="relative z-10 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-colors [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg"
              style={{
                ["--thumb-color" as string]: trackColor,
              }}
              aria-label="Mood slider"
              aria-valuetext={LABEL[mood]}
            />
          </div>

          {/* Mood labels */}
          <div className="mt-3 flex justify-between text-[10px] font-medium text-[var(--color-text-muted)]">
            {ORDER.map((m, i) => (
              <button
                key={m}
                type="button"
                onClick={() => setIndex(i)}
                className={`transition-colors ${i === index ? "font-bold" : ""}`}
                style={{ color: i === index ? trackColor : undefined }}
              >
                {LABEL[m]}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          className="mt-12 w-full max-w-sm rounded-full"
          onClick={() => void handleSet()}
        >
          Set Mood
        </Button>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background-color: var(--thumb-color, #3B2A1A);
        }
        input[type="range"]::-moz-range-thumb {
          background-color: var(--thumb-color, #3B2A1A);
          border: none;
        }
      `}</style>
    </div>
  );
}
