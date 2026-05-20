import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Wind } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useMindfulSessions } from "@/hooks/useMindfulSessions";
import { useUiStore } from "@/store/uiStore";

export function MindfulHoursScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { data: sessions = [] } = useMindfulSessions(userId);

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const recentSessions = [...sessions].slice(0, 10);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28 lg:pb-8">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[var(--color-primary)]">
          Mindful Hours
        </h1>
        {/* spacer to keep title centered */}
        <span className="w-10 shrink-0" />
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-8 lg:pt-6">
        {/* Left: total + start */}
        <div>
          {/* Clean total header */}
          <div className="mx-4 mt-6 text-center lg:mx-0 lg:mt-0">
            <p className="text-5xl font-bold tabular-nums text-[var(--color-primary)]">{totalHours}h</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Total</p>
          </div>

          {/* Start Session button */}
          <div className="mx-4 mt-6 lg:mx-0">
            <button
              type="button"
              onClick={() => navigate("/mindful/exercise")}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-[var(--color-accent-green)] px-5 py-4 font-bold text-white shadow-[var(--shadow-md)] transition-transform active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-white" />
              Start Session
            </button>
          </div>
        </div>

        {/* Right: session history */}
        <div className="mt-6 px-4 lg:mt-0 lg:px-0">
          <h2 className="mb-3 text-sm font-bold text-[var(--color-primary)]">Session History</h2>
          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] px-4 py-10 text-center">
              <Wind className="h-10 w-10 text-[var(--color-border)]" strokeWidth={1.25} />
              <p className="font-semibold text-[var(--color-primary)]">No sessions yet</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Complete your first breathing session to see it here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentSessions.map((s) => {
                const mins = s.duration_minutes ?? 0;
                const ts = new Date(s.created_at);
                return (
                  <li key={s.id}>
                    <Card className="flex items-center gap-3 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]">
                        <Play className="h-5 w-5 fill-current" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--color-primary)]">
                          {s.type ? s.type.charAt(0).toUpperCase() + s.type.slice(1) : "Breathing Session"}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="inline-block rounded-full bg-[var(--color-bg-secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                            {mins} min
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {formatDistanceToNow(ts, { addSuffix: true })}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {format(ts, "MMM d, h:mm a")}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
