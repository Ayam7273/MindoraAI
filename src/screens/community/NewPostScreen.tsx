import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";

const CATS = [
  "Self Care",
  "Mindfulness",
  "Stories",
  "Support",
  "Creative",
  "Therapy",
  "Stress",
  "Affirmation",
  "Awareness",
] as const;

export function NewPostScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [cat, setCat] = useState<string>("Therapy");
  const [body, setBody] = useState("");
  const [ptype, setPtype] = useState<"Story" | "Regular" | "Real">("Regular");
  const [hide, setHide] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  if (step === 1) {
    return (
      <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <header className="mb-4 flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
            <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Add New Post</h1>
          <button type="button" className="text-xs font-semibold text-[var(--color-accent-orange)]" onClick={() => setFilterOpen(true)}>
            Filter
          </button>
        </header>
        <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">Select post category</p>
        <div className="grid grid-cols-3 gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-2xl border py-4 text-center text-xs font-bold",
                cat === c ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[#3B2A1A]" : "border-[var(--color-border)] bg-white",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <Button type="button" fullWidth className="mt-8 rounded-full" onClick={() => setStep(2)}>
          Continue &gt;
        </Button>

        <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Posts">
          <div className="space-y-3 text-sm">
            <p>Post Type</p>
            <div className="flex gap-2">
              {["Story", "Video", "Audio"].map((t) => (
                <span key={t} className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-semibold">
                  {t}
                </span>
              ))}
            </div>
            <label className="block">
              Post Date
              <input type="date" className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-2 py-2" defaultValue="2022-01-20" />
            </label>
            <p>Video Duration: 0–5m</p>
            <input type="range" min={0} max={5} defaultValue={3} className="w-full accent-[#3B2A1A]" />
            <Button type="button" fullWidth className="rounded-full" onClick={() => setFilterOpen(false)}>
              Filter Posts (21) ↕
            </Button>
          </div>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => setStep(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Create Post</h1>
        <span className="w-10" />
      </header>

      <label className="mb-3 block text-sm font-medium text-[var(--color-text-secondary)]">
        What&apos;s on your mind?
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-white p-3 text-sm" placeholder="Share respectfully…" />
      </label>

      <p className="mb-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Post Type</p>
      <div className="mb-4 flex flex-col gap-2">
        {(["Story", "Regular", "Real"] as const).map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm">
            <input type="radio" name="ptype" checked={ptype === t} onChange={() => setPtype(t)} />
            {t}
          </label>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold uppercase text-[var(--color-text-muted)]">Add Metrics</p>
      <div className="mb-4 flex gap-2 text-2xl">😢 😐 🙂 😄 🤩 ❤️</div>

      <Toggle label="Hide From Community?" checked={hide} onChange={(e) => setHide(e.target.checked)} />

      <div className="mt-8 flex gap-2">
        <Button type="button" variant="secondary" fullWidth className="rounded-full">
          Save As Draft
        </Button>
        <Button type="button" fullWidth className="rounded-full" onClick={() => navigate("/community/post-success")}>
          Create Post →
        </Button>
      </div>
    </div>
  );
}
