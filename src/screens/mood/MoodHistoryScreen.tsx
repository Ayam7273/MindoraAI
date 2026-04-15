import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { Sheet } from "@/components/ui/Sheet";
import { Toggle } from "@/components/ui/Toggle";
import { TopBar } from "@/components/ui/TopBar";
import type { MoodKey } from "@/types";

const ENTRIES = [
  { id: "1", day: "Mon", time: "9:12 AM", duration: "1h 25m", mood: "happy" as MoodKey },
  { id: "2", day: "Sun", time: "8:01 PM", duration: "45m", mood: "neutral" as MoodKey },
  { id: "3", day: "Sat", time: "2:30 PM", duration: "2h", mood: "sad" as MoodKey },
];

const TYPES: MoodKey[] = ["depressed", "sad", "neutral", "happy", "overjoyed"];

export function MoodHistoryScreen() {
  const [sheet, setSheet] = useState(false);
  const [selected, setSelected] = useState<MoodKey[]>(["happy", "neutral"]);
  const [swing, setSwing] = useState(40);
  const [improve, setImprove] = useState(true);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="My Mood" showSearch={false} />
      <div className="px-4 pt-2">
        <Button type="button" fullWidth variant="secondary" className="rounded-full" onClick={() => setSheet(true)}>
          Filter Mood (25) ↕
        </Button>
        <ul className="mt-4 space-y-2">
          {ENTRIES.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]"
            >
              <div className="text-xs text-[var(--color-text-muted)]">
                <p className="font-semibold">{e.day}</p>
                <p>{e.time}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{e.duration}</p>
              </div>
              <MoodEmoji mood={e.mood} size={40} />
            </li>
          ))}
        </ul>
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Filter moods">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Mood type</p>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((m) => {
              const on = selected.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() =>
                    setSelected((s) => (on ? s.filter((x) => x !== m) : [...s, m]))
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    on
                      ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)]"
                      : "border-[var(--color-border)] bg-white"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <label className="block text-sm">
            <span className="text-[var(--color-text-secondary)]">Date</span>
            <input
              type="date"
              className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
            />
          </label>
          <div>
            <p className="text-sm text-[var(--color-text-secondary)]">Mood swing intensity</p>
            <input
              type="range"
              min={0}
              max={100}
              value={swing}
              onChange={(e) => setSwing(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--color-primary)]"
            />
          </div>
          <Toggle
            label="Show improvement"
            checked={improve}
            onChange={(e) => setImprove(e.target.checked)}
          />
          <Button type="button" fullWidth className="rounded-full" onClick={() => setSheet(false)}>
            Apply filters
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
