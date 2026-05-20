import { useEffect, useRef, useState } from "react";
import { Bot, ChevronLeft, Mic, MicOff, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { genAI } from "@/lib/gemini";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Turn {
  role: "user" | "ai";
  text: string;
}

// ── Web Speech API typings (not in default TS lib) ────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
type SpeechRecognitionCtor = new () => any;
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionCtor;
    webkitSpeechRecognition: SpeechRecognitionCtor;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const SYSTEM_PROMPT =
  "You are Mindora, a compassionate AI mental wellness companion. " +
  "You are in a voice conversation. Keep responses warm, brief (2-4 sentences), " +
  "and conversational — no bullet points or markdown. " +
  "Never diagnose or replace professional care.";

// ── Component ─────────────────────────────────────────────────────────────────
export function VoiceChatScreen() {
  const navigate = useNavigate();

  // Conversation history for multi-turn Gemini context
  const [turns, setTurns] = useState<Turn[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll conversation
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, aiText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Speech-to-Text ────────────────────────────────────────────────────────
  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: SpeechRecognitionCtor | undefined = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    window.speechSynthesis?.cancel(); // stop any ongoing TTS
    setError(null);
    setTranscript("");
    setAiText("");

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onstart = () => setStatus("listening");

    rec.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
    };

    rec.onerror = (e: any) => {
      if (e.error !== "no-speech") setError(`Mic error: ${e.error}`);
      setStatus("idle");
    };

    rec.onend = () => {
      const spoken = transcript.trim();
      if (spoken) void sendToGemini(spoken);
      else setStatus("idle");
    };

    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  // ── Gemini Response ───────────────────────────────────────────────────────
  const sendToGemini = async (userText: string) => {
    setStatus("thinking");
    const userTurn: Turn = { role: "user", text: userText };
    const updatedTurns = [...turns, userTurn];
    setTurns(updatedTurns);
    setTranscript("");

    if (!genAI) {
      const fallback = "I'm here for you, but my AI connection isn't configured right now. Please set your Gemini API key to enable full responses.";
      setTurns([...updatedTurns, { role: "ai", text: fallback }]);
      speak(fallback);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      // Build Gemini history from previous turns (exclude current user message)
      const history = turns.map((t) => ({
        role: t.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: t.text }],
      }));

      const chat = model.startChat({ history, generationConfig: { maxOutputTokens: 256, temperature: 0.8 } });
      const result = await chat.sendMessageStream(userText);

      let full = "";
      setAiText("");
      setStatus("speaking");

      for await (const chunk of result.stream) {
        const piece = chunk.text();
        full += piece;
        setAiText(full);
      }

      setTurns([...updatedTurns, { role: "ai", text: full }]);
      setAiText("");
      speak(full);
    } catch (err) {
      const msg = "I had trouble connecting. Please try again.";
      setTurns([...updatedTurns, { role: "ai", text: msg }]);
      setAiText("");
      speak(msg);
      console.error(err);
    }
  };

  // ── Text-to-Speech ────────────────────────────────────────────────────────
  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      setStatus("idle");
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95;
    utt.pitch = 1;
    utt.lang = "en-US";
    // Prefer a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      v.name.toLowerCase().includes("samantha") ||
      v.name.toLowerCase().includes("google us english") ||
      v.name.toLowerCase().includes("karen")
    );
    if (preferred) utt.voice = preferred;
    utt.onend = () => setStatus("idle");
    utt.onerror = () => setStatus("idle");
    synthRef.current = utt;
    setStatus("speaking");
    window.speechSynthesis.speak(utt);
  };

  // ── Visual states ─────────────────────────────────────────────────────────
  const isActive = status !== "idle";
  const orb = {
    idle:      "bg-white/5 scale-100",
    listening: "bg-[#5BAD6F]/20 scale-110 animate-pulse",
    thinking:  "bg-[var(--color-accent-orange)]/20 scale-105",
    speaking:  "bg-blue-500/20 scale-110",
  }[status];

  const statusLabel = {
    idle:      "Tap to speak",
    listening: "Listening…",
    thinking:  "Thinking…",
    speaking:  "Speaking…",
  }[status];

  const micBg = {
    idle:      "bg-[#3B2A1A] hover:bg-[#2c1f12]",
    listening: "bg-[var(--color-accent-green)] ring-4 ring-[var(--color-accent-green)]/30",
    thinking:  "bg-[var(--color-accent-orange)] opacity-70",
    speaking:  "bg-blue-600 ring-4 ring-blue-500/30",
  }[status];

  // ── Bar visualiser ────────────────────────────────────────────────────────
  const BAR_COUNT = 28;

  return (
    <div className="flex min-h-dvh flex-col bg-[#0f0d0b] text-white">
      {/* Header */}
      <header className="flex items-center px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => { window.speechSynthesis?.cancel(); navigate(-1); }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="flex-1 text-center text-sm font-semibold tracking-wide text-white/80">
          Voice Session
        </span>
        <div className="flex h-10 w-10 items-center justify-center">
          <Volume2 className="h-4 w-4 text-white/40" strokeWidth={1.5} />
        </div>
      </header>

      {/* Conversation transcript */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {turns.length === 0 && status === "idle" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bot className="h-12 w-12 text-white/20 mb-4" strokeWidth={1.25} />
            <p className="text-white/50 text-sm">Say anything that's on your mind.</p>
            <p className="text-white/30 text-xs mt-1">Mindora is here to listen.</p>
          </div>
        )}

        {turns.map((t, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              t.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {t.role === "ai" && (
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Bot className="h-4 w-4" strokeWidth={1.75} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                t.role === "user"
                  ? "rounded-br-md bg-[#3B2A1A] text-[#FAF8F4]"
                  : "rounded-bl-md bg-white/10 text-white",
              )}
            >
              {t.text}
            </div>
          </div>
        ))}

        {/* Streaming AI text */}
        {aiText && (
          <div className="flex justify-start">
            <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Bot className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm leading-relaxed text-white">
              {aiText}
              <span className="ml-1 inline-block h-3.5 w-0.5 animate-pulse bg-white/60" />
            </div>
          </div>
        )}

        {/* Live transcript */}
        {transcript && status === "listening" && (
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#3B2A1A]/60 px-4 py-2.5 text-sm italic text-white/70">
              {transcript}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        {/* Audio visualiser */}
        <div className="mb-4 flex h-10 items-end justify-center gap-0.5">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-100",
                status === "listening" ? "bg-[var(--color-accent-green)]"
                : status === "speaking" ? "bg-blue-400"
                : "bg-white/15",
              )}
              style={{
                height: isActive
                  ? `${10 + Math.abs(Math.sin(i * 0.6 + Date.now() * 0.003)) * 28}px`
                  : "6px",
                opacity: isActive ? 0.8 + (i % 3) * 0.07 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Status label */}
        <p className="mb-4 text-center text-xs font-medium text-white/50 tracking-wide uppercase">
          {statusLabel}
        </p>

        {/* Error */}
        {error && (
          <p className="mb-3 rounded-xl bg-red-900/40 px-3 py-2 text-center text-xs text-red-300">
            {error}
          </p>
        )}

        {/* Mic button */}
        <div className="flex justify-center">
          <button
            type="button"
            onMouseDown={status === "idle" ? startListening : undefined}
            onTouchStart={status === "idle" ? startListening : undefined}
            onMouseUp={status === "listening" ? stopListening : undefined}
            onTouchEnd={status === "listening" ? stopListening : undefined}
            onClick={status === "listening" ? stopListening : status === "idle" ? startListening : undefined}
            disabled={status === "thinking"}
            className={cn(
              "relative flex h-20 w-20 items-center justify-center rounded-full text-white transition-all duration-200 shadow-lg disabled:opacity-40",
              micBg,
            )}
            aria-label={status === "listening" ? "Stop listening" : "Start listening"}
          >
            {/* Outer pulse ring */}
            {(status === "listening" || status === "speaking") && (
              <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-current" />
            )}
            {status === "listening"
              ? <MicOff className="h-8 w-8" strokeWidth={2} />
              : <Mic className="h-8 w-8" strokeWidth={2} />}
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-white/25">
          Hold to talk · Mindora AI · Not a substitute for professional care
        </p>
      </div>

      {/* Ambient orb */}
      <div
        className={cn(
          "pointer-events-none fixed left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-3xl transition-all duration-700",
          orb,
        )}
        aria-hidden
      />
    </div>
  );
}
