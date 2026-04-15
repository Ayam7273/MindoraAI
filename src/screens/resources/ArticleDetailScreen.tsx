import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUiStore } from "@/store/uiStore";

const EXTRA = Array.from({ length: 12 }, (_, i) => (
  <p key={i} className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
    Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
  </p>
));

export function ArticleDetailScreen() {
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
    const ratio = el.scrollTop / max;
    setShowPaywall(ratio >= 0.3);
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
        <h1 className="flex-1 text-center text-sm font-bold">Article Detail</h1>
        <span className="w-10" />
      </header>

      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 overflow-y-auto px-4 pt-4 ${!isPro && showPaywall ? "pb-44" : "pb-8"}`}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">Article</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold ring-1 ring-[var(--color-border)]">Philosophy</span>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-[#3B2A1A]">What is Life? Why?</h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">ID {id} · 4.6 ★ · 12k views</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[var(--color-bg-secondary)]" />
          <div className="flex-1">
            <p className="font-semibold text-[#3B2A1A]">Johann Liebert</p>
            <p className="text-xs text-[var(--color-text-muted)]">Author</p>
          </div>
          <Button type="button" variant="secondary" className="rounded-full text-xs">
            Follow +
          </Button>
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-bold text-[#3B2A1A]">Introduction</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This is demo article body text. Meaning, purpose, and self-compassion often travel together. Scroll past 30% to
            reveal the premium gate (free accounts).
          </p>
          <div className="mt-4 h-40 w-full rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100" />
          <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">Caption: a walk by the water</p>
        </section>
        {EXTRA}
      </div>

      <AnimatePresence>
        {!isPro && showPaywall ? (
          <motion.div
            key="paywall"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[430px] rounded-t-[2rem] bg-[var(--color-accent-green)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 text-center text-[#FAF8F4] shadow-[0_-8px_24px_rgba(0,0,0,0.15)] [clip-path:polygon(0%_12%,5%_6%,10%_10%,15%_4%,20%_8%,25%_3%,30%_7%,35%_2%,40%_6%,45%_3%,50%_5%,55%_2%,60%_6%,65%_3%,70%_7%,75%_2%,80%_6%,85%_3%,90%_7%,95%_4%,100%_8%,100%_100%,0%_100%)]"
          >
            <p className="text-sm font-bold">Unlock the Full Article</p>
            <p className="mt-1 text-[11px] text-white/80">Pro: unlimited chat, full articles, all courses, offline downloads.</p>
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
