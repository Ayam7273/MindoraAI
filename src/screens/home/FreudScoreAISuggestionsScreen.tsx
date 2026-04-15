import { Activity, ChevronRight, Leaf, Stethoscope, Users } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    title: "Mindfulness Activities",
    desc: "Breathing, Relax — 25–30min",
    icon: Leaf,
    color: "text-[var(--color-success)] bg-[var(--color-accent-green-light)]",
  },
  {
    title: "Physical Activities",
    desc: "Jogging, Running, Swimming",
    icon: Activity,
    color: "text-[var(--color-accent-purple)] bg-[#ede8f5]",
  },
  {
    title: "Social Connection",
    desc: "Party, Binge Watching",
    icon: Users,
    color: "text-[var(--color-info)] bg-[#e8f2fc]",
  },
  {
    title: "Professional Support",
    desc: "Psychiatrist, Mentor",
    icon: Stethoscope,
    color: "text-[var(--color-accent-orange)] bg-[var(--color-accent-orange-light)]",
  },
] as const;

export function FreudScoreAISuggestionsScreen() {
  return (
    <div className="min-h-dvh bg-[#FAF8F4]">
      <TopBar title="AI Score Suggestions" showSearch={false} />
      <ul className="divide-y divide-[var(--color-border)] px-2">
        {ROWS.map((row) => (
          <li key={row.title}>
            <button type="button" className="flex w-full items-center gap-3 px-3 py-4 text-left">
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-full", row.color)}>
                <row.icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--color-text-primary)]">{row.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{row.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
