import { useEffect, useState } from "react";
import { Pause, SkipBack, SkipForward } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function ExerciseActiveScreen() {
  const navigate = useNavigate();
  const [inhale, setInhale] = useState(true);
  const [sec, setSec] = useState(5 * 60 + 21);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSec((s) => (s > 0 ? s - 1 : 0));
      setInhale((v) => !v);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center px-6 text-center text-[#1A1208] transition-colors duration-700",
        inhale ? "bg-[#d4e4c4]" : "bg-[#f5e0d0]",
      )}
    >
      <p className="text-sm font-medium opacity-70">Zen Garden · playing</p>
      <h1 className="mt-10 text-3xl font-bold">{inhale ? "Breathe In…" : "Breathe Out…"}</h1>
      <div className="mt-16 h-40 w-40 rounded-full border-4 border-white/60 shadow-[0_0_0_20px_rgba(255,255,255,0.15)]" />
      <p className="mt-12 font-mono text-2xl font-bold tabular-nums">
        {mm}:{ss} / 25:00
      </p>
      <div className="mt-4 h-1 w-full max-w-xs rounded-full bg-black/10">
        <div className="h-full w-1/3 rounded-full bg-[var(--color-primary)]" />
      </div>
      <div className="mt-10 flex items-center gap-8">
        <SkipBack className="h-8 w-8 opacity-60" />
        <button type="button" className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg" aria-label="Pause">
          <Pause className="h-7 w-7 fill-[var(--color-primary)] text-[var(--color-primary)]" />
        </button>
        <SkipForward className="h-8 w-8 opacity-60" />
      </div>
      <button type="button" className="mt-12 text-sm font-semibold text-[var(--color-primary)] underline" onClick={() => navigate("/mindful/complete")}>
        Finish early
      </button>
    </div>
  );
}
