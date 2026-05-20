import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Moon, Star } from "lucide-react";
import { useSleepEntries, useAddSleepEntry } from "@/hooks/useSleepEntries";
import { useUiStore } from "@/store/uiStore";
import { genAI } from "@/lib/gemini";
import type { SleepEntryRow } from "@/types/database";

// ── helpers ────────────────────────────────────────────────────────────────

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

type QualityLabel = "Excellent" | "Good" | "Fair" | "Poor";

function qualityFromHours(hours: number): QualityLabel {
  if (hours >= 8) return "Excellent";
  if (hours >= 6) return "Good";
  if (hours >= 4) return "Fair";
  return "Poor";
}

function qualityBadgeClass(label: QualityLabel): string {
  switch (label) {
    case "Excellent": return "bg-green-100 text-green-700";
    case "Good":      return "bg-blue-100 text-blue-700";
    case "Fair":      return "bg-orange-100 text-orange-700";
    case "Poor":      return "bg-red-100 text-red-700";
  }
}

// ── component ──────────────────────────────────────────────────────────────

export function SleepQualityScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);

  const [sleeping, setSleeping] = useState(false);
  const [sleepStart, setSleepStart] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [aiRating, setAiRating] = useState<string | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: history = [] } = useSleepEntries(userId);
  const addEntry = useAddSleepEntry();

  // Keep clock ticking when idle
  useEffect(() => {
    clockRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => { if (clockRef.current) clearInterval(clockRef.current); };
  }, []);

  // Tick elapsed while sleeping
  useEffect(() => {
    if (sleeping) {
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sleeping]);

  function handleSleep() {
    setSleepStart(new Date());
    setElapsed(0);
    setAiRating(null);
    setSleeping(true);
  }

  async function handleWakeUp() {
    if (!sleepStart) return;
    setSleeping(false);
    const wakeAt = new Date();
    const duration_hours = elapsed / 3600;

    // Save to Supabase
    if (userId) {
      try {
        await addEntry.mutateAsync({
          user_id: userId,
          sleep_at: sleepStart.toISOString(),
          wake_at: wakeAt.toISOString(),
          duration_hours,
          rem_hours: null,
          core_hours: null,
          quality: null,
          ai_suggestions: null,
        });
      } catch {
        // non-blocking — continue to show AI rating even if save fails
      }
    }

    // Ask Gemini to rate the sleep
    if (genAI) {
      setRatingLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const hours = duration_hours.toFixed(1);
        const prompt = `The user slept for ${hours} hours. Rate their sleep quality in 2-3 sentences. Include: quality label (Excellent/Good/Fair/Poor), whether the duration is healthy, and one gentle recommendation. Be warm and concise.`;
        const result = await model.generateContent(prompt);
        setAiRating(result.response.text());
      } catch {
        setAiRating("We couldn't rate your sleep right now, but well done for tracking it!");
      } finally {
        setRatingLoading(false);
      }
    } else {
      const label = qualityFromHours(duration_hours);
      setAiRating(`${label} sleep of ${duration_hours.toFixed(1)} hours recorded. Keep it up!`);
    }
  }

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-dvh pb-28 transition-colors duration-700"
      style={sleeping ? {
        background: "radial-gradient(ellipse at 20% 30%, #2a1a4a 0%, #0d0d1a 60%, #111122 100%)",
      } : {
        background: "var(--color-bg, #FAF8F4)",
      }}
    >
      {/* Starfield overlay when sleeping */}
      {sleeping && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
              radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 40% 25%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 55% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.7) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 80% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 60% 90%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 35% 45%, rgba(255,255,255,0.6) 0%, transparent 100%)
            `,
          }}
        />
      )}

      {/* Header */}
      <div
        className="relative z-10"
        style={{ background: sleeping ? "transparent" : "#3B2A1A" }}
      >
        <div className="h-[env(safe-area-inset-top,0px)]" aria-hidden />
        <header className="flex items-center px-2 py-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-center text-lg font-semibold text-white">
            Sleep Tracker
          </h1>
          <span className="w-10 shrink-0" />
        </header>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-lg px-4 pt-8">

        {/* ── Hero ── */}
        <div className="flex flex-col items-center text-center">

          {!sleeping ? (
            /* ── Idle state ── */
            <>
              {/* Moon icon */}
              <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-[#3B2A1A]/10 shadow-lg">
                <Moon className="h-14 w-14 text-[#3B2A1A]" strokeWidth={1.5} />
              </div>

              <h2 className="mb-1 text-3xl font-bold text-[#3B2A1A]">Ready to sleep?</h2>
              <p className="mb-2 text-sm text-[var(--color-text-secondary,#888)]">
                Tap the button when you go to bed
              </p>

              {/* Live clock */}
              <p className="mb-8 text-5xl font-bold tabular-nums text-[#3B2A1A]">
                {formatTime(now)}
              </p>

              {/* Sleep button */}
              <button
                type="button"
                onClick={handleSleep}
                className="flex h-36 w-36 flex-col items-center justify-center rounded-full shadow-xl transition-transform active:scale-95"
                style={{ background: "var(--color-accent-green, #4CAF50)" }}
              >
                <Moon className="mb-1 h-10 w-10 text-white" strokeWidth={1.5} />
                <span className="text-lg font-bold text-white">Sleep</span>
              </button>
            </>
          ) : (
            /* ── Sleeping state ── */
            <>
              {/* Pulsing moon */}
              <div
                className="mb-6 flex h-32 w-32 items-center justify-center rounded-full"
                style={{
                  background: "rgba(147, 112, 219, 0.2)",
                  boxShadow: "0 0 40px 10px rgba(147, 112, 219, 0.25)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              >
                <Moon className="h-16 w-16 text-[#c8b6ff]" strokeWidth={1.2} />
              </div>

              <p className="mb-1 text-sm font-medium text-purple-200 uppercase tracking-widest">
                Sleeping...
              </p>

              {/* Elapsed timer */}
              <p
                className="mb-2 text-6xl font-bold tabular-nums text-white"
                style={{ textShadow: "0 0 20px rgba(200, 182, 255, 0.5)" }}
              >
                {formatElapsed(elapsed)}
              </p>

              {sleepStart && (
                <p className="mb-8 text-sm text-purple-300">
                  Started at {formatTime(sleepStart)}
                </p>
              )}

              {/* Wake Up button */}
              <button
                type="button"
                onClick={() => void handleWakeUp()}
                className="rounded-full px-10 py-4 text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
                style={{ background: "var(--color-accent-orange, #FF9800)" }}
              >
                Wake Up
              </button>
            </>
          )}
        </div>

        {/* ── AI Rating card ── */}
        {(ratingLoading || aiRating) && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" fill="currentColor" />
              <span className="text-sm font-semibold text-green-800">AI Sleep Rating</span>
            </div>
            {ratingLoading ? (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                Analysing your sleep...
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-green-900">{aiRating}</p>
            )}
          </div>
        )}

        {/* ── Sleep History ── */}
        <section className="mt-10">
          <h2
            className="mb-3 text-sm font-bold"
            style={{ color: sleeping ? "rgba(255,255,255,0.7)" : "var(--color-primary, #3B2A1A)" }}
          >
            Sleep History
          </h2>

          {history.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 rounded-2xl py-10 text-center"
              style={{ background: sleeping ? "rgba(255,255,255,0.05)" : "rgba(59,42,26,0.04)" }}
            >
              <Moon
                className="h-8 w-8"
                style={{ color: sleeping ? "rgba(255,255,255,0.3)" : "var(--color-text-muted, #bbb)" }}
              />
              <p
                className="text-sm"
                style={{ color: sleeping ? "rgba(255,255,255,0.4)" : "var(--color-text-muted, #bbb)" }}
              >
                No sleep tracked yet. Tap Sleep to begin.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {(history as SleepEntryRow[]).map((entry) => {
                const hours = entry.duration_hours ?? 0;
                const label = qualityFromHours(hours);
                return (
                  <li
                    key={entry.id}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3"
                    style={{ background: sleeping ? "rgba(255,255,255,0.07)" : "white", boxShadow: sleeping ? "none" : "0 1px 4px rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                      style={{ background: sleeping ? "rgba(147,112,219,0.2)" : "rgba(59,42,26,0.08)" }}
                    >
                      <Moon
                        className="h-4 w-4"
                        style={{ color: sleeping ? "#c8b6ff" : "#3B2A1A" }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-xs"
                        style={{ color: sleeping ? "rgba(255,255,255,0.5)" : "var(--color-text-muted, #888)" }}
                      >
                        {entry.sleep_at ? formatDate(entry.sleep_at) : formatDate(entry.created_at)}
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: sleeping ? "white" : "var(--color-primary, #3B2A1A)" }}
                      >
                        {hours.toFixed(1)}h
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${qualityBadgeClass(label)}`}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
