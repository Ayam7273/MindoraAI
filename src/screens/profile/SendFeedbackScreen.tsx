import { useState } from "react";
import { ChevronLeft, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const AREAS = ["Performance", "Crashes", "Features", "Loading", "Pricing Scheme", "Other"] as const;

export function SendFeedbackScreen() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>(["Features"]);
  const [note, setNote] = useState("");

  const toggle = (a: string) => {
    setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  };

  return (
    <div className="min-h-dvh bg-[var(--color-accent-green-light)] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70" aria-label="Back">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Send Feedback</h1>
        <Smile className="h-8 w-8 text-[var(--color-accent-orange)]" strokeWidth={1.5} />
      </header>

      <p className="mb-3 text-sm font-semibold text-[#3B2A1A]">Which of the area needs improvement?</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold",
              picked.includes(a) ? "bg-[#3B2A1A] text-white" : "bg-white/80 text-[#3B2A1A] ring-1 ring-[var(--color-border)]",
            )}
          >
            {a}
          </button>
        ))}
      </div>

      <label className="mb-4 block text-sm font-medium text-[#3B2A1A]">
        Note
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-white p-3 text-sm" placeholder="Tell us more…" />
      </label>

      <Button type="button" fullWidth className="rounded-full" onClick={() => navigate(-1)}>
        Submit Feedback →
      </Button>
    </div>
  );
}
