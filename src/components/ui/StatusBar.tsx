import { cn } from "@/lib/utils";

interface StatusBarProps {
  className?: string;
  /** Override displayed time (default 9:41). */
  time?: string;
}

/**
 * Simulated iOS-style status row (time, signal, battery) for a native app feel.
 */
export function StatusBar({ className, time = "9:41" }: StatusBarProps) {
  void className;
  void time;
  return null;
}

/*
 * Legacy UI: kept for backward compatibility with existing screens.
 * If you ever want it back, revert this component to the previous implementation.
 */
/*
  return (
    <div
      className={cn("bg-[var(--color-bg)] text-[var(--color-text-primary)]", className)}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      role="presentation"
      aria-hidden
    >
      <div className="flex h-11 items-center justify-between gap-2 px-5 text-[13px] font-semibold leading-none">
        <span className="tabular-nums tracking-tight">{time}</span>
        <div className="flex flex-1 items-center justify-end gap-1.5 pr-0.5">
          <SignalIcon />
          <WifiIcon />
          <BatteryIcon />
        </div>
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden className="text-current">
      <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
      <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
      <rect x="10" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden className="text-current">
      <path
        d="M8 11a1 1 0 100-2 1 1 0 000 2zM3.5 6.5a4 4 0 019 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M1 3.5a7 7 0 0114 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden className="text-current">
      <rect x="0.5" y="1.5" width="20" height="9" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
      <rect x="2" y="3" width="15" height="6" rx="1" fill="currentColor" opacity={0.85} />
      <path d="M22 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
*/
