import { useEffect, useState } from "react";
import { ChevronLeft, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useStressEntries } from "@/hooks/useStressEntries";
import { useUiStore } from "@/store/uiStore";
import { generateText } from "@/lib/aiHelpers";
import type { StressEntryRow } from "@/types/database";

// ─── constants ────────────────────────────────────────────────────────────────

const LEVELS = [
  { v: 1, label: "Calm",     color: "#22c55e" },
  { v: 2, label: "Normal",   color: "#84cc16" },
  { v: 3, label: "Elevated", color: "#f59e0b" },
  { v: 4, label: "Stressed", color: "#f97316" },
  { v: 5, label: "Extreme",  color: "#ef4444" },
] as const;

function getMeta(v: number) {
  return LEVELS.find((l) => l.v === Math.round(v)) ?? LEVELS[2];
}

function levelColor(v: number): string {
  return getMeta(v).color;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Returns ISO date string "YYYY-MM-DD" for a date offset by `daysAgo` from today. */
function offsetDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/** 3-letter day label for a date offset by `daysAgo`. */
function dayLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

interface WeekBar {
  day: string;
  avg: number | null;
}

function buildWeekBars(entries: StressEntryRow[]): WeekBar[] {
  const bars: WeekBar[] = [];
  for (let ago = 6; ago >= 0; ago--) {
    const key = offsetDate(ago);
    const dayEntries = entries.filter((e) => e.created_at.slice(0, 10) === key);
    const avg =
      dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.stress_level, 0) / dayEntries.length
        : null;
    bars.push({ day: dayLabel(ago), avg });
  }
  return bars;
}

// ─── component ────────────────────────────────────────────────────────────────

export function StressLevelScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { data: entries = [], isLoading } = useStressEntries(userId);

  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── today's most recent entry ────────────────────────────────────────────
  const todayEntry = entries.find((e) => isToday(e.created_at)) ?? null;
  const latestLevel = todayEntry?.stress_level ?? null;
  const latestMeta = latestLevel ? getMeta(latestLevel) : null;
  const barWidth = latestLevel ? `${((latestLevel - 1) / 4) * 100}%` : "0%";

  // ── weekly bars ──────────────────────────────────────────────────────────
  const weekBars = buildWeekBars(entries);

  // ── recent history (last 5) ──────────────────────────────────────────────
  const recentEntries = entries.slice(0, 5);

  // ── AI tip ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!latestLevel) return;
    let cancelled = false;
    setAiLoading(true);
    const label = getMeta(latestLevel).label;
    generateText(
      `Give one short, compassionate stress-management tip (2-3 sentences) for someone with ${label} stress (level ${latestLevel}/5). Be specific and practical.`
    )
      .then((res) => {
        if (!cancelled) setAiTip(res);
      })
      .catch(() => {
        if (!cancelled) setAiTip(null);
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });
    return () => { cancelled = true; };
  }, [latestLevel]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-32">
      {/* ── Header ── */}
      <div
        className="pt-[max(0.5rem,env(safe-area-inset-top))] text-white"
        style={{ backgroundColor: "#3B2A1A" }}
      >
        <div className="flex items-center px-2 py-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold">Stress Level</h1>
          <span className="w-10" />
        </div>

        {/* ── Today's Stress Card (inside header band) ── */}
        <div className="mx-4 mb-6 mt-3 rounded-2xl bg-white/10 p-6">
          {isLoading ? (
            <p className="text-center text-sm text-white/60">Loading…</p>
          ) : latestLevel && latestMeta ? (
            <>
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/60">
                Today&apos;s Stress
              </p>
              <p
                className="mt-1 text-center text-7xl font-bold tabular-nums leading-none"
                style={{ color: latestMeta.color }}
              >
                {latestLevel}
              </p>
              <p className="mt-1 text-center text-base font-semibold text-white">
                {latestMeta.label}
              </p>
              {/* Progress bar */}
              <div className="mx-auto mt-4 h-3 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: barWidth,
                    background: `linear-gradient(to right, #22c55e, ${latestMeta.color})`,
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between px-0 text-[10px] text-white/50 max-w-xs mx-auto">
                <span>Calm</span>
                <span>Extreme</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
              <p className="text-sm text-white/70">No stress logged today</p>
              <button
                type="button"
                onClick={() => navigate("/stress/log")}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow"
              >
                + Log Stress
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-5">
        {/* ── Weekly Trend ── */}
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#3B2A1A]" />
            <h2 className="text-sm font-bold text-[#3B2A1A]">7-Day Trend</h2>
          </div>
          <div className="flex items-end justify-between gap-1" style={{ height: 80 }}>
            {weekBars.map((bar) => (
              <div key={bar.day} className="flex flex-1 flex-col items-center gap-1">
                {bar.avg !== null ? (
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(bar.avg / 5) * 64}px`,
                      backgroundColor: levelColor(bar.avg),
                    }}
                  />
                ) : (
                  <div className="w-full rounded-t-md bg-gray-100" style={{ height: 8 }} />
                )}
                <span className="text-[9px] text-gray-400">{bar.day}</span>
              </div>
            ))}
          </div>
          {/* legend */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {LEVELS.map((l) => (
              <span key={l.v} className="flex items-center gap-1 text-[10px] text-gray-500">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                {l.label}
              </span>
            ))}
          </div>
        </section>

        {/* ── AI Insight card ── */}
        {(aiLoading || aiTip) && (
          <section className="rounded-2xl bg-amber-50 p-4 shadow-sm ring-1 ring-amber-200">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-bold text-amber-800">AI Insight</h2>
            </div>
            {aiLoading ? (
              <p className="text-sm text-amber-600 animate-pulse">Generating insight…</p>
            ) : (
              <p className="text-sm leading-relaxed text-amber-900">{aiTip}</p>
            )}
          </section>
        )}

        {/* ── Recent History ── */}
        {recentEntries.length > 0 && (
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-[#3B2A1A]">Recent Entries</h2>
            <ul className="space-y-2">
              {recentEntries.map((entry) => {
                const meta = getMeta(entry.stress_level);
                const date = new Date(entry.created_at);
                const dateStr = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <li
                    key={entry.id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-[#FAF8F4] px-3 py-3"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-xs text-gray-400">{dateStr}</span>
                      {entry.stressors && entry.stressors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {entry.stressors.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-white"
                      style={{ backgroundColor: meta.color }}
                    >
                      {entry.stress_level} · {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {/* ── Log Stress button ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAF8F4]/90 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
        <Button
          type="button"
          fullWidth
          className="rounded-full bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
          onClick={() => navigate("/stress/log")}
        >
          Log Stress
        </Button>
      </div>
    </div>
  );
}
