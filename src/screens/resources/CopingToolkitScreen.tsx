import { useState } from "react";
import type { ReactNode } from "react";
import { Brain, ChevronDown, ChevronLeft, ChevronUp, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Technique {
  title: string;
  summary: string;
  detail: string;
}

interface Category {
  id: string;
  icon: ReactNode;
  title: string;
  color: string;
  techniques: Technique[];
}

const CATEGORIES: Category[] = [
  {
    id: "grounding",
    icon: <span className="text-2xl">🌱</span>,
    title: "Grounding Techniques",
    color: "bg-[var(--color-accent-green-light)]",
    techniques: [
      {
        title: "5-4-3-2-1 Method",
        summary: "Anchor yourself to the present moment using your senses.",
        detail:
          "Notice 5 things you can SEE, 4 things you can TOUCH, 3 things you can HEAR, 2 things you can SMELL, and 1 thing you can TASTE. This pulls you out of anxious thoughts and into the present moment.",
      },
      {
        title: "Cold Water Reset",
        summary: "Splash cold water on your face to activate the dive reflex.",
        detail:
          "Run cold water over your wrists or splash it on your face. This activates your parasympathetic nervous system, slowing your heart rate and reducing anxiety rapidly. Especially helpful during panic attacks.",
      },
      {
        title: "Physical Grounding",
        summary: "Feel your feet firmly on the floor.",
        detail:
          "Press your feet flat on the floor. Feel the weight of your body in the chair. Run your hands along a textured surface — a table edge, fabric, or carpet. Describe the texture to yourself in detail.",
      },
    ],
  },
  {
    id: "breathing",
    icon: <Wind className="h-6 w-6 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
    title: "Breathing Exercises",
    color: "bg-[#e8f4fd]",
    techniques: [
      {
        title: "4-7-8 Breathing",
        summary: "A calming technique to slow your nervous system.",
        detail:
          "Inhale through your nose for 4 counts. Hold your breath for 7 counts. Exhale completely through your mouth for 8 counts. Repeat 3–4 cycles. This technique is particularly effective before sleep or during acute anxiety.",
      },
      {
        title: "Box Breathing",
        summary: "Inhale, hold, exhale, hold — each for 4 counts.",
        detail:
          "Breathe in for 4 counts → Hold for 4 counts → Breathe out for 4 counts → Hold for 4 counts. Repeat. Used by Navy SEALs and first responders to maintain calm under pressure.",
      },
      {
        title: "Diaphragmatic Breathing",
        summary: "Breathe from your belly, not your chest.",
        detail:
          "Place one hand on your chest and one on your belly. Breathe in slowly through your nose — your belly should rise but your chest should stay relatively still. Breathe out slowly through pursed lips. This activates the relaxation response.",
      },
    ],
  },
  {
    id: "cbt",
    icon: <Brain className="h-6 w-6 text-[var(--color-text-secondary)]" strokeWidth={1.75} />,
    title: "Cognitive Reframing",
    color: "bg-[#ede8f5]",
    techniques: [
      {
        title: "Thought Record",
        summary: "Challenge automatic negative thoughts with evidence.",
        detail:
          "Write down the negative thought. Rate how strongly you believe it (0–100%). List evidence FOR the thought, then evidence AGAINST it. Write a more balanced alternative thought and re-rate your belief. This is a core CBT technique for anxiety and depression.",
      },
      {
        title: "Cognitive Defusion",
        summary: "Create distance between you and your thoughts.",
        detail:
          "Instead of 'I'm worthless,' say 'I'm having the thought that I'm worthless.' You can also imagine the thought as clouds drifting past, or leaves floating down a stream. You are not your thoughts — you are the observer of them.",
      },
      {
        title: "The Worry Window",
        summary: "Schedule a specific time to worry.",
        detail:
          "Set aside 15–20 minutes per day as your 'worry time.' When anxious thoughts arise outside this window, write them down and postpone worrying until then. This limits the spread of anxiety throughout your day and often the worries feel smaller when the time comes.",
      },
    ],
  },
  {
    id: "selfcompassion",
    icon: <span className="text-2xl">💛</span>,
    title: "Self-Compassion",
    color: "bg-[var(--color-accent-orange-light)]",
    techniques: [
      {
        title: "Self-Compassion Break",
        summary: "Treat yourself with the kindness you'd show a friend.",
        detail:
          "When struggling, place a hand on your heart and say: 'This is a moment of suffering. Suffering is part of life. May I be kind to myself right now.' Then ask: what would I say to a dear friend in this situation? Say that to yourself.",
      },
      {
        title: "Loving-Kindness Meditation",
        summary: "Cultivate warmth toward yourself and others.",
        detail:
          "Sit quietly and repeat silently: 'May I be happy. May I be healthy. May I be at peace.' Then extend it to a loved one, a neutral person, and eventually all beings. Even 5 minutes can shift your emotional state.",
      },
      {
        title: "Self-Soothing TIPP",
        summary: "Temperature, Intense exercise, Paced breathing, Progressive relaxation.",
        detail:
          "T: Cold water on face or ice cubes. I: 20–30 minutes of vigorous exercise. P: Slow your breath below your emotional pace (5–6 breaths/min). P: Tense and release each muscle group from toes to head. Use any or all of these when emotions feel overwhelming.",
      },
    ],
  },
];

export function CopingToolkitScreen() {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openTechnique, setOpenTechnique] = useState<string | null>(null);

  return (
    <div className="min-h-dvh bg-[#FAF8F4] pb-28">
      <header className="flex items-center border-b border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--color-bg-secondary)]"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[var(--color-primary)]">
          Coping Toolkit
        </h1>
        <span className="w-10" />
      </header>

      <div className="px-4 pt-5">
        <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
          Evidence-based strategies to help manage anxiety, stress, and difficult emotions. Tap a
          category to explore techniques.
        </p>

        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
            >
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-4 text-left",
                  cat.color,
                )}
                onClick={() =>
                  setOpenCategory((v) => (v === cat.id ? null : cat.id))
                }
              >
                {cat.icon}
                <span className="flex-1 font-semibold text-[var(--color-primary)]">
                  {cat.title}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {cat.techniques.length} techniques
                </span>
                {openCategory === cat.id ? (
                  <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                )}
              </button>

              {openCategory === cat.id && (
                <div className="divide-y divide-[var(--color-border)]">
                  {cat.techniques.map((t) => {
                    const key = `${cat.id}-${t.title}`;
                    return (
                      <div key={key}>
                        <button
                          type="button"
                          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[var(--color-bg-secondary)]"
                          onClick={() =>
                            setOpenTechnique((v) => (v === key ? null : key))
                          }
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[var(--color-primary)]">
                              {t.title}
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                              {t.summary}
                            </p>
                          </div>
                          {openTechnique === key ? (
                            <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                          ) : (
                            <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                          )}
                        </button>
                        {openTechnique === key && (
                          <div className="bg-[var(--color-bg-secondary)] px-4 pb-4 pt-2">
                            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                              {t.detail}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[var(--radius-xl)] bg-[var(--color-accent-green-light)] p-4">
          <p className="text-xs font-semibold text-[var(--color-accent-green)]">
            Remember
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            These techniques work best with practice. Even if they feel awkward at first, give each
            one a fair try several times before deciding if it works for you. You deserve effective
            support.
          </p>
        </div>
      </div>
    </div>
  );
}
