import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAddSleepEntry } from "@/hooks/useSleepEntries";
import { useUpdateFreudScore } from "@/hooks/useFreudScoreHistory";
import { computeFreudScore } from "@/lib/freudScoreModel";
import { useUiStore } from "@/store/uiStore";

export function SleepResultsScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const activeMood = useUiStore((s) => s.activeMood);
  const addSleep = useAddSleepEntry();
  const updateFreud = useUpdateFreudScore();
  const [busy, setBusy] = useState(false);

  const onDone = async () => {
    if (!userId) {
      navigate("/sleep");
      return;
    }
    setBusy(true);
    await addSleep.mutateAsync({
      user_id: userId,
      sleep_at: null,
      wake_at: null,
      duration_hours: 8.25,
      rem_hours: 4.01,
      core_hours: 2.14,
      quality: "normal",
      ai_suggestions: [],
    });
    const mood = activeMood ?? "neutral";
    const score = computeFreudScore({
      mood,
      sleepHours: 8.25,
      stressLevel: 2,
      journalStreakDays: 0,
    });
    await updateFreud.mutateAsync({ userId, score, reason: "Sleep log" });
    setBusy(false);
    navigate("/sleep");
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-8 text-center">
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">You Slept for 8.25h</h1>
      <div className="mx-auto mt-10 flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-[var(--color-success)] border-t-[var(--color-accent-orange)] border-r-[var(--color-border)]">
        <div>
          <p className="text-2xl font-bold text-[var(--color-primary)]">8.25</p>
          <p className="text-xs text-[var(--color-text-muted)]">hours</p>
        </div>
      </div>
      <div className="mt-8 flex justify-center gap-4 text-xs">
        <span className="rounded-full bg-[var(--color-accent-green-light)] px-3 py-1 font-semibold text-[var(--color-success)]">
          Core 2.14h
        </span>
        <span className="rounded-full bg-[var(--color-accent-orange-light)] px-3 py-1 font-semibold text-[var(--color-accent-orange)]">
          REM 4.01h
        </span>
        <span className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 font-semibold text-[var(--color-text-muted)]">
          Wake 12m
        </span>
      </div>
      <Button
        type="button"
        disabled={busy}
        className="mt-12 w-full max-w-xs rounded-full"
        onClick={() => void onDone()}
      >
        {busy ? "Saving…" : "Got It, Thanks! →"}
      </Button>
    </div>
  );
}
