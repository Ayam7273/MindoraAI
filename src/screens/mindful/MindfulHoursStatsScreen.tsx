import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const SEGMENTS = [
  { label: "Mindfulness", pct: 30, color: "bg-[var(--color-success)]" },
  { label: "Breathing", pct: 25, color: "bg-[var(--color-accent-orange)]" },
  { label: "Relax", pct: 20, color: "bg-[var(--color-primary)]" },
  { label: "Sleep", pct: 25, color: "bg-[var(--color-accent-yellow)]" },
];

export function MindfulHoursStatsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-4">
      <header className="mb-6 flex items-center">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[var(--color-primary)]">Mindful Stats</h1>
        <span className="w-10" />
      </header>
      <div
        className="mx-auto flex h-52 w-52 items-center justify-center rounded-full p-4 shadow-[var(--shadow-md)]"
        style={{
          background: "conic-gradient(#6B8F47 0 108deg, #E07A3A 108deg 198deg, #3B2A1A 198deg 270deg, #F5C842 270deg 360deg)",
        }}
      >
        <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
          <p className="text-xl font-bold text-[var(--color-primary)]">8.21h</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">Total</p>
        </div>
      </div>
      <ul className="mt-8 space-y-2">
        {SEGMENTS.map((s) => (
          <li key={s.label} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-[var(--color-border)]">
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className={`h-3 w-3 rounded-full ${s.color}`} />
              {s.label}
            </span>
            <span className="text-sm font-bold text-[var(--color-primary)]">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
