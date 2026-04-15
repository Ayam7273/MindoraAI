import { useMemo, useState } from "react";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { MindoraScoreBadge } from "@/components/ui/MindoraScoreBadge";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { Sheet } from "@/components/ui/Sheet";
import { Toggle } from "@/components/ui/Toggle";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

const HISTORY = [
  { date: "Sep 12", label: "Anxious, Depressed", score: 62 },
  { date: "Sep 10", label: "Stable", score: 78 },
  { date: "Sep 4", label: "Happy stretch", score: 84 },
];

const BAR_WEEKS = [
  { pos: 0.65, neg: 0.2 },
  { pos: 0.45, neg: 0.35 },
  { pos: 0.7, neg: 0.15 },
  { pos: 0.55, neg: 0.4 },
  { pos: 0.8, neg: 0.1 },
  { pos: 0.5, neg: 0.3 },
  { pos: 0.72, neg: 0.22 },
];

const MOOD_ROW: MoodKey[] = ["depressed", "sad", "neutral", "happy", "overjoyed", "happy", "neutral"];

export function MindoraScoreScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { score } = useMindoraScore(userId);
  const [filterOpen, setFilterOpen] = useState(false);
  const [from, setFrom] = useState("2025-09-01");
  const [to, setTo] = useState("2025-09-30");
  const [range, setRange] = useState(25);
  const [includeAi, setIncludeAi] = useState(true);

  const status = useMemo(() => {
    if (score >= 70) return "Mentally Stable";
    if (score >= 45) return "Needs Attention";
    return "Seek Support";
  }, [score]);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="relative overflow-hidden bg-[#d8e8cc] px-4 pb-8 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(107,143,71,0.35) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-[var(--color-primary)]"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-[var(--color-primary)]"
            aria-label="Filter"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="relative mt-6 flex flex-col items-center">
          <span className="text-6xl font-bold tabular-nums text-white drop-shadow-sm">{score}</span>
          <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">{status}</p>
        </div>
      </header>

      <div className="-mt-4 space-y-4 rounded-t-[var(--radius-xl)] bg-[#FAF8F4] px-4 pb-6 pt-5">
        <section>
          <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Score history</h2>
          <ul className="space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-sm)]">
            {HISTORY.map((row) => (
              <li
                key={row.date}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 hover:bg-[var(--color-bg-secondary)]"
              >
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)]">{row.date}</p>
                  <p className="text-sm text-[var(--color-text-primary)]">{row.label}</p>
                </div>
                <MindoraScoreBadge score={row.score} size={48} stroke={4} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Weekly outlook</h2>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
            <div className="flex h-36 items-end justify-between gap-1.5 px-1">
              {BAR_WEEKS.map((w, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-0.5">
                  <div
                    className="w-full max-w-[14px] rounded-t-md bg-[var(--color-success)]"
                    style={{ height: `${w.pos * 100}%` }}
                  />
                  <div
                    className="w-full max-w-[14px] rounded-b-md bg-[var(--color-accent-orange)]"
                    style={{ height: `${w.neg * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-[var(--color-text-muted)]">
              Green = positive · Orange = challenging days
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Mood history</h2>
          <div className="flex justify-between gap-1 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 shadow-[var(--shadow-sm)]">
            {MOOD_ROW.map((m, i) => (
              <MoodEmoji key={i} mood={m} size={36} />
            ))}
          </div>
        </section>

        <Button
          type="button"
          fullWidth
          className="rounded-full"
          onClick={() => navigate("/mindora-score/suggestions")}
        >
          Swipe for AI suggestions ⌄⌄
        </Button>
      </div>

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Mindora Score">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-primary)]"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-primary)]"
            />
          </label>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Score range (max {range})</p>
            <input
              type="range"
              min={0}
              max={100}
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-primary)]"
            />
          </div>
          <Toggle
            label="Include AI Suggestions"
            checked={includeAi}
            onChange={(e) => setIncludeAi(e.target.checked)}
          />
          <Button type="button" fullWidth className="rounded-full" onClick={() => setFilterOpen(false)}>
            Filter Mindora Score (15)
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

