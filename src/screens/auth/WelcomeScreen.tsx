import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowRight, Brain, BookOpen, Heart, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FreudLogo } from "@/components/brand/FreudLogo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "one",
    label: "Step One",
    title: (
      <>
        <span className="text-[var(--color-accent-green)]">Personalize</span> Your Mental Health State
        With AI
      </>
    ),
    accent: "from-[#d4e4c4] to-[#e8f0dc]",
    icon: Sparkles,
  },
  {
    id: "two",
    label: "Step Two",
    title: (
      <>
        <span className="text-[var(--color-accent-orange)]">Intelligent</span> Mood Tracking &amp; AI
        Emotion Insights
      </>
    ),
    accent: "from-[#fdf0e6] to-[#f5e6dc]",
    icon: Brain,
  },
  {
    id: "three",
    label: "Step Three",
    title: (
      <>
        <span className="font-semibold text-[var(--color-primary)]">AI Mental Journaling</span>
        &nbsp;&amp; AI Therapy Chatbot
      </>
    ),
    accent: "from-[#e8e6e4] to-[#f2ede4]",
    icon: BookOpen,
  },
  {
    id: "four",
    label: "Step Four",
    title: (
      <>
        Mindful{" "}
        <span className="text-[var(--color-accent-yellow)]">Resources</span> That Makes You Happy
      </>
    ),
    accent: "from-[#fdf6dc] to-[#f5edd8]",
    icon: Heart,
  },
  {
    id: "five",
    label: "Step Five",
    title: (
      <>
        Loving &amp; Supportive{" "}
        <span className="text-[var(--color-accent-purple)]">Community</span>
      </>
    ),
    accent: "from-[#ede8f5] to-[#e8e0f2]",
    icon: Users,
  },
] as const;

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const t = 48;
    if (info.offset.x < -t) setSlide((i) => Math.min(STEPS.length - 1, i + 1));
    else if (info.offset.x > t) setSlide((i) => Math.max(0, i - 1));
  };

  const step = STEPS[slide];
  const Icon = step.icon;

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#FAF8F4] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="flex flex-col items-center pt-2">
        <FreudLogo size={44} variant="brown" className="text-[var(--color-primary)]" />
        <h1
          className="mt-5 max-w-[17rem] text-center text-[1.35rem] font-semibold leading-tight text-[var(--color-primary)] sm:max-w-none sm:text-[1.5rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Welcome to the ultimate freud UI Kit!
        </h1>
        <p className="mt-3 max-w-[18rem] text-center text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
          Your mindful mental health AI companion for everyone, anywhere 🌿
        </p>
      </div>

      <div className="relative mt-6 flex min-h-0 flex-1 flex-col">
        <div className="mx-auto mb-4 flex justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to ${s.label}`}
              onClick={() => setSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === slide
                  ? "w-6 bg-[var(--color-accent-green)]"
                  : "w-2 bg-[var(--color-border-strong)] opacity-5 hover:opacity-40",
              )}
            />
          ))}
        </div>

        <motion.div
          className="relative flex flex-1 touch-pan-y flex-col overflow-hidden rounded-[var(--radius-xl)]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-1 flex-col"
            >
              <div
                className={cn(
                  "relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden rounded-t-[var(--radius-xl)] bg-gradient-to-b",
                  step.accent,
                )}
              >
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 rounded-t-[100%] bg-[#FAF8F4]/40"
                  aria-hidden
                />
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/70 shadow-[var(--shadow-md)] ring-1 ring-white/80">
                  <Icon
                    className="h-16 w-16 text-[var(--color-primary)] opacity-90"
                    strokeWidth={1.25}
                  />
                </div>
              </div>

              <div className="rounded-b-[var(--radius-xl)] bg-[#FAF8F4] px-1 pb-2 pt-5">
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1">
                    {step.label}
                  </span>
                </p>
                <h2
                  className="mx-auto mt-4 max-w-[16.5rem] text-center text-[1.15rem] font-semibold leading-snug text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {step.title}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="mt-auto flex justify-end pt-4">
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setSlide((i) => Math.min(STEPS.length - 1, i + 1))}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)] transition-transform active:scale-95"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          fullWidth
          onClick={() => navigate("/signup")}
          className="h-12 rounded-full text-[var(--text-base)] font-semibold shadow-[var(--shadow-sm)]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
        <p className="text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-[var(--color-accent-orange)] underline-offset-2 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
