import { useState } from "react";
import { Mic, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { TopBar } from "@/components/ui/TopBar";
import { useAddJournal } from "@/hooks/useJournalEntries";
import { useUpdateFreudScore } from "@/hooks/useFreudScoreHistory";
import { detectCrisisLanguage } from "@/lib/crisisDetection";
import { computeFreudScore } from "@/lib/freudScoreModel";
import { hapticSuccess } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

const CHIPS = ["Work", "Family", "Health", "Finance", "Sleep"];
const MOODS: MoodKey[] = ["depressed", "sad", "neutral", "happy", "overjoyed"];

export function NewJournalScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const setCrisisMode = useUiStore((s) => s.setCrisisMode);
  const addJournal = useAddJournal();
  const updateFreud = useUpdateFreudScore();
  const [mode, setMode] = useState<"pick" | "voice" | "text">("pick");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [stress, setStress] = useState(40);
  const [chips, setChips] = useState<string[]>(["Work"]);
  const [emotion, setEmotion] = useState<MoodKey>("neutral");

  const submitJournal = async () => {
    const text = `${title} ${body} ${transcript}`.trim();
    if (detectCrisisLanguage(text)) {
      setCrisisMode(true);
      navigate("/journal/critical");
      return;
    }
    if (!userId) {
      navigate("/signin", { replace: true });
      return;
    }
    const stressLevel = Math.max(1, Math.min(5, Math.round(stress / 20)));
    const row = await addJournal.mutateAsync({
      user_id: userId,
      title: title.trim() || "Journal entry",
      content: body.trim() || transcript.trim() || "…",
      type: mode === "voice" ? "voice" : "text",
      emotion,
      stress_level: stressLevel,
      stressors: chips,
      has_crisis_language: false,
    });
    const score = computeFreudScore({
      mood: emotion,
      sleepHours: 7,
      stressLevel: stressLevel,
      journalStreakDays: 12,
    });
    await updateFreud.mutateAsync({ userId, score, reason: "Journal entry" });
    hapticSuccess();
    navigate(`/journal/${row.id}`);
  };

  if (mode === "pick") {
    return (
      <div className="min-h-dvh bg-[#FAF8F4] pb-28">
        <TopBar title="New Mental Health Journal" />
        <div className="space-y-4 px-4 pt-6">
          <button type="button" onClick={() => setMode("voice")}>
            <Card className="flex items-center gap-4 p-5 text-left hover:bg-[var(--color-bg-secondary)]">
              <Mic className="h-10 w-10 text-[var(--color-primary)]" />
              <div>
                <p className="font-bold text-[var(--color-primary)]">Voice Journal</p>
                <p className="text-xs text-[var(--color-text-muted)]">Auto-transcribes with AI</p>
              </div>
            </Card>
          </button>
          <button type="button" onClick={() => setMode("text")}>
            <Card className="flex items-center gap-4 p-5 text-left hover:bg-[var(--color-bg-secondary)]">
              <PenLine className="h-10 w-10 text-[var(--color-primary)]" />
              <div>
                <p className="font-bold text-[var(--color-primary)]">Text Journal</p>
                <p className="text-xs text-[var(--color-text-muted)]">Write freely with AI insights</p>
              </div>
            </Card>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "voice") {
    return (
      <div className="min-h-dvh bg-[#FAF8F4] pb-28">
        <TopBar title="Voice Journal" />
        <div className="px-4 pt-8 text-center">
          <p className="text-lg font-semibold text-[var(--color-primary)]">Say anything that&apos;s on your mind!</p>
          <div className="mx-auto mt-10 flex h-24 items-end justify-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-[var(--color-primary)]"
                style={{ height: `${recording ? 8 + (i * 7) % 48 : 12}px`, opacity: recording ? 1 : 0.35 }}
              />
            ))}
          </div>
          <p className="mt-6 min-h-[3rem] rounded-lg bg-[var(--color-surface)] p-3 text-left text-sm text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]">
            {transcript || (recording ? "Listening…" : "Tap the mic to start")}
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => {
                setRecording((r) => !r);
                if (!recording) setTranscript("Today I had a hard time concentrating. I was very worried about making mistakes, very angry!");
              }}
              className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg ${recording ? "bg-[var(--color-danger)]" : "bg-[var(--color-primary)]"}`}
            >
              <Mic className="h-9 w-9" />
            </button>
          </div>
          <Button type="button" className="mt-10 w-full max-w-xs rounded-full" onClick={submitJournal}>
            Create Journal +
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <TopBar title="Add New Journal" />
      <div className="flex gap-2 px-4 pt-4">
        <button type="button" className="flex-1 rounded-full bg-[var(--color-primary)] py-2 text-sm font-semibold text-white">
          Text
        </button>
        <button
          type="button"
          onClick={() => setMode("voice")}
          className="flex-1 rounded-full bg-[var(--color-bg-secondary)] py-2 text-sm font-semibold text-[var(--color-text-secondary)]"
        >
          Voice
        </button>
      </div>
      <div className="space-y-4 px-4 pt-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Feeling low again" />
        <label className="block text-sm text-[var(--color-text-secondary)]">
          Entry
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--color-text-primary)]"
            placeholder="Write your thoughts..."
          />
        </label>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">Stress level</p>
          <input type="range" min={0} max={100} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="mt-2 w-full accent-[var(--color-accent-green)]" />
        </div>
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              aria-label={m}
              onClick={() => setEmotion(m)}
              className={cn("rounded-full p-0.5", emotion === m ? "ring-2 ring-[var(--color-accent-green)]" : "")}
            >
              <MoodEmoji mood={m} size={36} />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChips((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${chips.includes(c) ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)]" : "border-[var(--color-border)] bg-white"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <Button type="button" fullWidth className="rounded-full" onClick={submitJournal}>
          Create Journal +
        </Button>
      </div>
    </div>
  );
}
