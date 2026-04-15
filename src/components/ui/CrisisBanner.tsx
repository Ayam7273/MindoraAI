import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";

const btnClass =
  "inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-95";

export function CrisisBanner() {
  const emergencyPhone = useUiStore((s) => s.profile?.emergency_contact ?? "");
  const clearCrisisProtocol = useUiStore((s) => s.setCrisisMode);
  const digits = emergencyPhone.replace(/[^\d+]/g, "");
  const emergencyHref = digits.length >= 3 ? `tel:${digits}` : undefined;

  return (
    <Card className="mb-4 border-2 border-[var(--color-accent-orange)] bg-[var(--color-surface)]">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          🆘
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--color-accent-orange)]">Suicidal Mental Pattern Detected by AI!</p>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Crisis support is now active. If you are in immediate danger, call local emergency services. You are not alone.
          </p>
          <p className="mt-2 text-xs font-semibold text-[var(--color-primary)]">Crisis Support Now Active</p>
          <a href="tel:988" className={cn(btnClass, "mt-4 bg-[var(--color-accent-purple)] text-white")}>
            Call For Help! 📞
          </a>
          {emergencyHref ? (
            <a href={emergencyHref} className={cn(btnClass, "mt-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)]")}>
              Emergency contact
            </a>
          ) : null}
          <button type="button" className="mt-3 text-[11px] font-semibold text-[var(--color-text-muted)] underline" onClick={() => clearCrisisProtocol(false)}>
            I&apos;ve reached help — clear banner
          </button>
        </div>
      </div>
    </Card>
  );
}
