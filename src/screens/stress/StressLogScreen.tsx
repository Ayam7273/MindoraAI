import { useState } from "react";
import { ChevronLeft, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAddStressEntry } from "@/hooks/useStressEntries";
import { useUpdateFreudScore } from "@/hooks/useFreudScoreHistory";
import { computeFreudScore } from "@/lib/freudScoreModel";
import { hapticSuccess } from "@/lib/haptics";
import { useUiStore } from "@/store/uiStore";
const BUBBLES = [
  { id: "Loneliness", size: "large", x: 42, y: 38 },
  { id: "Work", size: "sm", x: 18, y: 22 },
  { id: "Kids", size: "sm", x: 72, y: 20 },
  { id: "Finance", size: "sm", x: 70, y: 58 },
  { id: "Life", size: "sm", x: 22, y: 58 },
  { id: "Relationship", size: "sm", x: 48, y: 12 },
];

export function StressLogScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const activeMood = useUiStore((s) => s.activeMood);
  const addStress = useAddStressEntry();
  const updateFreud = useUpdateFreudScore();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(3);
  const [selected, setSelected] = useState<string[]>(["Loneliness"]);
  const [confirm, setConfirm] = useState(false);

  const finishLog = async () => {
    if (!userId) {
      navigate("/signin", { replace: true });
      return;
    }
    await addStress.mutateAsync({
      user_id: userId,
      stress_level: level,
      stressors: selected,
      life_impact: "Very High",
    });
    const mood = activeMood ?? "neutral";
    const score = computeFreudScore({
      mood,
      sleepHours: 7,
      stressLevel: level,
      journalStreakDays: 0,
    });
    await updateFreud.mutateAsync({ userId, score, reason: "Stress log" });
    hapticSuccess();
    setConfirm(true);
  };

  if (confirm) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-black/50 px-4">
        <Card className="w-full max-w-sm p-6 text-center shadow-xl">
          <div className="text-4xl">🧘</div>
          <h2 className="mt-4 text-lg font-bold text-[var(--color-primary)]">Stress Level Set to {level}</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Logged to your journal and shared with Doctor Freud AI (demo).
          </p>
          <Button type="button" fullWidth className="mt-6 rounded-full" onClick={() => navigate("/stress")}>
            Got it, thanks! ✓
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-[var(--color-primary)]">
          Log stress · Step {step + 1}/3
        </span>
        <span className="w-10" />
      </header>

      {step === 0 && (
        <div className="px-4 pt-8">
          <h1 className="text-center text-xl font-bold text-[var(--color-primary)]">What&apos;s your stress level today?</h1>
          <div className="relative mx-auto mt-10 flex h-64 w-48 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-[var(--color-border)]" />
            <div className="text-center">
              <p className="text-5xl font-bold text-[var(--color-primary)]">{level}</p>
              <p className="text-sm text-[var(--color-text-muted)]">Moderate</p>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="absolute -right-8 h-48 w-48 appearance-none bg-transparent opacity-0"
              style={{ writingMode: "vertical-rl" as const }}
            />
            <div className="absolute -right-2 top-0 flex h-full w-8 flex-col justify-between py-2">
              {[5, 4, 3, 2, 1].map((n) => (
                <span key={n} className="text-[10px] text-[var(--color-text-muted)]">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="mx-auto mt-8 block w-full max-w-xs accent-[var(--color-accent-orange)]"
          />
          <Button type="button" fullWidth className="mt-10 rounded-full" onClick={() => setStep(1)}>
            Continue →
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="px-4 pt-6">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">Select Stressors</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Tap bubbles — largest is your primary stressor.</p>
          <div className="relative mx-auto mt-6 h-56 max-w-sm rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)] p-4">
            {BUBBLES.map((b) => {
              const on = selected.includes(b.id);
              const large = b.size === "large";
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    setSelected((s) => (on ? s.filter((x) => x !== b.id) : [...s, b.id]))
                  }
                  className={`absolute flex items-center justify-center rounded-full font-semibold text-white shadow-md transition-transform active:scale-95 ${
                    large ? "h-24 w-24 text-sm" : "h-14 w-14 text-[10px]"
                  } ${on ? "bg-[var(--color-accent-green)] ring-2 ring-white" : "bg-[var(--color-text-muted)]/70"}`}
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {b.id}
                </button>
              );
            })}
          </div>
          <p className="mt-4 rounded-lg border border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-light)] px-3 py-2 text-xs text-[var(--color-accent-orange)]">
            ⚠️ Life Impact: Very High
          </p>
          <Button type="button" fullWidth className="mt-6 rounded-full" onClick={() => setStep(2)}>
            Continue →
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex min-h-[70vh] flex-col bg-[#3B2A1A] px-4 pb-8 pt-8 text-[#FAF8F4]">
          <h1 className="text-xl font-bold">Record Expression</h1>
          <ul className="mt-6 space-y-3">
            {["Brightly Lit Room", "Clear Face Expression", "Stay Still", "720p Camera"].map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-white/10 px-4 py-3 text-sm">
                <Video className="h-5 w-5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-1 flex-col items-center justify-center">
            <div className="flex aspect-square w-56 items-center justify-center rounded-full border-4 border-dashed border-white/50 bg-black/20">
              <span className="text-sm text-white/80">Camera preview</span>
            </div>
          </div>
          <Button type="button" variant="secondary" className="mt-4 rounded-full border-white/30 bg-transparent text-white" onClick={finishLog}>
            Skip This Step ✕
          </Button>
          <Button type="button" className="mt-2 rounded-full bg-[var(--color-success)] text-white" onClick={finishLog}>
            Continue →
          </Button>
        </div>
      )}
    </div>
  );
}
