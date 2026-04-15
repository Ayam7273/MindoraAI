import { Ban, Construction, FileQuestion, ServerCrash, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ErrorScreenType = "404" | "no-internet" | "500" | "maintenance" | "not-allowed";

const CONFIG: Record<
  ErrorScreenType,
  { title: string; message: string; badge: string; Icon: typeof FileQuestion }
> = {
  "404": {
    title: "Page not found",
    message: "We couldn’t find that screen. It may have moved or been removed.",
    badge: "404",
    Icon: FileQuestion,
  },
  "no-internet": {
    title: "No connection",
    message: "Check your Wi‑Fi or cellular data and try again.",
    badge: "Offline",
    Icon: WifiOff,
  },
  "500": {
    title: "Something went wrong",
    message: "Our servers hit a snag. Please try again in a moment.",
    badge: "Error",
    Icon: ServerCrash,
  },
  maintenance: {
    title: "Under maintenance",
    message: "Freud.ai is getting a quick tune‑up. Check back soon.",
    badge: "Maintenance",
    Icon: Construction,
  },
  "not-allowed": {
    title: "Access denied",
    message: "You don’t have permission to view this.",
    badge: "403",
    Icon: Ban,
  },
};

export interface ErrorScreenProps {
  type: ErrorScreenType;
  className?: string;
}

export function ErrorScreen({ type, className }: ErrorScreenProps) {
  const navigate = useNavigate();
  const { title, message, badge, Icon } = CONFIG[type];

  return (
    <main
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center gap-6 bg-[var(--color-bg)] px-6 pb-12 pt-8 text-center",
        className,
      )}
    >
      <div className="relative flex h-36 w-36 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--color-border)]">
        <div className="absolute inset-3 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border-strong)] opacity-60" />
        <Icon className="relative h-14 w-14 text-[var(--color-text-muted)]" strokeWidth={1.15} />
      </div>

      <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        {badge}
      </span>

      <div className="max-w-xs">
        <h1 className="text-[var(--text-xl)] font-semibold text-[var(--color-text-primary)]">{title}</h1>
        <p className="mt-2 text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">{message}</p>
      </div>

      <Button type="button" onClick={() => navigate("/home", { replace: true })} className="min-w-[12rem]">
        Take Me Home
      </Button>
    </main>
  );
}
