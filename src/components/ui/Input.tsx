import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Optional icon or prefix inside the field (left). */
  icon?: ReactNode;
}

export function Input({ className, label, error, icon, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block w-full" htmlFor={inputId}>
      {label ? (
        <span className="mb-1 block text-[var(--text-sm)] text-[var(--color-text-secondary)]">{label}</span>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-lg)] border bg-[var(--color-surface)] px-3 transition-colors",
          "focus-within:border-[var(--color-border-strong)] focus-within:ring-1 focus-within:ring-[var(--color-border-strong)]/30",
          error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
        )}
      >
        {icon ? (
          <span className="flex shrink-0 items-center text-[var(--color-text-muted)] [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[var(--text-base)] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <span className="mt-1 block text-[var(--text-xs)] text-[var(--color-danger)]">{error}</span>
      ) : null}
    </label>
  );
}
