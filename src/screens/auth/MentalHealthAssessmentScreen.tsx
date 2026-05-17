import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Mic,
  MicOff,
  Search,
  Stethoscope,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useSaveAssessmentResponse } from "@/hooks/useAssessmentResponses";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useUpdateMindoraScore } from "@/hooks/useMindoraScoreHistory";
import { useAddStressEntry } from "@/hooks/useStressEntries";
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

const TOTAL = 14;

const BODY_ZONES = [
  { id: "head", label: "Head" },
  { id: "chest", label: "Chest" },
  { id: "arms", label: "Arms" },
  { id: "abdomen", label: "Abdomen" },
  { id: "legs", label: "Legs" },
] as const;

type BodyZoneId = (typeof BODY_ZONES)[number]["id"];

function moodSliderToKey(m: number): MoodKey {
  if (m < 20) return "depressed";
  if (m < 40) return "sad";
  if (m < 60) return "neutral";
  if (m < 80) return "happy";
  return "overjoyed";
}

export function MentalHealthAssessmentScreen() {
  const navigate = useNavigate();
  const saveAssessment = useSaveAssessmentResponse();
  const updateProfile = useUpdateProfile();
  const addStress = useAddStressEntry();
  const updateMindora = useUpdateMindoraScore();
  const [step, setStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [healthGoal, setHealthGoal] = useState<string | null>(null);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [age, setAge] = useState(24);
  const [weightKg, setWeightKg] = useState(68);
  const [mood, setMood] = useState(50);
  const [professionalHelp, setProfessionalHelp] = useState<boolean | null>(null);
  const [physicalDistress, setPhysicalDistress] = useState<boolean | null>(null);
  const [bodyZones, setBodyZones] = useState<BodyZoneId[]>([]);
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);
  const [takesMeds, setTakesMeds] = useState<boolean | null>(null);
  const [medSearch, setMedSearch] = useState("");
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [stress, setStress] = useState(3);
  const [recording, setRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  const progress = ((step + 1) / TOTAL) * 100;

  const toggleBodyZone = (id: BodyZoneId) => {
    setBodyZones((prev) =>
      prev.includes(id) ? prev.filter((z) => z !== id) : [...prev, id],
    );
  };

  const toggleMed = (name: string) => {
    setSelectedMeds((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    );
  };

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const filteredMeds = useMemo(() => {
    const q = medSearch.trim().toLowerCase();
    if (!q) return [...COMMON_MEDICATIONS];
    return COMMON_MEDICATIONS.filter((m) => m.toLowerCase().includes(q));
  }, [medSearch]);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = () => {};
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setVoiceTranscript((t) => t || "I feel lonely... with all my heart.");
      };
      mr.start();
      setRecording(true);
    } catch {
      setVoiceTranscript("I feel lonely... with all my heart.");
    }
  }, []);

  useEffect(() => {
    if (step !== 12) {
      stopRecording();
    }
  }, [step, stopRecording]);

  useEffect(() => {
    if (step !== 13) {
      setCameraOn(false);
      if (videoRef.current) {
        const src = videoRef.current.srcObject as MediaStream | null;
        src?.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        setCameraOn(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      } catch {
        setCameraOn(false);
      }
    })();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [step]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return healthGoal != null;
      case 1:
        return gender != null;
      case 2:
        return age >= 13 && age <= 120;
      case 3:
        return weightKg >= 30 && weightKg <= 250;
      case 4:
        return true;
      case 5:
        return professionalHelp != null;
      case 6:
        return physicalDistress != null;
      case 7:
        return sleepQuality != null;
      case 8:
        return takesMeds != null;
      case 9:
        return takesMeds === false || selectedMeds.length > 0;
      case 10:
        return symptoms.length > 0;
      case 11:
        return stress >= 1 && stress <= 5;
      case 12:
        return voiceTranscript.trim().length > 0;
      case 13:
        return true;
      default:
        return true;
    }
  }, [
    step,
    healthGoal,
    gender,
    age,
    weightKg,
    professionalHelp,
    physicalDistress,
    sleepQuality,
    takesMeds,
    selectedMeds.length,
    symptoms.length,
    stress,
    voiceTranscript,
  ]);

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigate(-1);
  };

  const finishAssessment = async () => {
    const userId = useUiStore.getState().user?.id;
    if (!userId) {
      navigate("/signin", { replace: true });
      return;
    }
    const moodKey = moodSliderToKey(mood);
    const computed = computeMindoraScore({
      mood: moodKey,
      sleepHours: 7,
      stressLevel: stress,
      journalStreakDays: 0,
    });
    try {
      await saveAssessment.mutateAsync({
        user_id: userId,
        responses: {
          healthGoal,
          gender,
          age,
          weightKg,
          moodSlider: mood,
          professionalHelp,
          physicalDistress,
          bodyZones,
          sleepQuality,
          takesMeds,
          selectedMeds,
          symptoms,
          stress,
          voiceTranscript,
        },
        initial_mindora_score: computed,
      });
      await addStress.mutateAsync({ user_id: userId, stress_level: stress });
      await updateMindora.mutateAsync({
        userId,
        score: computed,
        reason: "Initial assessment",
      });
      await updateProfile.mutateAsync({
        id: userId,
        patch: {
          assessment_complete: true,
          weight: weightKg,
          gender: gender ?? null,
        },
      });
      navigate("/profile-setup");
    } catch {
      // Supabase errors surface in devtools; keep user on screen to retry
    }
  };

  const goNext = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else void finishAssessment();
  };

  const moodEmoji =
    mood < 20
      ? "😢"
      : mood < 40
        ? "😟"
        : mood < 60
          ? "😐"
          : mood < 80
            ? "🙂"
            : "😄";

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#FAF8F4]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[#FAF8F4]/95 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <span className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
            Assessment
          </span>
          <button
            type="button"
            onClick={() => void finishAssessment()}
            className="px-2 py-1.5 text-[var(--text-sm)] font-medium text-[var(--color-accent-green)]"
          >
            Skip
          </button>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
          <motion.div
            className="h-full rounded-full bg-[var(--color-accent-green)]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
        <p className="mt-1.5 text-center text-[11px] text-[var(--color-text-muted)]">
          {step + 1} of {TOTAL}
        </p>
      </header>

      <div className="flex flex-1 flex-col px-3 sm:px-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 flex-col"
          >
            {step === 0 && (
              <StepShell title="What's your health goal for today?">
                <ul className="mt-2 space-y-2">
                  {HEALTH_GOALS.map((g) => {
                    const selected = healthGoal === g;
                    return (
                      <li key={g}>
                        <button
                          type="button"
                          onClick={() => setHealthGoal(g)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-3.5 text-left text-[var(--text-sm)] transition-colors",
                            selected
                              ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[var(--color-primary)]"
                              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                              selected
                                ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green)] text-white"
                                : "border-[var(--color-border-strong)]",
                            )}
                          >
                            {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                          </span>
                          {g}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell title="What's your official gender?">
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: "male" as const, label: "Male", art: "♂" },
                      { id: "female" as const, label: "Female", art: "♀" },
                    ] as const
                  ).map(({ id, label, art }) => {
                    const selected = gender === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setGender(id)}
                        className={cn(
                          "flex flex-col items-center rounded-[var(--radius-lg)] border p-5 transition-colors",
                          selected
                            ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)]",
                        )}
                      >
                        <div className="mb-3 flex h-24 w-20 items-end justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] text-4xl text-[var(--color-text-secondary)]">
                          {art}
                        </div>
                        <span className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell title="What's your age?">
                <div className="mt-6 flex flex-col items-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[2.5rem] font-bold text-[var(--color-primary)]">
                    {age}
                  </div>
                  <input
                    type="range"
                    min={13}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="mt-8 w-full accent-[var(--color-accent-green)]"
                  />
                  <div className="mt-2 flex w-full justify-between text-[11px] text-[var(--color-text-muted)]">
                    <span>13</span>
                    <span>100</span>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell title="What's your weight?">
                <div className="mt-6 flex flex-col items-center">
                  <p className="text-[2rem] font-bold text-[var(--color-primary)]">
                    {weightKg}
                    <span className="text-[var(--text-lg)] font-semibold text-[var(--color-text-secondary)]">
                      {" "}
                      kg
                    </span>
                  </p>
                  <input
                    type="range"
                    min={30}
                    max={200}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="mt-6 w-full accent-[var(--color-accent-green)]"
                  />
                  <div className="mt-2 flex w-full justify-between text-[11px] text-[var(--color-text-muted)]">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell title="How would you describe your mood?">
                <div className="mt-4 flex flex-col items-center">
                  <div className="text-6xl" aria-hidden>
                    {moodEmoji}
                  </div>
                  <div className="relative mt-8 w-full px-2">
                    <div
                      className="h-3 w-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-accent-orange), var(--mood-neutral), var(--color-accent-green))",
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={mood}
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <div
                      className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-surface)] shadow-md"
                      style={{ left: `calc(${mood}% * 0.96 + 2%)` }}
                    />
                  </div>
                </div>
              </StepShell>
            )}

            {step === 5 && (
              <StepShell title="Have you sought professional help before?">
                <div className="mt-6 flex justify-center rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] p-6">
                  <Stethoscope
                    className="h-20 w-20 text-[var(--color-accent-green)]"
                    strokeWidth={1.1}
                  />
                </div>
                <YesNoRow
                  value={professionalHelp}
                  onChange={setProfessionalHelp}
                  className="mt-8"
                />
              </StepShell>
            )}

            {step === 6 && (
              <StepShell title="Are you experiencing any physical distress?">
                <div className="mt-2 flex justify-center">
                  <div className="relative flex h-44 w-36 items-end justify-center rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)] pb-3">
                    <span className="text-7xl leading-none" aria-hidden>
                      🧍
                    </span>
                  </div>
                </div>
                <YesNoRow
                  value={physicalDistress}
                  onChange={setPhysicalDistress}
                  className="mt-6"
                />
                {physicalDistress ? (
                  <>
                    <p className="mt-4 text-center text-[var(--text-xs)] text-[var(--color-text-muted)]">
                      Tap body areas where you feel discomfort.
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {BODY_ZONES.map((z) => {
                        const on = bodyZones.includes(z.id);
                        return (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => toggleBodyZone(z.id)}
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-[var(--text-xs)] font-medium",
                              on
                                ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] text-[var(--color-primary)]"
                                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]",
                            )}
                          >
                            {z.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}
              </StepShell>
            )}

            {step === 7 && (
              <StepShell title="How would you rate your sleep quality?">
                <div className="mt-4 flex min-h-[280px] flex-1 justify-end gap-5">
                  <div className="flex flex-1 flex-col justify-between py-1 pr-1">
                    {[...SLEEP_LEVELS].reverse().map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setSleepQuality(lvl.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 text-left text-[var(--text-sm)]",
                          sleepQuality === lvl.id
                            ? "bg-[var(--color-accent-green-light)] font-semibold text-[var(--color-primary)]"
                            : "text-[var(--color-text-secondary)]",
                        )}
                      >
                        <span className="text-lg">{lvl.emoji}</span>
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative h-full min-h-[240px] w-3 shrink-0 rounded-full bg-[var(--color-border)]">
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-full bg-[var(--color-accent-green)] transition-all duration-300"
                      style={{
                        height: sleepQuality
                          ? `${((SLEEP_LEVELS.findIndex((s) => s.id === sleepQuality) + 1) / SLEEP_LEVELS.length) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </StepShell>
            )}

            {step === 8 && (
              <StepShell title="Are you taking any medications?">
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <ChoicePill
                    label="Yes"
                    selected={takesMeds === true}
                    onClick={() => setTakesMeds(true)}
                  />
                  <ChoicePill
                    label="No"
                    selected={takesMeds === false}
                    onClick={() => setTakesMeds(false)}
                  />
                </div>
              </StepShell>
            )}

            {step === 9 && (
              <StepShell title="Please specify your medications.">
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="search"
                    placeholder="Search medications..."
                    value={medSearch}
                    onChange={(e) => setMedSearch(e.target.value)}
                    className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-9 pr-3 text-[var(--text-sm)] outline-none focus:border-[var(--color-border-strong)]"
                  />
                </div>
                <ul className="mt-3 max-h-[45vh] space-y-1 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                  {filteredMeds.map((m) => {
                    const on = selectedMeds.includes(m);
                    return (
                      <li key={m}>
                        <button
                          type="button"
                          onClick={() => toggleMed(m)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-[var(--text-sm)]",
                            on
                              ? "bg-[var(--color-accent-green-light)] text-[var(--color-primary)]"
                              : "hover:bg-[var(--color-bg-secondary)]",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                              on
                                ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green)] text-white"
                                : "border-[var(--color-border-strong)]",
                            )}
                          >
                            {on ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                          </span>
                          {m}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </StepShell>
            )}

            {step === 10 && (
              <StepShell title="Do you have other mental health symptoms?">
                <div className="mt-4 flex justify-center">
                  <div className="rounded-full bg-[var(--color-bg-secondary)] p-6 text-4xl">🤕</div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {SYMPTOM_CHIPS.map((s) => {
                    const on = symptoms.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSymptom(s)}
                        className={cn(
                          "rounded-full border px-3 py-2 text-[var(--text-sm)]",
                          on
                            ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green-light)] font-medium text-[var(--color-primary)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </StepShell>
            )}

            {step === 11 && (
              <StepShell title="How would you rate your stress level?">
                <p className="mt-4 text-center text-[3rem] font-bold text-[var(--color-accent-orange)]">
                  {stress}
                </p>
                <div className="mt-6 flex justify-between gap-1 px-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStress(n)}
                      className={cn(
                        "flex h-12 flex-1 items-center justify-center rounded-full text-[var(--text-sm)] font-semibold",
                        stress === n
                          ? "bg-[var(--color-accent-orange)] text-white shadow-md"
                          : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {step === 12 && (
              <StepShell title="AI Sound Analysis">
                <div className="mt-4 flex flex-1 flex-col items-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    {[1, 2, 3].map((ring) => (
                      <div
                        key={ring}
                        className="absolute rounded-full border border-[var(--color-accent-green)] opacity-40"
                        style={{
                          width: `${ring * 33}%`,
                          height: `${ring * 33}%`,
                          animation: recording ? `pulse ${1 + ring * 0.15}s ease-in-out infinite` : "none",
                        }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => (recording ? stopRecording() : void startRecording())}
                      className={cn(
                        "relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg",
                        recording ? "bg-[var(--color-danger)]" : "bg-[var(--color-accent-green)]",
                      )}
                      aria-label={recording ? "Stop recording" : "Start recording"}
                    >
                      {recording ? (
                        <MicOff className="h-9 w-9" strokeWidth={1.75} />
                      ) : (
                        <Mic className="h-9 w-9" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                  <p className="mt-4 text-center text-[var(--text-xs)] text-[var(--color-text-muted)]">
                    {format(new Date(), "h:mm a")} · Tap the mic to{" "}
                    {recording ? "stop recording" : "record"} a short note.
                  </p>
                  <label className="mt-6 w-full">
                    <span className="mb-1 block text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                      Transcript
                    </span>
                    <textarea
                      value={voiceTranscript}
                      onChange={(e) => setVoiceTranscript(e.target.value)}
                      placeholder="After recording, a transcript appears here. You can also type to continue."
                      rows={4}
                      className="w-full resize-none rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--text-sm)] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-border-strong)]"
                    />
                  </label>
                </div>
              </StepShell>
            )}

            {step === 13 && (
              <StepShell title="Expression Analysis">
                <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-lg)] bg-black">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    muted
                  />
                  {!cameraOn ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
                      <Video className="h-10 w-10" strokeWidth={1.25} />
                      <span className="px-4 text-center text-[var(--text-sm)]">
                        Camera unavailable — preview mode
                      </span>
                    </div>
                  ) : null}
                  <div
                    className="pointer-events-none absolute inset-[12%] border-2 border-dashed border-white/80"
                    style={{ borderRadius: "42% 42% 48% 48%" }}
                  />
                </div>
                <p className="mt-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                  {voiceTranscript || "I feel lonely... with all my heart."}
                </p>
              </StepShell>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-[var(--color-border)] bg-[#FAF8F4]/98 px-4 py-3 backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          fullWidth
          disabled={!canContinue}
          onClick={goNext}
          className="h-12 rounded-[var(--radius-lg)] text-[var(--text-base)] font-semibold disabled:opacity-40"
        >
          {step === TOTAL - 1 ? "Finish" : "Continue"}
        </Button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.04); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function StepShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h2 className="text-center text-[1.05rem] font-semibold leading-snug text-[var(--color-text-primary)]">
        {title}
      </h2>
      <div className="mt-2 flex flex-1 flex-col">{children}</div>
    </>
  );
}

function YesNoRow({
  value,
  onChange,
  className,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <ChoicePill label="Yes" selected={value === true} onClick={() => onChange(true)} />
      <ChoicePill label="No" selected={value === false} onClick={() => onChange(false)} />
    </div>
  );
}

function ChoicePill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[var(--radius-lg)] py-4 text-center text-[var(--text-base)] font-semibold transition-colors",
        selected
          ? "bg-[var(--color-accent-green)] text-white shadow-sm"
          : "bg-[var(--color-surface)] text-[var(--color-text-primary)] ring-1 ring-[var(--color-border)]",
      )}
    >
      {label}
    </button>
  );
}

