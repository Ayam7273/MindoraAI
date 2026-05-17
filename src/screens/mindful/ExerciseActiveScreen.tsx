import { useEffect, useRef, useState } from "react";
import { ChevronDown, Pause, Play, Volume2, VolumeX, Wind, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhaseConfig {
  label: string;
  duration: number;
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

const BASE = "https://raw.githubusercontent.com/Ayam7273/wave-wonders/main/public/sounds";

interface SoundOption {
  label: string;
  category: string;
  url: string;
}

const SOUNDS: SoundOption[] = [
  { label: "None", category: "off", url: "" },
  // Nature
  { label: "River", category: "Nature", url: `${BASE}/nature/river.mp3` },
  { label: "Waves", category: "Nature", url: `${BASE}/nature/waves.mp3` },
  { label: "Rain on leaves", category: "Rain", url: `${BASE}/rain/rain-on-leaves.mp3` },
  { label: "Light rain", category: "Rain", url: `${BASE}/rain/light-rain.mp3` },
  { label: "Campfire", category: "Nature", url: `${BASE}/nature/campfire.mp3` },
  { label: "Wind in trees", category: "Nature", url: `${BASE}/nature/wind-in-trees.mp3` },
  { label: "Waterfall", category: "Nature", url: `${BASE}/nature/waterfall.mp3` },
  { label: "Droplets", category: "Nature", url: `${BASE}/nature/droplets.mp3` },
  // Animals
  { label: "Birds", category: "Animals", url: `${BASE}/animals/birds.mp3` },
  { label: "Crickets", category: "Animals", url: `${BASE}/animals/crickets.mp3` },
  { label: "Cat purring", category: "Animals", url: `${BASE}/animals/cat-purring.mp3` },
  // Noise
  { label: "White noise", category: "Noise", url: `${BASE}/noise/white-noise.wav` },
  { label: "Pink noise", category: "Noise", url: `${BASE}/noise/pink-noise.wav` },
  { label: "Brown noise", category: "Noise", url: `${BASE}/noise/brown-noise.wav` },
  // Things
  { label: "Singing bowl", category: "Things", url: `${BASE}/things/singing-bowl.mp3` },
  { label: "Wind chimes", category: "Things", url: `${BASE}/things/wind-chimes.mp3` },
  { label: "Clock", category: "Things", url: `${BASE}/things/clock.mp3` },
  // Places
  { label: "Café", category: "Places", url: `${BASE}/places/cafe.mp3` },
  { label: "Temple", category: "Places", url: `${BASE}/places/temple.mp3` },
  { label: "Night village", category: "Places", url: `${BASE}/places/night-village.mp3` },
];

export function ExerciseActiveScreen() {
  const navigate = useNavigate();
  const [sessionSecs, setSessionSecs] = useState(120);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [soundIdx, setSoundIdx] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const phase = PHASES[phaseIdx];
  const remaining = Math.max(0, sessionSecs - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = elapsed / sessionSecs;
  const currentSound = SOUNDS[soundIdx];

  // Manage audio
  useEffect(() => {
    if (!currentSound.url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }
    if (!audioRef.current || audioRef.current.src !== currentSound.url) {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(currentSound.url);
      audio.loop = true;
      audio.volume = muted ? 0 : volume;
      audioRef.current = audio;
    }
    if (started && !paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    return () => {};
  }, [soundIdx, started, paused, currentSound.url]);

  // Volume / mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Phase timer
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
      if (audioRef.current) audioRef.current.pause();
      navigate("/mindful/complete");
    }
  }, [remaining, started, navigate]);

  if (!started) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#FAF8F4] px-6 text-center">
        <Wind className="h-16 w-16 text-[var(--color-accent-green)]" strokeWidth={1.5} />
        <h1 className="mt-6 text-2xl font-bold text-[var(--color-primary)]">Breathing Exercise</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Box breathing (4-1-4-1) calms your nervous system. Choose a session length:
        </p>

        {/* Session length */}
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

        {/* Sound picker */}
        <div className="mt-6 w-full max-w-xs">
          <p className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">Ambient sound</p>
          <button
            type="button"
            onClick={() => setSoundOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm shadow-sm"
          >
            <span className="font-medium text-[var(--color-text-primary)]">
              {currentSound.label}
              {currentSound.category !== "off" ? (
                <span className="ml-2 text-[10px] text-[var(--color-text-muted)]">{currentSound.category}</span>
              ) : null}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", soundOpen && "rotate-180")} />
          </button>
          {soundOpen && (
            <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-white shadow-md">
              {SOUNDS.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => { setSoundIdx(i); setSoundOpen(false); }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-[var(--color-bg-secondary)]",
                    i === soundIdx && "bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)] font-semibold",
                  )}
                >
                  {s.label}
                  {s.category !== "off" && (
                    <span className="text-[10px] text-[var(--color-text-muted)]">{s.category}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Volume */}
        {soundIdx > 0 && (
          <div className="mt-3 flex w-full max-w-xs items-center gap-3">
            <button type="button" onClick={() => setMuted((v) => !v)} className="shrink-0">
              {muted ? <VolumeX className="h-5 w-5 text-[var(--color-text-muted)]" /> : <Volume2 className="h-5 w-5 text-[var(--color-accent-green)]" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-[var(--color-accent-green)]"
            />
          </div>
        )}

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
          className="mt-8 flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] shadow-sm transition-colors hover:bg-[var(--color-bg-secondary)]"
          onClick={() => navigate(-1)}
        >
          <X className="h-4 w-4" />
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
          transition={{ duration: phase.duration, ease: "easeInOut" }}
          className="relative flex h-48 w-48 items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-white/30 shadow-[0_0_0_16px_rgba(255,255,255,0.15)]" />
          <div className="absolute inset-4 rounded-full bg-white/50" />
          <div className="absolute inset-8 rounded-full bg-white/70" />
        </motion.div>
      </AnimatePresence>

      <h1 className="mt-10 text-3xl font-bold text-[#1A1208]">{phase.label}</h1>
      <p className="mt-2 text-sm text-[#1A1208]/60">{phase.duration - phaseElapsed}s in phase</p>

      <p className="mt-8 font-mono text-2xl font-bold tabular-nums text-[#1A1208]">{mm}:{ss}</p>

      <div className="mt-3 h-1.5 w-full max-w-xs rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Sound indicator */}
      {soundIdx > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-full bg-black/10 px-3 py-1.5">
          {muted ? (
            <VolumeX className="h-3.5 w-3.5 text-[#1A1208]/60" />
          ) : (
            <Volume2 className="h-3.5 w-3.5 text-[#1A1208]/60" />
          )}
          <span className="text-xs text-[#1A1208]/60">{currentSound.label}</span>
          <button type="button" onClick={() => setMuted((v) => !v)} className="text-[10px] text-[#1A1208]/40 underline">
            {muted ? "unmute" : "mute"}
          </button>
        </div>
      )}

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
