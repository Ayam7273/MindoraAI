export interface ProgressRingProps {
  /** 0–1 progress amount */
  value: number;
  size?: number;
  stroke?: number;
  /** Stroke for the progress arc */
  progressColor?: string;
  /** Stroke for the track */
  trackColor?: string;
  className?: string;
}

import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 72,
  stroke = 6,
  progressColor = "var(--color-accent-green)",
  trackColor = "var(--color-border)",
  className,
}: ProgressRingProps) {
  const t = Math.min(1, Math.max(0, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - t);

  return (
    <svg
      width={size}
      height={size}
      className={cn("-rotate-90", className)}
      role="img"
      aria-valuenow={Math.round(t * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress ${Math.round(t * 100)} percent`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={progressColor}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
