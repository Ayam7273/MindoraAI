import { useEffect, useRef } from "react";
import { CheckCircle, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAddMindfulSession } from "@/hooks/useMindfulSessions";
import { useUiStore } from "@/store/uiStore";

export function ExerciseCompleteScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = useUiStore((s) => s.user?.id);
  const { mutate: addSession } = useAddMindfulSession();
  const savedRef = useRef(false);

  const mins = Math.max(1, parseInt(searchParams.get("mins") ?? "1", 10));

  useEffect(() => {
    if (!userId || savedRef.current) return;
    savedRef.current = true;
    addSession({
      user_id: userId,
      type: "breathing",
      duration_minutes: mins,
      goal: null,
      soundscape: null,
      mindora_score_gained: 8,
      stress_reduced: 1,
    });
  }, [userId, mins, addSession]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-[var(--radius-xl)] bg-white p-6 text-center shadow-xl">
        <div className="flex justify-center">
          <CheckCircle className="h-14 w-14 text-[var(--color-success)]" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-[var(--color-primary)]">Exercise Completed!</h1>
        <p className="mt-3 text-sm font-semibold text-[var(--color-success)]">+8 Mindora Score · −1 Stress Level</p>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
          {mins} min session saved to your mindful hours.
        </p>
        <Button type="button" fullWidth className="mt-6 rounded-full" onClick={() => navigate("/mindful")}>
          Got it, thanks!
        </Button>
      </div>
      <button
        type="button"
        className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow"
        onClick={() => navigate("/mindful")}
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
