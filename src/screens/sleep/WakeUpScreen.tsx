import { Moon, Sun } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import { hapticSuccess } from "@/lib/haptics";
import { useUiStore } from "@/store/uiStore";

export function WakeUpScreen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const phase = params.get("phase") === "morning" ? "morning" : "night";
  const name = useUiStore((s) => s.profile?.full_name ?? "Friend");

  const swipe = useSwipeable({
    onSwipedRight: (e) => {
      if (e.absX > 40) {
        hapticSuccess();
        navigate("/sleep/results");
      }
    },
    delta: 30,
    trackMouse: false,
  });

  return (
    <div
      {...swipe}
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center px-6 text-center",
        phase === "morning" ? "bg-[#FAF8F4] text-[#3B2A1A]" : "bg-[#1a1208] text-[#FAF8F4]",
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
        {phase === "morning"
          ? <Sun className="h-10 w-10 text-[var(--color-accent-yellow)]" strokeWidth={1.5} />
          : <Moon className="h-10 w-10 text-[var(--color-accent-purple)]" strokeWidth={1.5} />}
      </div>
      <h1 className="mt-6 text-2xl font-bold">
        {phase === "morning" ? `Wake Up, ${name}!` : `Good Night, ${name}!`}
      </h1>
      <p className="mt-4 text-5xl font-bold tabular-nums">{phase === "morning" ? "06:15" : "22:15"}</p>
      <p className="mt-2 text-sm opacity-70">Swipe right to dismiss alarm</p>
      <div className="mt-10 h-3 w-full max-w-xs rounded-full bg-black/10">
        <div className="h-full w-1/3 rounded-full bg-[var(--color-primary)]" />
      </div>
    </div>
  );
}
