import { useEffect, useState } from "react";
import { ChevronLeft, Pause, SkipForward } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function CoursePlayerScreen() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [sec, setSec] = useState(5 * 60 + 55);

  useEffect(() => {
    const t = window.setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <div className="flex min-h-dvh flex-col bg-[#6B8F47] text-[#FAF8F4]">
      <header className="flex items-center px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <p className="flex-1 text-center text-sm font-semibold">Playing · {courseId}</p>
        <span className="w-10" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-[10px] border-white/30">
          <div className="absolute inset-4 rounded-full border-[6px] border-white/50" />
          <button type="button" className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#3B2A1A]" aria-label="Pause">
            <Pause className="h-7 w-7" fill="currentColor" />
          </button>
        </div>
        <p className="mt-8 font-mono text-4xl font-bold tabular-nums">
          {mm}:{ss}
        </p>
        <p className="mt-2 text-center text-sm text-white/80">Mindfulness 101 — intro session</p>
      </div>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mb-4 flex items-center justify-center gap-6">
          <SkipForward className="h-6 w-6 rotate-180 opacity-60" />
          <SkipForward className="h-6 w-6 opacity-60" />
        </div>
        <div className="rounded-2xl bg-white/95 p-3 text-[#3B2A1A] shadow-lg">
          <p className="text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Next up</p>
          <p className="text-sm font-bold">First Session Meditation</p>
          <p className="text-xs text-[var(--color-text-muted)]">15 min · ⭐ 4.5</p>
        </div>
        <Button type="button" className="mt-4 w-full rounded-full bg-[#3B2A1A]" onClick={() => navigate(`/resources/complete/${courseId ?? "1"}`)}>
          Mark lesson complete
        </Button>
      </div>
    </div>
  );
}
