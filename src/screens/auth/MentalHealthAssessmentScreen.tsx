import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Heart,
  Moon,
  Pill,
  Smile,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddStressEntry } from "@/hooks/useStressEntries";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { useSaveAssessmentResponse } from "@/hooks/useAssessmentResponses";
import { computeMindoraScore } from "@/lib/mindoraScoreModel";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import type { MoodKey } from "@/types";
import {
  COMMON_MEDICATIONS,
  HEALTH_GOALS,
  SLEEP_LEVELS,
  SYMPTOM_CHIPS,
} from "@/screens/auth/assessmentData";

// ── Types ─────────────────────────────────────────────────────────────────────
type BodyZone = "head" | "chest" | "arms" | "abdomen" | "legs";

const BODY_ZONES: { id: BodyZone; label: string }[] = [
  { id: "head", label: "Head" },
  { id: "chest", label: "Chest" },
  { id: "arms", label: "Arms" },
  { id: "abdomen", label: "Abdomen" },
  { id: "legs", label: "Legs" },
];

const TOTAL_STEPS = 11;

function moodSliderToKey(m: number): MoodKey {
  if (m < 20) return "depressed";
  if (m < 40) return "sad";
  if (m < 60) return "neutral";
  if (m < 80) return "happy";
  return "overjoyed";
}

// ── Step wrapper ──────────────────────────────────────────────────────────────
function StepCard({ children, icon, title, subtitle }: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Icon + heading */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-green-light)] text-[var(--color-accent-green)]">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-serif)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Choice chip ───────────────────────────────────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97]",
        selected
          ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]",
      )}
    >
      {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-accent-green)]" strokeWidth={2.5} />}
      {label}
    </button>
  );
}

