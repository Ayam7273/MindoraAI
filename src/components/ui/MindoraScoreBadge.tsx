import { cn } from "@/lib/utils";

export interface MindoraScoreBadgeProps {
  /** 0–100 inclusive */
  score: number;
  size?: number;
  stroke?: number;
  className?: string;
}

function tierColor(score: number): string {
  if (score <= 30) return "var(--color-danger)";
  if (score <= 60) return "var(--color-accent-orange)";
  return "var(--color-success)";
}

/** Circular score with progress ring; color reflects band (red / orange / green). */
export function MindoraScoreBadge({
  score,
  size = 72,
  stroke = 6,
  className,
}: MindoraScoreBadgeProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = clamped / 100;
  const offset = c * (1 - progress);
  const strokeColor = tierColor(clamped);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[length:var(--text-lg)] font-bold tabular-nums text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {clamped}
      </span>
    </div>
  );
}

