import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrisisBannerProps {
  compact?: boolean;
}

export function CrisisBanner({ compact = false }: CrisisBannerProps) {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-red-200 bg-red-50 p-3">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 overflow-hidden"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="truncate">In crisis? Get help now</span>
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-red-500" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-red-500" />
          )}
        </button>
        {expanded && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-red-800">
              Mindora is not a substitute for emergency services. If you are in crisis:
            </p>
            <a
              href="tel:988"
              className="flex items-center justify-center gap-2 rounded-full bg-red-600 py-2 text-xs font-bold text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              Call or text 988 (Suicide &amp; Crisis Lifeline)
            </a>
            <p className="text-center text-[10px] text-red-600">
              Available 24/7 · Free &amp; confidential
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border-2 border-[var(--color-accent-orange)] bg-[var(--color-accent-orange-light)] p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          🆘
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-red-700">You deserve support right now</p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Mindora is here to listen, but is not a substitute for emergency care. If you are in
            immediate danger, please reach out.
          </p>
          <a
            href="tel:988"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-red-600 py-2.5 text-sm font-bold text-white"
          >
            <Phone className="h-4 w-4" />
            Call or text 988
          </a>
          <p className="mt-1 text-center text-[10px] text-[var(--color-text-muted)]">
            US Suicide &amp; Crisis Lifeline · 24/7 · Free &amp; confidential
          </p>
        </div>
      </div>
    </div>
  );
}
