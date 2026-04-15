import type { MoodKey } from "@/types";
import { cn } from "@/lib/utils";

const BG: Record<MoodKey, string> = {
  depressed: "var(--mood-depressed)",
  sad: "var(--mood-sad)",
  neutral: "var(--mood-neutral)",
  happy: "var(--mood-happy)",
  overjoyed: "var(--mood-overjoyed)",
};

function Face({ mood }: { mood: MoodKey }) {
  const common = "stroke-[#1A1208]";
  switch (mood) {
    case "depressed":
      return (
        <>
          <ellipse cx="22" cy="26" rx="3" ry="4" className={cn(common)} fill="none" strokeWidth="2" />
          <ellipse cx="42" cy="26" rx="3" ry="4" className={cn(common)} fill="none" strokeWidth="2" />
          <path d="M24 46 Q32 40 40 46" className={cn(common)} fill="none" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "sad":
      return (
        <>
          <circle cx="22" cy="26" r="3" fill="#1A1208" />
          <circle cx="42" cy="26" r="3" fill="#1A1208" />
          <path d="M24 48 Q32 44 40 48" className={cn(common)} fill="none" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "neutral":
      return (
        <>
          <circle cx="22" cy="26" r="3" fill="#1A1208" />
          <circle cx="42" cy="26" r="3" fill="#1A1208" />
          <line x1="24" y1="46" x2="40" y2="46" className={cn(common)} strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "happy":
      return (
        <>
          <path d="M19 26 Q22 22 25 26" className={cn(common)} fill="none" strokeWidth="2" strokeLinecap="round" />
          <path d="M39 26 Q42 22 45 26" className={cn(common)} fill="none" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 44 Q32 52 42 44" className={cn(common)} fill="none" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "overjoyed":
      return (
        <>
          <path d="M18 24 Q22 18 26 24" className={cn(common)} fill="none" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 24 Q42 18 46 24" className={cn(common)} fill="none" strokeWidth="2" strokeLinecap="round" />
          <path d="M20 42 Q32 54 44 42" className={cn(common)} fill="none" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
  }
}

export interface MoodEmojiProps {
  mood: MoodKey;
  size?: number;
  className?: string;
}

/** Emoji-style face as SVG on a mood-colored circular background. */
export function MoodEmoji({ mood, size = 40, className }: MoodEmojiProps) {
  const label =
    mood === "depressed"
      ? "Depressed"
      : mood === "sad"
        ? "Sad"
        : mood === "neutral"
          ? "Neutral"
          : mood === "happy"
            ? "Happy"
            : "Overjoyed";

  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full shadow-[var(--shadow-sm)]", className)}
      style={{
        width: size,
        height: size,
        background: BG[mood],
      }}
      role="img"
      aria-label={label}
    >
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <Face mood={mood} />
      </svg>
    </span>
  );
}
