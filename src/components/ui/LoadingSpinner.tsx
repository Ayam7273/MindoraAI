import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  className?: string;
  /** Outer box size in px */
  size?: number;
}

/**
 * Four-dot clover-style loader with staggered pulse.
 */
export function LoadingSpinner({ className, size = 40 }: LoadingSpinnerProps) {
  const dot = size * 0.16;
  const arm = size * 0.32;
  const half = size / 2;

  const positions = [
    { left: half - dot / 2, top: half - arm, delay: 0 },
    { left: half + arm - dot / 2, top: half - dot / 2, delay: 0.12 },
    { left: half - dot / 2, top: half + arm - dot, delay: 0.24 },
    { left: half - arm - dot / 2, top: half - dot / 2, delay: 0.36 },
  ];

  return (
    <div
      className={cn("relative inline-block text-[var(--color-primary)]", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {positions.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-current"
          style={{
            width: dot,
            height: dot,
            left: p.left,
            top: p.top,
            animation: "clover-dot 0.85s ease-in-out infinite",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes clover-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
