import { useMemo } from "react";
import { computeFreudScore } from "@/lib/freudScoreModel";
import { computeJournalStreak } from "@/lib/journalStreak";
import type { MoodKey } from "@/types";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useSleepEntries } from "@/hooks/useSleepEntries";
import { useStressEntries } from "@/hooks/useStressEntries";
import { useUiStore } from "@/store/uiStore";

function latestMoodFromEntries(rows: { mood: string }[] | undefined): MoodKey {
  const m = rows?.[0]?.mood;
  if (
    m === "depressed" ||
    m === "sad" ||
    m === "neutral" ||
    m === "happy" ||
    m === "overjoyed"
  ) {
    return m;
  }
  return "neutral";
}

/**
 * Freud score from latest mood/stress/sleep + journal streak (client-side model).
 */
export function useFreudScore(userId: string | undefined) {
  const activeMood = useUiStore((s) => s.activeMood);
  const { data: moods } = useMoodEntries(userId);
  const { data: stressRows } = useStressEntries(userId);
  const { data: sleepRows } = useSleepEntries(userId);
  const { data: journals } = useJournalEntries(userId);

  return useMemo(() => {
    const mood: MoodKey = activeMood ?? latestMoodFromEntries(moods);
    const stressLevel = stressRows?.[0]?.stress_level ?? 2;
    const sleepHours = sleepRows?.[0]?.duration_hours ?? 7;
    const streak = computeJournalStreak(journals?.map((j) => j.created_at) ?? []);
    const computed = computeFreudScore({
      mood,
      sleepHours: typeof sleepHours === "number" ? sleepHours : 7,
      stressLevel,
      journalStreakDays: streak,
    });
    return { score: computed, computed, mood, stressLevel, sleepHours, journalStreakDays: streak };
  }, [activeMood, moods, stressRows, sleepRows, journals]);
}
