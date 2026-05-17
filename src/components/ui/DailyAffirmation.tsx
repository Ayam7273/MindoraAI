import { Sparkles } from "lucide-react";

interface DailyAffirmationProps {
  text: string;
}

export function DailyAffirmation({ text }: DailyAffirmationProps) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-accent-green-light)] to-[#f0f7e8] p-4 ring-1 ring-[var(--color-accent-green)]/20">
      <div className="flex items-center gap-2 text-[var(--color-accent-green)]">
        <Sparkles className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Daily Affirmation</span>
      </div>
      <p className="mt-2 text-sm font-semibold italic leading-relaxed text-[var(--color-text-primary)]">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}
