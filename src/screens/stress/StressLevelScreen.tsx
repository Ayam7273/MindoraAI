import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
const LEVELS = [
  { v: 1, label: "Calm" },
  { v: 2, label: "Normal" },
  { v: 3, label: "Elevated" },
  { v: 4, label: "Stressed" },
  { v: 5, label: "Extreme" },
] as const;

export function StressLevelScreen() {
  const navigate = useNavigate();
  const level = 3;
  const meta = LEVELS.find((l) => l.v === level)!;

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className="bg-[var(--color-accent-orange)] pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
        <div className="flex items-center px-2 py-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold">Stress Level</h1>
          <span className="w-10" />
        </div>
        <div className="relative mx-4 mb-8 mt-2 overflow-hidden rounded-[var(--radius-xl)] bg-white/10 p-8 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.25) 55%, transparent 55%)",
              backgroundSize: "24px 24px",
            }}
          />
          <p className="relative text-6xl font-bold tabular-nums">{level}</p>
          <p className="relative mt-2 text-lg font-semibold">{meta.label} Stress</p>
        </div>
      </div>

      <div className="-mt-4 space-y-4 px-4 pb-6 pt-4 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:px-8 lg:pt-6 lg:space-y-0">
        {/* Right column on desktop: stats/history */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
          <h2 className="text-sm font-bold text-[var(--color-primary)]">Stress Stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">Stressor</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">Loneliness</p>
              <div className="mt-2 space-y-1">
                {[60, 80, 45, 90].map((w, i) => (
                  <div key={i} className="h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div className="h-full rounded-full bg-[var(--color-accent-green)]" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">Impact</p>
              <p className="text-lg font-bold text-[var(--color-accent-purple)]">Very High</p>
              <svg viewBox="0 0 100 40" className="mt-2 h-16 w-full text-[var(--color-accent-purple)]">
                <path d="M0 30 Q25 5 50 20 T100 8" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>

        {/* Left column on desktop: log + stats buttons */}
        <div className="space-y-4 lg:order-first">
          <Button type="button" fullWidth className="rounded-full" onClick={() => navigate("/stress/log")}>
            Log stress →
          </Button>
          <Button type="button" fullWidth variant="secondary" className="rounded-full" onClick={() => navigate("/stress/stats")}>
            View bubble stats
          </Button>
        </div>
      </div>
    </div>
  );
}
