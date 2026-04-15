import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const HEAT = Array.from({ length: 35 }, (_, i) => ({ i, v: [0, 1, 2, 0, 1, 2, 2][i % 7] }));

export function JournalScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <div className="relative overflow-hidden rounded-b-[var(--radius-xl)] bg-[#3B2A1A] px-5 pb-16 pt-4 text-white">
        <p className="text-4xl font-bold">34</p>
        <p className="text-sm text-white/70">Journals this year</p>
        <button
          type="button"
          onClick={() => navigate("/journal/new")}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#3B2A1A] shadow-lg"
          aria-label="Add journal"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="-mt-8 space-y-5 px-4">
        <Card className="relative z-10">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--color-primary)]">Journal Overview</h2>
            <Link to="/journal/list" className="text-xs font-semibold text-[var(--color-accent-green)]">
              Timeline
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {HEAT.map(({ i, v }) => (
              <span
                key={i}
                className={cn(
                  "aspect-square rounded-sm",
                  v === 0 && "bg-[var(--color-accent-green)]",
                  v === 1 && "bg-[var(--color-accent-orange)]",
                  v === 2 && "bg-[var(--color-border)]",
                )}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--color-primary)]">Journal Statistics</h2>
          <p className="text-xs text-[var(--color-text-muted)]">Feb 2023</p>
          <div className="mt-4 flex h-40 items-end justify-center gap-4">
            {[
              { n: 81, l: "Skipped", c: "bg-[var(--color-primary)]", icon: "✕" },
              { n: 32, l: "Negative", c: "bg-[var(--color-accent-orange)]", icon: "−" },
              { n: 44, l: "Positive", c: "bg-[var(--color-success)]", icon: "+" },
            ].map((b) => (
              <div key={b.l} className="flex flex-col items-center gap-2">
                <div className={`flex w-14 flex-col justify-end rounded-t-[var(--radius-lg)] ${b.c}`} style={{ height: `${b.n}px` }}>
                  <span className="pb-1 text-center text-lg text-white">{b.icon}</span>
                </div>
                <p className="text-center text-[10px] font-semibold text-[var(--color-text-secondary)]">
                  {b.n} {b.l}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Button type="button" fullWidth className="rounded-full" onClick={() => navigate("/journal/new")}>
          New journal +
        </Button>
      </div>
    </div>
  );
}
