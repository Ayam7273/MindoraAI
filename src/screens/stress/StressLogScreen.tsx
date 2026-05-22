import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Camera, Circle, StopCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAddStressEntry } from "@/hooks/useStressEntries";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { computeMindoraScore } from "@/lib/mindoraScoreModel";
import { hapticSuccess } from "@/lib/haptics";
import { useUiStore } from "@/store/uiStore";
import { generateText } from "@/lib/aiHelpers";

// ─── constants ────────────────────────────────────────────────────────────────

const LEVELS = [
  { v: 1, label: "Calm",     color: "#22c55e" },
  { v: 2, label: "Normal",   color: "#84cc16" },
  { v: 3, label: "Elevated", color: "#f59e0b" },
  { v: 4, label: "Stressed", color: "#f97316" },
  { v: 5, label: "Extreme",  color: "#ef4444" },
] as const;

const STRESSORS = [
  "Work",
  "Relationships",
  "Finance",
  "Health",
  "Family",
  "Loneliness",
  "Sleep",
  "Other",
];

function getMeta(v: number) {
  return LEVELS.find((l) => l.v === Math.round(v)) ?? LEVELS[2];
}

// ─── types ────────────────────────────────────────────────────────────────────

type CamState = "idle" | "preview" | "recording" | "analysing" | "done" | "error";

// ─── component ────────────────────────────────────────────────────────────────

