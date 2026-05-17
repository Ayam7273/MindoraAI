import { useNavigate } from "react-router-dom";
import { ChevronLeft, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
const HISTORY = [
  { day: "Tue Sep 14", hours: "8.2h", badge: "Excellent" as const },
  { day: "Mon Sep 13", hours: "5.1h", badge: "Poor" as const },
];

export function SleepQualityScreen() {
  const navigate = useNavigate();
  const score = 20;
  const poor = score < 40;

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className={poor ? "bg-[#7B6EC8] text-white" : "bg-[var(--color-accent-green)] text-white"}>
        <div className="h-[env(safe-area-inset-top,0px)]" aria-hidden />
        <header className="flex items-center px-2 py-1">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold">Sleep Quality</h1>
          <span className="w-10" />
        </header>
        <div className="px-6 pb-10 pt-4 text-center">
          <p className="text-6xl font-bold tabular-nums">{score}</p>
          <p className="mt-2 text-sm font-semibold">{poor ? "You are Insomniac." : "Great recovery sleep"}</p>
        </div>
      </div>

      <div className="-mt-4 space-y-4 px-4 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:px-8 lg:pt-6 lg:space-y-0">
        {/* Left column: sleep quality display + action buttons */}
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-bold text-[var(--color-primary)]">Sleep Overview</h2>
            <div className="mt-4 flex justify-around">
              <div className="text-center">
                <ProgressRing value={0.72} size={72} stroke={5} />
                <p className="mt-2 text-xs font-semibold text-[var(--color-text-secondary)]">Sleep 8.6h</p>
              </div>
              <div className="text-center">
                <ProgressRing value={0.65} size={72} stroke={5} progressColor="var(--color-accent-orange)" />
                <p className="mt-2 text-xs font-semibold text-[var(--color-text-secondary)]">REM 7.8h</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-[var(--color-primary)]">January 2025</h2>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
              {Array.from({ length: 28 }, (_, i) => (
                <span key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[var(--color-text-muted)]">{i + 1}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${i % 3 === 0 ? "bg-[var(--color-success)]" : i % 3 === 1 ? "bg-[var(--color-accent-orange)]" : "bg-[var(--color-border)]"}`} />
                </span>
              ))}
            </div>
          </Card>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1 rounded-full" onClick={() => navigate("/sleep/active")}>
              <Moon className="mr-2 h-4 w-4" />
              Track sleep
            </Button>
            <Button type="button" className="flex-1 rounded-full" onClick={() => navigate("/sleep/insights")}>
              Insights
            </Button>
          </div>
        </div>

        {/* Right column: AI suggestions + sleep history */}
        <div className="space-y-4">
          <section>
            <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">AI Suggestions</h2>
            <ul className="space-y-2">
              {["Loud Snoring", "Pillow Improvement", "Temperature Adjustment"].map((t) => (
                <li key={t} className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-3 text-sm font-medium">
                  {t}
                  <span className="text-[var(--color-text-muted)]">›</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Sleep History</h2>
            {HISTORY.map((h) => (
              <div key={h.day} className="mb-2 flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-3">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{h.day}</p>
                  <p className="font-semibold text-[var(--color-primary)]">{h.hours}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    h.badge === "Excellent" ? "bg-[var(--color-accent-green-light)] text-[var(--color-success)]" : "bg-[var(--color-accent-orange-light)] text-[var(--color-accent-orange)]"
                  }`}
                >
                  {h.badge}
                </span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
