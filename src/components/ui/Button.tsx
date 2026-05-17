import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { hapticLight } from "@/lib/haptics";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:opacity-90 border border-transparent",
  secondary:
    "bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] active:opacity-90",
  ghost:
    "bg-transparent text-[var(--color-primary)] border border-transparent hover:bg-[var(--color-bg-secondary)]",
  danger:
    "bg-[var(--color-danger)] text-white border border-transparent hover:brightness-95 active:opacity-90",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = "primary",
  fullWidth,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    hapticLight();
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-sm)] font-semibold transition-colors disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
}
