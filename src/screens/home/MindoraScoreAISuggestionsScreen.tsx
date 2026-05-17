import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUiStore } from "@/store/uiStore";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { useMindoraScore } from "@/hooks/useMindoraScore";

const STEPS = [
  {
    n: 1,
    title: "Steady your breathing",
    body: "Try 60 seconds of slow breathing (4s in, 6s out).",
    tags: ["Breathing", "Grounding"],
  },
  {
    n: 2,
    title: "Micro‑journal",
    body: "Write 3 bullets: what happened, what you felt, one next step.",
    tags: ["Journal", "Clarity"],
  },
  {
    n: 3,
    title: "One supportive action",
    body: "Message a friend, take a short walk, or do a 5‑minute stretch.",
    tags: ["Support", "Movement"],
  },
] as const;

export function MindoraScoreAISuggestionsScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { score } = useMindoraScore(userId);
  const updateMindora = useUpdateMindoraScore();
  const [done, setDone] = useState(false);

  if (done) {
    const nextScore = Math.min(100, score + 8);
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#2a1f14] px-6 text-center text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-xl font-bold">Suggestion resolved!</h1>
        <p className="mt-3 text-sm text-white/75">+8 Mindora Score received.</p>
        <p className="mt-1 text-sm text-white/75">Your score is now about {nextScore}.</p>
        <Button
          type="button"
          className="mt-10 w-full max-w-xs rounded-full bg-white text-[#3B2A1A]"
          onClick={() => {
            if (userId) void updateMindora.mutateAsync({ userId, score: nextScore, reason: "AI suggestion" });
            navigate("/mindora-score", { replace: true });
          }}
        >
          Back to score →
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="Mindora Score · Suggestions" />
      <div className="space-y-3 px-4 pt-5">
        {STEPS.map((s) => (
          <Card key={s.n} className="p-4">
            <p className="text-xs font-bold text-[var(--color-text-muted)]">Step {s.n}</p>
            <p className="mt-1 text-base font-bold text-[var(--color-primary)]">{s.title}</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                  {t}
                </span>
              ))}
            </div>
          </Card>
        ))}

        <Button type="button" fullWidth className="mt-4 rounded-full" onClick={() => setDone(true)}>
          Mark as done
        </Button>
      </div>
    </div>
  );
}

