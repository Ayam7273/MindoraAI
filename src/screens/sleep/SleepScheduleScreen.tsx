import { useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function SleepScheduleScreen() {
  const [snooze, setSnooze] = useState(3);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="New Sleep Schedule" />
      <div className="space-y-5 px-4 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Sleep At
            <select className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-3 text-[var(--color-primary)]">
              <option>11:00 PM</option>
              <option>10:30 PM</option>
            </select>
          </label>
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Wake Up At
            <select className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-3 py-3 text-[var(--color-primary)]">
              <option>07:00 AM</option>
              <option>06:30 AM</option>
            </select>
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">Repeat Snooze ({snooze})</p>
          <input type="range" min={1} max={5} value={snooze} onChange={(e) => setSnooze(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-accent-orange)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">Auto-Repeat</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const on = days.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays((s) => (on ? s.filter((x) => x !== d) : [...s, d]))}
                  className={`h-10 w-10 rounded-full text-xs font-bold ${on ? "bg-[var(--color-primary)] text-white" : "bg-white ring-1 ring-[var(--color-border)]"}`}
                >
                  {d.slice(0, 1)}
                </button>
              );
            })}
          </div>
        </div>
        <Toggle label="Auto Display Sleep Stats" defaultChecked />
        <Toggle label="Auto Set Alarm" defaultChecked />
        <Button type="button" fullWidth className="rounded-full bg-[var(--color-accent-orange)] text-white">
          Set Sleep Schedule +
        </Button>
      </div>
    </div>
  );
}
