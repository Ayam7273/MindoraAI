import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const BUBBLES = [
  { label: "Calm", n: 97, color: "bg-[var(--color-success)]", size: "w-28 h-28 text-2xl" },
  { label: "Stressed", n: 58, color: "bg-[var(--color-accent-orange)]", size: "w-20 h-20 text-lg" },
  { label: "Normal", n: 33, color: "bg-[var(--color-text-muted)]", size: "w-16 h-16 text-sm" },
  { label: "Elevated", n: 25, color: "bg-[var(--color-accent-yellow)]", size: "w-14 h-14 text-xs" },
  { label: "Extreme", n: 8, color: "bg-[var(--color-accent-purple)]", size: "w-12 h-12 text-[10px]" },
];

export function StressLevelStatsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[var(--color-primary)]">Stress Level Stats</h1>
        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full" aria-label="Filter">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </header>

      <div className="px-4 pt-4">
        <div className="mb-4 flex flex-wrap gap-3 text-[10px] font-medium">
          {BUBBLES.map((b) => (
            <span key={b.label} className="flex items-center gap-1 text-[var(--color-text-secondary)]">
              <span className={cn("h-2 w-2 rounded-full", b.color)} />
              {b.label}
            </span>
          ))}
        </div>
        <div className="relative mx-auto flex h-80 max-w-sm items-center justify-center">
          {BUBBLES.map((b, i) => (
            <div
              key={b.label}
              className={cn(
                "absolute flex items-center justify-center rounded-full font-bold text-white shadow-lg",
                b.color,
                b.size,
              )}
              style={{
                transform: `translate(${(i - 2) * 28}px, ${(i % 2) * 18 - 8}px)`,
              }}
            >
              {b.n}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm"
        >
          Monthly ⌄
        </button>
      </div>
    </div>
  );
}