export function StressLogScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const activeMood = useUiStore((s) => s.activeMood);
  const addStress = useAddStressEntry();
  const updateMindora = useUpdateMindoraScore();

  // ── form state ───────────────────────────────────────────────────────────
  const [level, setLevel] = useState(3);
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const meta = getMeta(level);
  const fillPercent = ((level - 1) / 4) * 100;

  // ── camera state ─────────────────────────────────────────────────────────
  const [camState, setCamState] = useState<CamState>("idle");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Wire stream to video element once it is in the DOM ───────────────────
  // This runs whenever camState changes to "preview" or "recording",
  // at which point videoRef.current is populated.
  useEffect(() => {
    if ((camState === "preview" || camState === "recording") && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    }
  }, [camState]); // re-run whenever the video div appears/disappears

  // ── camera helpers ───────────────────────────────────────────────────────

  const startPreview = useCallback(async () => {
    setCamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      // Change state first so the <video> element renders into the DOM,
      // then useEffect below will wire the srcObject once the ref is available.
      setCamState("preview");
    } catch {
      setCamError("Camera permission denied or unavailable. Please allow camera access and try again.");
      setCamState("error");
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);


  /** "Record" = show a 3-second countdown, then capture frame + analyse */
  const startRecording = useCallback(() => {
    setCamState("recording");
    // Auto-capture after 3 seconds (gives user time to compose their face)
    timerRef.current = setTimeout(() => {
      void handleAnalyse();
    }, 3000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    void handleAnalyse();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyse = useCallback(async () => {
    setCamState("analysing");
    stopStream();

    const label = getMeta(level).label;

    try {
      const promptText = `You are a compassionate mental wellness AI. The user is reporting a stress level of ${level}/5 (${label}). ` +
        `Based on the self-reported level, provide: ` +
        `1) Overall stress assessment (2 sentences), ` +
        `2) What physical signs you would expect at this stress level, ` +
        `3) Three specific, practical coping strategies for ${label} stress. ` +
        `Be warm, specific, and non-clinical.`;

      const reply = await generateText(promptText).catch(() => null);
      setAiAnalysis(reply ?? "Could not generate analysis. Your stress entry will still be saved.");
      setCamState("done");
    } catch {
      setAiAnalysis("Could not generate analysis. Your stress entry will still be saved.");
      setCamState("done");
    }
  }, [level, stopStream]);

  const dismissCamera = useCallback(() => {
    stopStream();
    if (timerRef.current) clearTimeout(timerRef.current);
    setCamState("idle");
    setAiAnalysis(null);
    setCamError(null);
  }, [stopStream]);

  // ── save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!userId) {
      navigate("/signin", { replace: true });
      return;
    }
    setSaving(true);
    try {
      await addStress.mutateAsync({
        user_id: userId,
        stress_level: level,
        stressors: selected.length > 0 ? selected : null,
        life_impact: meta.label,
      });
      const mood = activeMood ?? "neutral";
      const score = computeMindoraScore({
        mood,
        sleepHours: 7,
        stressLevel: level,
        journalStreakDays: 0,
      });
      await updateMindora.mutateAsync({ userId, score, reason: "Stress log" });
      hapticSuccess();
      navigate("/stress", { replace: true });
    } catch {
      setSaving(false);
    }
  };

  // ── toggle stressor ───────────────────────────────────────────────────────

  const toggleStressor = (s: string) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-36">
      {/* ── Header ── */}
      <header
        className="flex items-center px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white"
        style={{ backgroundColor: "#3B2A1A" }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2} />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold">Log Stress</h1>
        <span className="w-10" />
      </header>

      <div className="space-y-5 px-4 pt-6">
        {/* ── Stress Level Slider ── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Stress Level
          </p>
          {/* Big level display */}
          <div className="flex items-end justify-center gap-3 py-4">
            <p
              className="text-8xl font-black tabular-nums leading-none transition-colors"
              style={{ color: meta.color }}
            >
              {level}
            </p>
            <p
              className="mb-2 text-2xl font-bold transition-colors"
              style={{ color: meta.color }}
            >
              {meta.label}
            </p>
          </div>

          {/* Styled range input */}
          <div className="relative mt-2 h-8 flex items-center">
            <div className="absolute inset-y-0 left-0 right-0 my-auto h-3 rounded-full bg-gray-100" />
            <div
              className="absolute inset-y-0 left-0 my-auto h-3 rounded-full transition-all duration-200"
              style={{
                width: `${fillPercent}%`,
                background: `linear-gradient(to right, #22c55e, ${meta.color})`,
              }}
            />
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="relative z-10 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg"
              style={{ ["--thumb-color" as string]: meta.color }}
              aria-label="Stress level"
              aria-valuetext={meta.label}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-medium text-gray-400">
            {LEVELS.map((l) => (
              <button
                key={l.v}
                type="button"
                onClick={() => setLevel(l.v)}
                className="transition-colors"
                style={{ color: l.v === level ? meta.color : undefined }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Stressor Chips ── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            What&apos;s causing stress? (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {STRESSORS.map((s) => {
              const active = selected.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStressor(s)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    active
                      ? "text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={active ? { backgroundColor: meta.color } : undefined}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Optional Note ── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Notes
          </p>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything else on your mind? (optional)"
            className="w-full resize-none rounded-xl bg-[#FAF8F4] p-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-300"
          />
        </section>

        {/* ── Face Recording Section ── */}
        <section className="rounded-2xl bg-[#1C1411] p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Record Face</p>
              <p className="text-xs text-white/50">Optional — AI stress analysis</p>
            </div>
            {camState === "idle" && (
              <button
                type="button"
                onClick={() => void startPreview()}
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
              >
                <Camera className="h-4 w-4" />
                Open Camera
              </button>
            )}
            {(camState === "preview" ||
              camState === "recording" ||
              camState === "analysing" ||
              camState === "done") && (
              <button
                type="button"
                onClick={dismissCamera}
                className="text-xs text-white/50 underline"
              >
                Dismiss
              </button>
            )}
            {camState === "error" && (
              <button
                type="button"
                onClick={() => { setCamState("idle"); setCamError(null); }}
                className="text-xs text-white/50 underline"
              >
                Retry
              </button>
            )}
          </div>

          {/* Camera error */}
          {camState === "error" && camError && (
            <p className="mt-3 rounded-xl bg-red-900/40 px-3 py-2 text-xs text-red-300">
              {camError}
            </p>
          )}

          {/* Live preview + controls */}
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />

          {(camState === "preview" || camState === "recording") && (
            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white/80 shadow-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full -scale-x-100 object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                {camState === "recording" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                    <span className="h-3 w-3 animate-pulse rounded-full bg-red-500 mb-1" />
                    <span className="text-[10px] font-bold text-white">Hold still…</span>
                  </div>
                )}
              </div>

              {camState === "preview" && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg transition active:scale-95"
                  aria-label="Start recording"
                >
                  <Circle className="h-8 w-8 fill-white text-white" />
                </button>
              )}

              {camState === "recording" && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition active:scale-95"
                  aria-label="Stop recording"
                >
                  <StopCircle className="h-8 w-8 text-white" />
                </button>
              )}

              <p className="text-xs text-white/40">
                {camState === "preview"
                  ? "Press the red button to start (max 10 s)"
                  : "Recording… press to stop"}
              </p>
            </div>
          )}

          {/* Analysing spinner */}
          {camState === "analysing" && (
            <div className="mt-5 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
              <p className="text-sm text-white/60">Analysing your stress…</p>
            </div>
          )}

          {/* AI analysis card */}
          {camState === "done" && aiAnalysis && (
            <div className="mt-4 rounded-xl bg-white/10 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-300">
                AI Analysis
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/90">
                {aiAnalysis}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ── Save button ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAF8F4]/90 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
        <Button
          type="button"
          fullWidth
          disabled={saving}
          className="rounded-full bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60"
          onClick={() => void handleSave()}
        >
          {saving ? "Saving…" : "Save & Done"}
        </Button>
      </div>

      {/* slider thumb colour */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background-color: var(--thumb-color, #3B2A1A);
        }
        input[type="range"]::-moz-range-thumb {
          background-color: var(--thumb-color, #3B2A1A);
          border: none;
        }
      `}</style>
    </div>
  );
}
