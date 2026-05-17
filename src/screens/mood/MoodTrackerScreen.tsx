import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Brain, Calendar, ChevronRight, Clock, Lightbulb, List, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { TopBar } from "@/components/ui/TopBar";
import { useMindoraScore } from "@/hooks/useMindoraScore";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";

type Tab = "history" | "suggestions";

const MOOD_LABEL: Record<MoodKey, string> = {
  depressed: "Depressed",
  sad: "Sad",
  neutral: "Neutral",
  happy: "Happy",
  overjoyed: "Overjoyed",
};

const MOOD_COLOR: Record<MoodKey, string> = {
  depressed: "#7B6EC8",
  sad: "#E07A3A",
  neutral: "#8B7355",
  happy: "#F5C842",
  overjoyed: "#5BAD6F",
};

const AI_STEPS = [
  {
    n: 1,
    icon: Brain,
    title: "Acknowledge What You Feel",
    tags: ["Journaling", "Grounding"],
    body1:
      "The first and most powerful step toward emotional wellbeing is simply naming what you feel — without judgment. Research in affective neuroscience shows that the act of labelling an emotion activates the prefrontal cortex and reduces the intensity of the amygdala response, meaning the very act of saying \"I feel sad\" can begin to calm your nervous system.",
    body2:
      "Try writing three sentences in your journal: describe the feeling, where you notice it in your body, and what might have triggered it. You do not need to fix anything right now. Just bearing witness to your inner experience — with curiosity rather than criticism — is itself a profound act of self-care that builds emotional resilience over time.",
  },
  {
    n: 2,
    icon: Sparkles,
    title: "Move Your Body, Shift Your State",
    tags: ["Walking", "Stretching", "Exercise"],
    body1:
      "Physical movement is one of the fastest evidence-based tools for mood regulation. Even a brisk 10- to 15-minute walk releases endorphins, lowers cortisol, and raises serotonin levels. You do not need a gym, a plan, or perfect motivation — simply stepping outside and moving your body at any pace creates a measurable shift in how you feel.",
    body2:
      "If walking feels like too much today, try gentle stretching or a 5-minute breathing walk around your home. Pay attention to the sensation of your feet on the ground and the rhythm of your breath. Grounding your awareness in physical sensation is a form of mindfulness that interrupts the mental loop of difficult emotions and reconnects you with the present moment.",
  },
  {
    n: 3,
    icon: Lightbulb,
    title: "Challenge One Unhelpful Thought",
    tags: ["CBT", "Reframing", "Mindset"],
    body1:
      "Our thoughts are not facts — they are interpretations, often coloured by our current emotional state. Cognitive-behavioural therapy (CBT) teaches us to identify and gently question the distorted thoughts that amplify distress. When you notice a harsh self-judgment or catastrophic prediction, ask yourself: 'What is the evidence for and against this thought? What would I say to a friend who had this same thought?'",
    body2:
      "You do not need to force yourself into toxic positivity or pretend everything is fine. The goal is simply to introduce a little space between the thought and your reaction. Try writing down one difficult thought you have had today and then write one alternative interpretation — even a neutral one counts. Over time, this practice rewires the brain's default response patterns toward greater flexibility and compassion.",
  },
  {
    n: 4,
    icon: Calendar,
    title: "Plan One Small Act of Joy",
    tags: ["Behavioural Activation", "Pleasure", "Self-Care"],
    body1:
      "When we feel low, we tend to withdraw from the activities that normally bring us pleasure, which in turn deepens the low mood — a cycle known in psychology as behavioural withdrawal. Behavioural activation therapy addresses this directly by encouraging small, intentional acts of engagement, even when motivation is absent. The key insight is that action precedes motivation, not the other way around.",
    body2:
      "Choose one small thing you can do today that has brought you any sense of pleasure or accomplishment in the past — making a favourite meal, listening to music you love, calling a friend, or spending 10 minutes on a hobby. Schedule it like an appointment. Afterwards, take a moment to notice any shift in your mood, however subtle. These micro-acts of joy compound over days into a genuine improvement in wellbeing.",
  },
  {
    n: 5,
    icon: Clock,
    title: "Reach Out and Connect",
    tags: ["Social Support", "Community", "Professional Help"],
    body1:
      "Human beings are wired for connection — social support is not a luxury but a biological necessity for mental health. Research consistently shows that strong social ties are one of the most powerful predictors of psychological resilience. Reaching out when you are struggling is not a sign of weakness; it is one of the most courageous and effective things you can do for yourself.",
    body2:
      "Start small: send a voice note to a friend, share how you are feeling in the Mindora community, or book a session with a therapist or counsellor. If you are in crisis or feel unsafe, please contact a crisis line immediately — your safety is the priority. Remember, you do not have to earn the right to support. You deserve care simply because you exist.",
  },
];

