import { useState } from "react";
import { ChevronLeft, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function VoiceChatScreen() {
  const navigate = useNavigate();
  const [on, setOn] = useState(false);
  const [text, setText] = useState("");

  return (
    <div className="flex min-h-dvh flex-col bg-[#1a1410] text-[#FAF8F4]">
      <header className="flex items-center px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="flex-1 text-center text-sm font-semibold">Voice session</span>
        <span className="w-10" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div
          className={`mb-8 flex h-40 w-40 items-center justify-center rounded-full text-7xl transition-transform ${on ? "scale-110 animate-pulse bg-white/10" : "bg-white/5"}`}
          aria-hidden
        >
          🤖
        </div>
        <p className="text-lg font-medium">Say anything that&apos;s on your mind.</p>
        <p className="mt-2 text-sm text-white/60">Demo: tap mic to simulate live transcription.</p>
      </div>

      <div className="px-4 pb-4">
        <div className="mb-3 flex h-12 items-end justify-center gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-[var(--color-accent-green)]"
              style={{ height: on ? `${12 + (i % 5) * 8}px` : "6px", opacity: on ? 1 : 0.25 }}
            />
          ))}
        </div>
        {text ? <p className="mb-4 rounded-xl bg-white/10 px-3 py-2 text-sm">{text}</p> : null}
        <div className="flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            className="h-16 w-16 rounded-full p-0"
            onClick={() => {
              setOn((v) => !v);
              if (!on) setText("Today I had a hard time concentrating. I was very worried about making mistakes.");
              else setText("");
            }}
          >
            <Mic className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}