// ── Yes / No pair ─────────────────────────────────────────────────────────────
function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-4 text-sm font-bold transition-all",
            value === v
              ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[var(--color-primary)]"
              : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]",
          )}
        >
          {v ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MentalHealthAssessmentScreen() {
  const navigate = useNavigate();
  const saveAssessment = useSaveAssessmentResponse();
  const updateProfile = useUpdateProfile();
  const addStress = useAddStressEntry();
  const updateMindora = useUpdateMindoraScore();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [healthGoal, setHealthGoal] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState(24);
  const [mood, setMood] = useState(50);
  const [professionalHelp, setProfessionalHelp] = useState<boolean | null>(null);
  const [physicalDistress, setPhysicalDistress] = useState<boolean | null>(null);
  const [bodyZones, setBodyZones] = useState<BodyZone[]>([]);
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);
  const [takesMeds, setTakesMeds] = useState<boolean | null>(null);
  const [medSearch, setMedSearch] = useState("");
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [stress, setStress] = useState(3);

  const filteredMeds = useMemo(() => {
    const q = medSearch.trim().toLowerCase();
    return q ? COMMON_MEDICATIONS.filter((m) => m.toLowerCase().includes(q)) : [...COMMON_MEDICATIONS];
  }, [medSearch]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return healthGoal != null;
      case 1: return gender != null;
      case 2: return age >= 13 && age <= 120;
      case 3: return true; // mood slider
      case 4: return professionalHelp != null;
      case 5: return physicalDistress != null;
      case 6: return physicalDistress === false || bodyZones.length > 0;
      case 7: return sleepQuality != null;
      case 8: return takesMeds != null;
      case 9: return takesMeds === false || selectedMeds.length > 0;
      case 10: return symptoms.length > 0;
      default: return true;
    }
  }, [step, healthGoal, gender, age, professionalHelp, physicalDistress, bodyZones, sleepQuality, takesMeds, selectedMeds, symptoms]);

  const goNext = () => {
    if (step === 5 && physicalDistress === false) {
      // Skip body zones step
      setDirection(1); setStep(7);
    } else if (step === 8 && takesMeds === false) {
      // Skip medication selection
      setDirection(1); setStep(10);
    } else if (step < TOTAL_STEPS - 1) {
      setDirection(1); setStep((s) => s + 1);
    } else {
      void finishAssessment();
    }
  };

  const goBack = () => {
    if (step === 7 && physicalDistress === false) {
      setDirection(-1); setStep(5);
    } else if (step === 10 && takesMeds === false) {
      setDirection(-1); setStep(8);
    } else if (step > 0) {
      setDirection(-1); setStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const finishAssessment = async () => {
    const userId = useUiStore.getState().user?.id;
    if (!userId) { navigate("/signin", { replace: true }); return; }
    const moodKey = moodSliderToKey(mood);
    const computed = computeMindoraScore({ mood: moodKey, sleepHours: 7, stressLevel: stress, journalStreakDays: 0 });
    try {
      await saveAssessment.mutateAsync({
        user_id: userId,
        responses: { healthGoal, gender, age, moodSlider: mood, professionalHelp, physicalDistress, bodyZones, sleepQuality, takesMeds, selectedMeds, symptoms, stress },
        initial_mindora_score: computed,
      });
      await addStress.mutateAsync({ user_id: userId, stress_level: stress });
      await updateMindora.mutateAsync({ userId, score: computed, reason: "Initial assessment" });
      await updateProfile.mutateAsync({ id: userId, patch: { assessment_complete: true, gender: gender ?? null } });
      navigate("/profile-setup");
    } catch { /* show retry on next attempt */ }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const moodLabel = mood < 20 ? "Depressed" : mood < 40 ? "Sad" : mood < 60 ? "Neutral" : mood < 80 ? "Happy" : "Overjoyed";
  const moodColor = mood < 20 ? "#7B6EC8" : mood < 40 ? "#E07A3A" : mood < 60 ? "#8B7355" : mood < 80 ? "#F5C842" : "#5BAD6F";

  const stressLabels = ["", "Calm", "Normal", "Elevated", "Stressed", "Extreme"];
  const stressColors = ["", "#22c55e", "#84cc16", "#f59e0b", "#f97316", "#ef4444"];

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF8F4]" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Progress header */}
      <header className="sticky top-0 z-10 bg-[#FAF8F4]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button type="button" onClick={goBack} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[var(--color-border)]">
            <ArrowLeft className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent-green)]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-[var(--color-text-muted)]">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Step content */}
      <div className="flex flex-1 flex-col overflow-hidden px-5 pb-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-1 flex-col pt-6"
          >

            {/* Step 0 — Health goal */}
            {step === 0 && (
              <StepCard icon={<Target className="h-8 w-8" strokeWidth={1.5} />} title="What brings you to Mindora?" subtitle="Choose the goal that matters most to you right now.">
                <div className="flex flex-col gap-2">
                  {HEALTH_GOALS.map((g) => (
                    <Chip key={g} label={g} selected={healthGoal === g} onClick={() => setHealthGoal(g)} />
                  ))}
                </div>
              </StepCard>
            )}

            {/* Step 1 — Gender */}
            {step === 1 && (
              <StepCard icon={<User className="h-8 w-8" strokeWidth={1.5} />} title="How do you identify?" subtitle="This helps us personalise your experience.">
                <div className="flex flex-col gap-2">
                  {["Female", "Male", "Non-binary", "Prefer not to say"].map((g) => (
                    <Chip key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
                  ))}
                </div>
              </StepCard>
            )}

            {/* Step 2 — Age */}
            {step === 2 && (
              <StepCard icon={<Sparkles className="h-8 w-8" strokeWidth={1.5} />} title="How old are you?" subtitle="We need this to provide age-appropriate support.">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[var(--color-accent-green-light)]">
                    <span className="text-4xl font-bold text-[var(--color-primary)]">{age}</span>
                  </div>
                  <input
                    type="range"
                    min={13}
                    max={90}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full max-w-xs accent-[var(--color-accent-green)]"
                  />
                  <div className="flex w-full max-w-xs justify-between text-xs text-[var(--color-text-muted)]">
                    <span>13</span><span>90</span>
                  </div>
                </div>
              </StepCard>
            )}

            {/* Step 3 — Current mood */}
            {step === 3 && (
              <StepCard icon={<Smile className="h-8 w-8" strokeWidth={1.5} />} title="How are you feeling right now?" subtitle="Slide to choose your current emotional state.">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl" style={{ backgroundColor: `${moodColor}20` }}>
                    <span className="text-base font-bold" style={{ color: moodColor }}>{moodLabel}</span>
                  </div>
                  <div className="relative w-full max-w-sm">
                    <div
                      className="absolute inset-y-0 left-0 my-auto h-2 rounded-full transition-all"
                      style={{ width: `${mood}%`, background: `linear-gradient(to right, #7B6EC8, ${moodColor})` }}
                    />
                    <div className="absolute inset-y-0 left-0 right-0 my-auto h-2 rounded-full bg-[var(--color-border)]" style={{ zIndex: -1 }} />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={mood}
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="relative w-full cursor-pointer appearance-none bg-transparent h-8"
                      style={{ ["--thumb-color" as string]: moodColor }}
                    />
                  </div>
                  <style>{`input[type="range"]::-webkit-slider-thumb { background-color: var(--thumb-color, #5BAD6F); width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); appearance: none; cursor: pointer; }`}</style>
                </div>
              </StepCard>
            )}

            {/* Step 4 — Professional help */}
            {step === 4 && (
              <StepCard icon={<Heart className="h-8 w-8" strokeWidth={1.5} />} title="Are you currently seeing a mental health professional?" subtitle="Therapist, counsellor, psychiatrist, etc.">
                <YesNo value={professionalHelp} onChange={setProfessionalHelp} />
              </StepCard>
            )}

            {/* Step 5 — Physical distress */}
            {step === 5 && (
              <StepCard icon={<Brain className="h-8 w-8" strokeWidth={1.5} />} title="Are you experiencing any physical symptoms linked to your mental health?">
                <YesNo value={physicalDistress} onChange={setPhysicalDistress} />
              </StepCard>
            )}

            {/* Step 6 — Body zones (only shown if physicalDistress === true) */}
            {step === 6 && (
              <StepCard icon={<Brain className="h-8 w-8" strokeWidth={1.5} />} title="Where do you feel it most?" subtitle="Select all areas that apply.">
                <div className="flex flex-col gap-2">
                  {BODY_ZONES.map((z) => (
                    <Chip
                      key={z.id}
                      label={z.label}
                      selected={bodyZones.includes(z.id)}
                      onClick={() => setBodyZones((prev) => prev.includes(z.id) ? prev.filter((x) => x !== z.id) : [...prev, z.id])}
                    />
                  ))}
                </div>
              </StepCard>
            )}

            {/* Step 7 — Sleep quality */}
            {step === 7 && (
              <StepCard icon={<Moon className="h-8 w-8" strokeWidth={1.5} />} title="How has your sleep been lately?">
                <div className="flex flex-col gap-2">
                  {SLEEP_LEVELS.map((s) => (
                    <Chip key={s.id} label={s.label} selected={sleepQuality === s.id} onClick={() => setSleepQuality(s.id)} />
                  ))}
                </div>
              </StepCard>
            )}

            {/* Step 8 — Takes medication */}
            {step === 8 && (
              <StepCard icon={<Pill className="h-8 w-8" strokeWidth={1.5} />} title="Are you currently taking any medications?" subtitle="Including supplements, mental health medication, or other prescriptions.">
                <YesNo value={takesMeds} onChange={setTakesMeds} />
              </StepCard>
            )}

            {/* Step 9 — Which medications */}
            {step === 9 && (
              <StepCard icon={<Pill className="h-8 w-8" strokeWidth={1.5} />} title="Which medications?" subtitle="Select all that apply.">
                <input
                  value={medSearch}
                  onChange={(e) => setMedSearch(e.target.value)}
                  placeholder="Search medications…"
                  className="mb-3 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-border-strong)]"
                />
                <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "280px" }}>
                  {filteredMeds.map((m) => (
                    <Chip
                      key={m}
                      label={m}
                      selected={selectedMeds.includes(m)}
                      onClick={() => setSelectedMeds((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])}
                    />
                  ))}
                </div>
              </StepCard>
            )}

            {/* Step 10 — Symptoms */}
            {step === 10 && (
              <StepCard icon={<Sparkles className="h-8 w-8" strokeWidth={1.5} />} title="What are you experiencing?" subtitle="Select everything that resonates with you.">
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_CHIPS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all",
                        symptoms.includes(s)
                          ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[var(--color-primary)]"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Stress level at the bottom of the last step */}
                <div className="mt-8">
                  <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">
                    Overall stress level right now
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setStress(v)}
                        className={cn(
                          "flex flex-1 flex-col items-center justify-center rounded-2xl border-2 py-3 text-xs font-bold transition-all",
                          stress === v
                            ? "border-transparent text-white"
                            : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]",
                        )}
                        style={stress === v ? { backgroundColor: stressColors[v], borderColor: stressColors[v] } : {}}
                      >
                        <span className="text-lg font-bold">{v}</span>
                        <span className="text-[9px] leading-tight">{stressLabels[v]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </StepCard>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={goNext}
          disabled={!canContinue}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] py-4 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-40 active:scale-[0.98]"
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
              Complete Assessment
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
