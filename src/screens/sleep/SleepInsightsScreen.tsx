import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

const TABS = ["1 Day", "1 Week", "1 Month", "1 Year", "All Time"] as const;
const AI = ["Loud Snoring", "Pillow Improvement", "Temperature Adjustment", "Sleep Irregularity"];

export function SleepInsightsScreen() {
  const [tab, setTab] = useState(1);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="Sleep Insights" showSearch={false} rightAction={<FilterBtn onClick={() => setOpen(true)} />} />
      <div className="flex gap-2 overflow-x-auto px-3 py-3">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${i === tab ? "bg-[var(--color-primary)] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mx-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
        <p className="text-center text-xs text-[var(--color-text-muted)]">Grouped stages </p>
        <div className="mt-4 flex h-40 items-end justify-between gap-1">
          {[0.6, 0.45, 0.7, 0.5, 0.55, 0.65, 0.4].map((h, i) => (
            <div key={i} className="flex flex-1 gap-0.5">
              <div className="flex-1 rounded-t bg-[var(--color-success)]" style={{ height: `${h * 100}%` }} />
              <div className="flex-1 rounded-t bg-[var(--color-accent-orange)]" style={{ height: `${h * 80}%` }} />
              <div className="flex-1 rounded-t bg-[var(--color-border)]" style={{ height: `${h * 40}%` }} />
            </div>
          ))}
        </div>
      </div>
      <ul className="mt-4 px-4">
        {AI.map((item) => (
          <li key={item} className="mb-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
            <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium" onClick={() => setExpanded((e) => (e === item ? null : item))}>
              {item}
              <span>{expanded === item ? "⌃" : "›"}</span>
            </button>
            {expanded === item ? <p className="border-t border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-text-secondary)]">AI insight placeholder for {item}.</p> : null}
          </li>
        ))}
      </ul>

      <Sheet open={open} onClose={() => setOpen(false)} title="Filter Sleep">
        <div className="space-y-3">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Start Date
            <input type="date" className="mt-1 w-full rounded-md border border-[var(--color-border)] px-2 py-2" />
          </label>
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            End Date
            <input type="date" className="mt-1 w-full rounded-md border border-[var(--color-border)] px-2 py-2" />
          </label>
          <p className="text-xs font-medium">Sleep duration</p>
          <input type="range" className="w-full accent-[var(--color-primary)]" />
          <Toggle label="Include AI Suggestion" defaultChecked />
          <Button type="button" fullWidth className="rounded-full" onClick={() => setOpen(false)}>
            Filter Sleep (21)
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

function FilterBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-full text-[#FAF8F4] hover:bg-white/10" aria-label="Filter">
      <SlidersHorizontal className="h-5 w-5" />
    </button>
  );
}
