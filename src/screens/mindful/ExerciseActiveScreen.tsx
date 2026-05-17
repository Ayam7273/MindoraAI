import { useEffect, useState } from "react";
import { Pause, Play, Wind, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhaseConfig {
  label: string;
  duration: number; // seconds
  color: string;
  scale: number;
}

const PHASES: PhaseConfig[] = [
  { label: "Breathe in", duration: 4, color: "#d4e4c4", scale: 1 },
  { label: "Hold", duration: 1, color: "#e8f0dc", scale: 1 },
  { label: "Breathe out", duration: 4, color: "#f5e0d0", scale: 0.55 },
  { label: "Rest", duration: 1, color: "#faf8f4", scale: 0.55 },
];

const SESSION_OPTIONS = [
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

export function ExerciseActiveScreen() {
  const navigate = useNavigate();
  const [sessionSecs, setSessionSecs] = useState(120);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  const phase = PHASES[phaseIdx];
  const remaining = Math.max(0, sessionSecs - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = elapsed / sessionSecs;

  // Advance phase timer
  useEffect(() => {
    if (!started || paused || remaining === 0) return;
    const id = window.setInterval(() => {
      setElapsed((e) => e + 1);
      setPhaseElapsed((pe) => {
        const next = pe + 1;
        if (next >= phase.duration) {
          setPhaseIdx((pi) => (pi + 1) % PHASES.length);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, paused, remaining, phase.duration]);

  useEffect(() => {
    if (remaining === 0 && started) {
      navigate("/mindful/complete");
    }
  }, [remaining, started, navigate]);

  if (!started) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
        <Wind className="h-16 w-16 text-[var(--color-accent-green)]" strokeWidth={1.5} />
        <h1 className="mt-6 text-2xl font-bold text-[var(--color-primary)]">Breathing Exercise</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Box breathing (4-1-4-1) helps calm your nervous system. Choose a session length:
        </p>
        <div className="mt-8 flex gap-3">
          {SESSION_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSessionSecs(opt.seconds)}
              className={cn(
                "rounded-full px-5 py-3 text-sm font-bold transition-colors",
                sessionSecs === opt.seconds
                  ? "bg-[var(--color-accent-green)] text-white"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-primary)]",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white shadow-lg transition-transform active:scale-95"
          aria-label="Start breathing exercise"
        >
          <Play className="h-9 w-9 fill-white" />
        </button>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">Tap to start</p>
        <button
          type="button"
          className="mt-8 text-sm text-[var(--color-text-muted)] underline"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center transition-colors duration-700"
      style={{ background: phase.color }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/10"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-[#1A1208]" />
      </button>

      {/* Breathing circle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseIdx}
          animate={{ scale: phase.scale }}
          transition={{
            duration: phase.duration,
            ease: phaseIdx === 0 || phaseIdx === 1 ? "easeInOut" : "easeInOut",
          }}
          className="relative flex h-48 w-48 items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-white/30 shadow-[0_0_0_16px_rgba(255,255,255,0.15)]" />
          <div className="absolute inset-4 rounded-full bg-white/50" />
          <div className="absolute inset-8 rounded-full bg-white/70" />
        </motion.div>
      </AnimatePresence>

      <h1 className="mt-10 text-3xl font-bold text-[#1A1208]">{phase.label}</h1>
      <p className="mt-2 text-sm text-[#1A1208]/60">
        {phase.duration - phaseElapsed}s remaining in phase
      </p>

      {/* Session timer */}
      <p className="mt-8 font-mono text-2xl font-bold tabular-nums text-[#1A1208]">
        {mm}:{ss}
      </p>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full max-w-xs rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center gap-8">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-95"
          aria-label={paused ? "Resume" : "Pause"}
        >
          {paused ? (
            <Play className="h-7 w-7 fill-[var(--color-primary)] text-[var(--color-primary)]" />
          ) : (
            <Pause className="h-7 w-7 fill-[var(--color-primary)] text-[var(--color-primary)]" />
          )}
        </button>
      </div>

      <button
        type="button"
        className="mt-10 text-sm font-semibold text-[#1A1208]/70 underline"
        onClick={() => navigate("/mindful/complete")}
      >
        Finish early
      </button>
    </div>
  );
}