export function MoodTrackerScreen() {
  const navigate = useNavigate();
  const userId = useUiStore((s) => s.user?.id);
  const { score } = useMindoraScore(userId);
  const updateMindora = useUpdateMindoraScore();
  const { data: moodEntries = [] } = useMoodEntries(userId);
  const [tab, setTab] = useState<Tab>("history");
  const [suggestionDone, setSuggestionDone] = useState(false);

  // Yesterday's entries
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday).getTime();
  const yesterdayEnd = endOfDay(yesterday).getTime();
  const yesterdayEntries = moodEntries.filter((e) => {
    const t = new Date(e.created_at).getTime();
    return t >= yesterdayStart && t <= yesterdayEnd;
  });

  // All history entries (most recent first, up to 20)
  const historyEntries = [...moodEntries].slice(0, 20);

  const nextScore = Math.min(100, score + 3);

  return (
    <div className="relative min-h-dvh bg-[#FAF8F4]">
      <TopBar title="Mood" showSearch={false} />

      {/* Tab toggle */}
      <div className="sticky top-[56px] z-30 bg-[#FAF8F4] px-4 pb-3 pt-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="flex rounded-full bg-[var(--color-border)] p-1">
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-all ${
              tab === "history"
                ? "bg-white text-[var(--color-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <List className="h-4 w-4" strokeWidth={1.75} />
            History
          </button>
          <button
            type="button"
            onClick={() => setTab("suggestions")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-all ${
              tab === "suggestions"
                ? "bg-white text-[var(--color-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            AI Suggestions
          </button>
        </div>
      </div>

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div className="space-y-5 px-4 pb-32 pt-2">
          {/* Yesterday's mood */}
          <section>
            <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">Yesterday</h2>
            {yesterdayEntries.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                No mood logged yesterday
              </div>
            ) : (
              <ul className="space-y-2">
                {yesterdayEntries.map((e) => {
                  const moodKey = e.mood as MoodKey;
                  return (
                    <li
                      key={e.id}
                      className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]"
                    >
                      <MoodEmoji mood={moodKey} size={44} className="ring-2 ring-[var(--color-border)]" />
                      <div className="flex-1">
                        <p
                          className="font-semibold"
                          style={{ color: MOOD_COLOR[moodKey] }}
                        >
                          {MOOD_LABEL[moodKey]}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {format(new Date(e.created_at), "h:mm a")}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Full history */}
          <section>
            <h2 className="mb-2 text-sm font-bold text-[var(--color-primary)]">All Entries</h2>
            {historyEntries.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                No mood entries yet. Tap the + button to log your first mood.
              </div>
            ) : (
              <ul className="space-y-2">
                {historyEntries.map((e) => {
                  const moodKey = e.mood as MoodKey;
                  const ts = new Date(e.created_at);
                  return (
                    <li
                      key={e.id}
                      className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)]"
                    >
                      <div className="w-12 text-center">
                        <p className="text-xs font-bold text-[var(--color-text-secondary)]">
                          {format(ts, "EEE")}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {format(ts, "MMM d")}
                        </p>
                      </div>
                      <MoodEmoji mood={moodKey} size={40} className="ring-2 ring-[var(--color-border)]" />
                      <div className="flex-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: MOOD_COLOR[moodKey] }}
                        >
                          {MOOD_LABEL[moodKey]}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {format(ts, "h:mm a")}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* ── AI SUGGESTIONS TAB ── */}
      {tab === "suggestions" && (
        <div className="space-y-4 px-4 pb-32 pt-2">
          {suggestionDone ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-green-light)]">
                <Sparkles className="h-10 w-10 text-[var(--color-accent-green)]" strokeWidth={1.5} />
              </div>
              <h2 className="mt-6 text-xl font-bold text-[var(--color-primary)]">
                Suggestions Resolved!
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">+3 Mindora Score received.</p>
              <p className="text-sm text-[var(--color-text-muted)]">Your score is now about {nextScore}.</p>
              <Button
                type="button"
                className="mt-8 w-full max-w-xs rounded-full"
                onClick={() => {
                  if (userId)
                    void updateMindora.mutateAsync({ userId, score: nextScore, reason: "Mood suggestion" });
                  setSuggestionDone(false);
                }}
              >
                Start Again
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Evidence-based steps to support your emotional wellbeing today.
              </p>
              {AI_STEPS.map((s) => {
                const StepIcon = s.icon;
                return (
                  <Card key={s.n} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-green-light)]">
                        <StepIcon className="h-5 w-5 text-[var(--color-accent-green)]" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
                          Step {s.n}
                        </span>
                        <h3 className="mt-0.5 text-base font-bold text-[var(--color-primary)]">
                          {s.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{s.body1}</p>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{s.body2}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-[11px] font-medium text-[var(--color-text-secondary)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Card>
                );
              })}
              <Button
                type="button"
                fullWidth
                className="rounded-full bg-[var(--color-success)] text-white"
                onClick={() => setSuggestionDone(true)}
              >
                Mark As Resolved
              </Button>
            </>
          )}
        </div>
      )}

      {/* Sticky "+" button */}
      <button
        type="button"
        onClick={() => navigate("/mood/set")}
        className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px)+12px)] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-orange)] text-white shadow-[0_8px_24px_rgba(224,122,58,0.5)] transition-transform active:scale-95 lg:bottom-6"
        aria-label="Log mood"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}
