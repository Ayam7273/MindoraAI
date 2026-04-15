import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

const LESSONS = Array.from({ length: 10 }, (_, i) => ({
  title: `Lesson ${i + 1}`,
  dur: "~10 Min",
  r: "4.5",
}));

export function CourseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const isPro = Boolean(useUiStore((s) => s.profile?.is_pro));
  const updateProfile = useUpdateProfile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const onScroll = useCallback(() => {
    if (isPro) {
      setShowPaywall(false);
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) return;
    setShowPaywall(el.scrollTop / max >= 0.3);
  }, [isPro]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div className="flex h-dvh max-h-dvh flex-col bg-[#FAF8F4]">
      <header className="flex shrink-0 items-center bg-[#3B2A1A] px-2 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-[#FAF8F4]">
        <button type="button" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Back">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-sm font-bold">Course</h1>
        <span className="w-10" />
      </header>

      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 overflow-y-auto px-4 pt-4 ${!isPro && showPaywall ? "pb-44" : "pb-8"}`}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">Course</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">Freebie</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-[#3B2A1A]">Mindfulness 101</h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">Course #{id} · ⭐ 4.8 · 10 lessons · ~2h</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[var(--color-bg-secondary)]" />
          <div className="flex-1">
            <p className="font-semibold text-[#3B2A1A]">Dr. Hannibal Lecter</p>
          </div>
          <Button type="button" variant="secondary" className="rounded-full text-xs">
            Follow +
          </Button>
        </div>

        <div className="mt-4 h-40 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400" />
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          A gentle introduction to posture, attention, and returning kindly to the breath when the mind wanders. Scroll about
          30% to see the course paywall on a free account.
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-3">
          <Download className="h-5 w-5 text-[var(--color-primary)]" />
          <div>
            <p className="text-sm font-bold text-[#3B2A1A]">Offline Download</p>
            <p className="text-xs text-[var(--color-text-muted)]">Pro feature · Approx. 240 MB</p>
          </div>
        </div>

        <h3 className="mt-6 text-sm font-bold text-[#3B2A1A]">Curriculum · 10 Total</h3>
        <ul className="mt-2 space-y-2">
          {LESSONS.map((l, idx) => (
            <li key={`${l.title}-${idx}`} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3">
              <Play className="h-4 w-4 text-[var(--color-accent-green)]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#3B2A1A]">{l.title}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {l.dur} · ⭐ {l.r}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Link to={`/resources/play/${id ?? "1"}`} className="mt-4 block text-center text-sm font-bold text-[var(--color-accent-green)]">
          Open course player →
        </Link>
      </div>

      <AnimatePresence>
        {!isPro && showPaywall ? (
          <motion.div
            key="course-paywall"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[430px] rounded-t-[2rem] bg-[var(--color-accent-orange)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 text-center text-[#FAF8F4] shadow-[0_-8px_24px_rgba(0,0,0,0.15)] [clip-path:polygon(0%_12%,8%_5%,16%_9%,24%_4%,32%_8%,40%_3%,48%_7%,56%_2%,64%_6%,72%_3%,80%_7%,88%_4%,96%_8%,100%_5%,100%_100%,0%_100%)]"
          >
            <p className="text-sm font-bold">Unlock the Full Course</p>
            <p className="mt-1 text-[11px] text-white/85">Pro unlocks all lessons, offline downloads, and unlimited chat.</p>
            <Button
              type="button"
              className="mt-3 w-full rounded-full bg-[#3B2A1A] text-[#FAF8F4] hover:bg-[#2a1d12]"
              onClick={() => {
                if (userId) void updateProfile.mutateAsync({ id: userId, patch: { is_pro: true } });
              }}
            >
              Go Pro ⭐
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
