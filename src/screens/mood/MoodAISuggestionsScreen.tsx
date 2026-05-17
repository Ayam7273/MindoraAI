import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { useUiStore } from "@/store/uiStore";

const STEPS = [
  {
    n: 1,
    title: "Acknowledge Feeling",
    body: "Name what you feel without judgment. Writing it down reduces intensity.",
    tags: ["Journal", "Grounding"],
  },
  {
    n: 2,
    title: "Do Positive Activity",
    body: "Take a 15-minute walk or stretch. Movement helps regulate your nervous system.",
    tags: ["Walking", "Jogging"],
  },
  {
    n: 3,
    title: "Seek Support",
    body: "Reach out to someone you trust or use the Reach Out tools in the app.",
    tags: ["Social", "Safety"],
  },
] as const;

export function MoodAISuggestionsScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { score } = useMindoraScore(userId);
  const updateMindora = useUpdateMindoraScore();
  const [done, setDone] = useState(false);
  const nextScore = Math.min(100, score + 3);

  if (done) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#2a1f14] px-6 text-center text-white">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
        <Sparkles className="h-10 w-10 text-white" strokeWidth={1.5} />
      </div>
        <h1 className="mt-6 text-xl font-bold">Mood Suggestion Resolved!</h1>
        <p className="mt-3 text-sm text-white/75">+3 Mindora Score received.</p>
        <p className="mt-1 text-sm text-white/75">Your score is now about {nextScore}.</p>
        <Button
          type="button"
          className="mt-10 w-full max-w-xs rounded-full bg-white text-[#3B2A1A]"
          onClick={() => {
            if (userId) void updateMindora.mutateAsync({ userId, score: nextScore, reason: "Mood suggestion" });
            navigate("/mood", { replace: true });
          }}
        >
          Great, Thanks!
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="AI Suggestions" showSearch={false} />
      <div className="space-y-4 px-4 pt-4">
        {STEPS.map((s) => (
          <Card key={s.n} className="relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase text-[var(--color-accent-green)]">Step {s.n}</span>
            <h2 className="mt-1 text-base font-bold text-[var(--color-primary)]">{s.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>
        ))}
        <Button type="button" fullWidth className="rounded-full bg-[var(--color-success)] text-white" onClick={() => setDone(true)}>
          Mark As Resolved
        </Button>
      </div>
    </div>
  );
}
