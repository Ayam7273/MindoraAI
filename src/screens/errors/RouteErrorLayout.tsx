import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface RouteErrorLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  illustration: ReactNode;
  className?: string;
}

export function RouteErrorLayout({
  title,
  subtitle,
  badge,
  illustration,
  className,
}: RouteErrorLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("flex min-h-dvh flex-col bg-[#FAF8F4]", className)}>
      <header className="flex items-center px-2 py-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-16 text-center">
        <div className="flex h-40 w-40 items-center justify-center text-7xl">{illustration}</div>
        <h1 className="text-xl font-bold text-[var(--color-primary)]">{title}</h1>
        <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">{subtitle}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-orange-light)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-orange)] ring-1 ring-[var(--color-accent-orange)]/25">
          {badge}
        </span>
        <Button
          type="button"
          onClick={() => navigate("/home", { replace: true })}
          className="mt-4 min-w-[14rem] rounded-full bg-[#3B2A1A] text-[#FAF8F4] hover:bg-[#2a1d12]"
        >
          Take Me Home 🏠
        </Button>
      </main>
    </div>
  );
}
