import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function CustomAIInstructionsScreen() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("You are a compassionate mental wellness coach. Keep replies concise.");
  const [preview, setPreview] = useState("");

  return (
    <div className="min-h-dvh bg-[#FAF8F4] px-4 pb-28 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <header className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
          <ChevronLeft className="h-6 w-6 text-[#3B2A1A]" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-[#3B2A1A]">Custom instructions</h1>
        <span className="w-10" />
      </header>

      <label className="mb-2 block text-sm font-semibold text-[var(--color-text-secondary)]">System prompt</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        className="mb-4 w-full rounded-2xl border border-[var(--color-border)] bg-white p-3 text-sm"
      />

      <Button
        type="button"
        variant="secondary"
        fullWidth
        className="mb-4 rounded-full"
        onClick={() => setPreview("Preview: “Thanks — I hear you. Here’s one gentle step you can try in the next 10 minutes…”")}
      >
        AI Response →
      </Button>

      {preview ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-sm text-[var(--color-text-primary)]">{preview}</div>
      ) : null}
    </div>
  );
}
