import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

/** iOS-style switch (~51×31). */
export function Toggle({ className, label, id, ...props }: ToggleProps) {
  const toggleId = id ?? props.name;

  return (
    <label
      htmlFor={toggleId}
      className={cn("flex items-center justify-between gap-3 py-2", className)}
    >
      {label ? (
        <span className="text-[var(--text-sm)] text-[var(--color-text-primary)]">{label}</span>
      ) : null}
      <span className="relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center">
        <input
          id={toggleId}
          type="checkbox"
          role="switch"
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-[var(--color-border)] transition-colors",
            "peer-checked:bg-[var(--color-accent-green)]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-primary)] peer-focus-visible:ring-offset-2",
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute left-[3px] top-1/2 h-[27px] w-[27px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
            "peer-checked:translate-x-[20px]",
          )}
        />
      </span>
    </label>
  );
}
