import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/Button";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { useAddMoodEntry } from "@/hooks/useMoodEntries";
import { useUpdateFreudScore } from "@/hooks/useFreudScoreHistory";
import { computeFreudScore } from "@/lib/freudScoreModel";
import { hapticSuccess } from "@/lib/haptics";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

const ORDER: MoodKey[] = ["depressed", "sad", "neutral", "happy", "overjoyed"];

const BG: Record<MoodKey, string> = {
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

export function MoodSetScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const setActiveMood = useUiStore((s) => s.setActiveMood);
  const addMood = useAddMoodEntry();
  const updateFreud = useUpdateFreudScore();
  const [index, setIndex] = useState(2);
  const mood = ORDER[index];

  const arcSwipe = useSwipeable({
    onSwipedUp: () => setIndex((i) => Math.min(ORDER.length - 1, i + 1)),
    onSwipedDown: () => setIndex((i) => Math.max(0, i - 1)),
    delta: 24,
    preventScrollOnSwipe: true,
  });

  return (
    <div className="fixed inset-0 z-[80] flex flex-col" style={{ background: BG[mood] }}>
      <button
        type="button"
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/15 text-[#1A1208]"
        onClick={() => navigate(-1)}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-16 text-[#1A1208]">
        <MoodEmoji mood={mood} size={140} className="shadow-2xl ring-4 ring-white/35" />
        <p className="mt-10 text-center text-2xl font-bold">
          I&apos;m Feeling <span className="underline decoration-white/50">{LABEL[mood]}</span>
        </p>

        <div className="relative mt-14 w-full max-w-[300px]" {...arcSwipe}>
          <svg viewBox="0 0 200 100" className="w-full touch-none" aria-hidden>
            <path
              d="M 12 88 Q 100 8 188 88"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {ORDER.map((_, i) => {
              const t = i / (ORDER.length - 1);
              const angle = Math.PI - t * Math.PI;
              const px = 100 + Math.cos(angle) * 86;
              const py = 88 - Math.sin(angle) * 76;
              return (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={index === i ? 11 : 7}
                  fill={index === i ? "#ffffff" : "rgba(255,255,255,0.45)"}
                  className="cursor-pointer"
                  onClick={() => setIndex(i)}
                />
              );
            })}
          </svg>
        </div>

        <Button
          type="button"
          className="mt-12 w-full max-w-xs rounded-full bg-[#3B2A1A] text-white"
          onClick={async () => {
            if (!userId) {
              navigate("/signin", { replace: true });
              return;
            }
            setActiveMood(mood);
            await addMood.mutateAsync({ user_id: userId, mood });
            const score = computeFreudScore({
              mood,
              sleepHours: 7,
              stressLevel: 2,
              journalStreakDays: 0,
            });
            await updateFreud.mutateAsync({ userId, score, reason: "Mood check-in" });
            hapticSuccess();
            navigate("/mood", { replace: true });
          }}
        >
          Set Mood ✓
        </Button>
      </div>
    </div>
  );
}
