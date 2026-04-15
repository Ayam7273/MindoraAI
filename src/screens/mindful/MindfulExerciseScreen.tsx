import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/ui/TopBar";

const GOALS = [
  "Gain focus",
  "Sleep better",
  "Be a better person",
  "Conquer trauma",
  "Enjoy life",
  "Be present",
] as const;
const SOUNDS = ["Birds", "Zen Garden", "Mountain Stream"] as const;

export function MindfulExerciseScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(25);
  const [sound, setSound] = useState<(typeof SOUNDS)[number]>("Zen Garden");

  if (step === 0) {
    return (
      <div className="min-h-dvh bg-[#FAF8F4] pb-28">
        <TopBar title="New Exercise (1 of 3)" />
        <p className="px-4 pt-4 text-center text-sm font-semibold text-[var(--color-primary)]">What&apos;s your mindful exercise goal?</p>
        <div className="mt-4 grid grid-cols-2 gap-3 px-4">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGoal(g)}
              className={`rounded-[var(--radius-lg)] border px-3 py-4 text-left text-sm font-semibold ${goal === g ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)]" : "border-[var(--color-border)] bg-white"}`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-[var(--color-border)] bg-[#FAF8F4] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="button" fullWidth className="rounded-full" disabled={!goal} onClick={() => setStep(1)}>
            Continue →
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-dvh bg-[#FAF8F4] pb-28">
        <TopBar title="New Exercise (2 of 3)" />
        <div className="px-4 pt-6 text-center">
          <p className="text-sm font-semibold text-[var(--color-primary)]">How much time do you have?</p>
          <button
            type="button"
            onClick={() => setMinutes((m) => (m >= 45 ? 10 : m + 5))}
            className="mx-auto mt-6 block w-full max-w-xs rounded-[var(--radius-full)] bg-[var(--color-accent-green)] py-6 text-4xl font-bold text-white shadow-lg"
          >
            {String(Math.floor(minutes / 60)).padStart(2, "0")}:{String(minutes % 60).padStart(2, "0")}
          </button>
          <p className="mt-4 text-xs text-[var(--color-text-muted)]">Tap timer to add 5 minutes (demo)</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SOUNDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSound(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${sound === s ? "bg-[var(--color-accent-orange)] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-[var(--color-border)] bg-[#FAF8F4] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="button" fullWidth className="rounded-full" onClick={() => setStep(2)}>
            Continue →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="New Exercise (3 of 3)" />
      <p className="px-4 pt-4 text-center text-sm font-semibold text-[var(--color-primary)]">Select Soundscapes</p>
      <div className="mx-4 mt-6 flex h-32 items-end justify-center gap-1 rounded-[var(--radius-lg)] bg-[#e8e8e8] px-2 pb-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="w-1 flex-1 rounded-t bg-[var(--color-text-muted)]/40" style={{ height: `${20 + (i * 11) % 100}%` }} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2 px-4">
        {SOUNDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSound(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${sound === s ? "bg-[var(--color-accent-orange)] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 border-t border-[var(--color-border)] bg-[#FAF8F4] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button type="button" fullWidth className="rounded-full" onClick={() => navigate("/mindful/exercise/active")}>
          Start session →
        </Button>
      </div>
    </div>
  );
}
