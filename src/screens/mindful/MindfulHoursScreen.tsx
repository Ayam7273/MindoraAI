import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";

const HISTORY = [
  { title: "Deep Meditation", tag: "Nature", time: "Yesterday · 25m" },
  { title: "Relaxed State", tag: "Ocean Mist", time: "Mon · 18m" },
];

export function MindfulHoursScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[var(--color-primary)]">Mindful Hours</h1>
        <Link to="/mindful/stats" className="px-2 text-xs font-semibold text-[var(--color-accent-green)]">
          Stats
        </Link>
      </header>

      <div className="relative mx-4 mt-4 overflow-hidden rounded-[var(--radius-xl)] bg-[#3a3a3a] px-6 pb-16 pt-10 text-center text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 30%, #fff 0 2px, transparent 3px) 0 0/40px 40px" }} />
        <p className="text-5xl font-bold tabular-nums">5.21</p>
        <p className="mt-1 text-sm text-white/70">Mindful Hours</p>
        <button
          type="button"
          onClick={() => navigate("/mindful/exercise")}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3B2A1A] text-white shadow-lg"
          aria-label="Start exercise"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="px-4 pt-6">
        <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Mindful Hour History</h2>
        <ul className="space-y-3">
          {HISTORY.map((h) => (
            <li key={h.title}>
              <Card className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]">
                  <Play className="h-5 w-5 fill-current" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--color-primary)]">{h.title}</p>
                  <span className="mt-1 inline-block rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    {h.tag}
                  </span>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{h.time}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
