import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";

type Phase = "idle" | "loading" | "suggestions" | "notfound" | "results";

const SUGGESTIONS = [
  "Meditation Practice",
  "Meditation Schedule",
  "Meditation AI Suggestion",
  "My Meditation",
  "Medic",
];

const RESULTS = [
  { title: "My Mood History", section: "Mood & Emotions", color: "bg-[var(--color-accent-green)]" },
  { title: "Sleep Quality Log", section: "Sleep", color: "bg-[var(--color-accent-orange)]" },
  { title: "Mindful Hours", section: "Mindfulness", color: "bg-[var(--color-accent-yellow)]" },
  { title: "Stress Management", section: "Stress", color: "bg-purple-400" },
  { title: "Help Center FAQ", section: "Help", color: "bg-[#3B2A1A]" },
];

const CHIPS = ["Sleep", "Mood", "Meditation", "Help"];

export function SearchScreen() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [filterOpen, setFilterOpen] = useState(false);
  const [cat, setCat] = useState<"journal" | "sleep" | "community">("sleep");
  const [filterDate, setFilterDate] = useState("2026-01-25");
  const [limit, setLimit] = useState(45);
  const highlighted = useMemo(() => (q.trim().toLowerCase().startsWith("meditation") ? 1 : 0), [q]);

  const runSearch = () => {
    const t = q.trim().toLowerCase();
    if (!t) return;
    setPhase("loading");
    window.setTimeout(() => {
      if (t === "404test" || t === "notfound") setPhase("notfound");
      else if (t.length < 3) setPhase("suggestions");
      else setPhase("results");
    }, 900);
  };

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="bg-[#3B2A1A] px-3 pb-4 pt-[max(0.5rem,env(safe-area-inset-top))] text-[#FAF8F4]">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10" aria-label="Back">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="shrink-0 text-sm font-semibold">Search</h1>
          <div className="relative flex min-w-0 flex-1 items-center rounded-full bg-white/95 px-3 py-2 text-[#3B2A1A]">
            <span className="mr-1 text-[var(--color-text-muted)]">🔍</span>
            <input
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                if (v.length === 0) setPhase("idle");
                else if (v.length >= 3) setPhase("suggestions");
              }}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Search Mindora AI..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-muted)]"
            />
            <button type="button" onClick={() => setFilterOpen(true)} className="shrink-0 p-1" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative px-4 pt-6">
        {phase === "loading" && (
          <div className="flex flex-col items-center py-20">
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-3 w-3 rounded-full animate-pulse",
                    i === 3 ? "bg-[var(--color-accent-green)]" : "bg-[#E8E4DC]",
                    i === 1 && "[animation-delay:120ms]",
                    i === 2 && "[animation-delay:240ms]",
                    i === 3 && "[animation-delay:360ms]",
                  )}
                />
              ))}
            </div>
            <p className="mt-6 text-sm font-medium text-[var(--color-primary)]">Loading...</p>
          </div>
        )}

        {phase === "suggestions" && q.length >= 2 && (
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-md">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setQ(s);
                  setPhase("results");
                }}
                className={cn(
                  "block w-full border-b border-[var(--color-border)] px-4 py-3 text-left text-sm last:border-0",
                  i === highlighted && "bg-[var(--color-bg-secondary)]",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {phase === "notfound" && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="text-7xl" aria-hidden>
              🧔
            </div>
            <h2 className="mt-6 text-xl font-bold text-[#3B2A1A]">Not Found 😟</h2>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">
              Unfortunately, the key you entered cannot be found. 404 Error please try another keyword or check again.
            </p>
          </div>
        )}

        {phase === "results" && (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--color-primary)]">871 Results Found</p>
              <button type="button" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-[var(--color-border)]">
                Newest <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {CHIPS.map((c) => (
                <span key={c} className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-[var(--color-border)]">
                  {c}
                </span>
              ))}
            </div>
            <ul className="space-y-2">
              {RESULTS.map((r) => (
                <li key={r.title}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3 text-left shadow-sm"
                  >
                    <span className={cn("h-10 w-10 shrink-0 rounded-full", r.color)} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--color-primary)]">{r.title}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">In {r.section}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-text-muted)]" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {phase === "idle" && q.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--color-text-muted)]">Type a keyword and press enter to search.</p>
        )}
      </div>

      <div className="px-4 pt-4">
        <Button type="button" variant="secondary" fullWidth className="rounded-full text-xs" onClick={() => setPhase("notfound")}>
          Demo: show Not Found
        </Button>
      </div>

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter Search Result">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">Search Category</p>
            <div className="flex gap-2">
              {(["journal", "sleep", "community"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-bold capitalize",
                    cat === c ? "bg-[var(--color-accent-orange)] text-white" : "bg-[var(--color-bg-secondary)] text-[var(--color-primary)]",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Search Date
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2"
            />
          </label>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Search Limit ({limit})</p>
            <input type="range" min={20} max={50} value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="mt-2 w-full accent-[#3B2A1A]" />
          </div>
          <Toggle label="Include AI suggestion" checked onChange={() => {}} />
          <Button type="button" fullWidth className="rounded-full" onClick={() => setFilterOpen(false)}>
            Filter Search Results (21) ↕
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
