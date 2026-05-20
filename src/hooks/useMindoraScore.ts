import { useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useMoodEntries } from "./useMoodEntries";
import { useJournalEntries } from "./useJournalEntries";
import { useStressEntries } from "./useStressEntries";
import { useSleepEntries } from "./useSleepEntries";
import { useChatbotConversations } from "./useChatbotConversations";
import type { MoodKey } from "@/types";

// TODAY = midnight to now
function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

const MOOD_SCORE: Record<MoodKey, number> = {
  depressed: 10,
  sad: 30,
  neutral: 50,
  happy: 75,
  overjoyed: 100,
};

export interface ScoreBreakdown {
  moodScore: number;
  journalScore: number;
  stressScore: number;
  sleepScore: number;
  chatScore: number;
}

export function useMindoraScore(userId: string | undefined) {
  const { data: moodEntries = [] } = useMoodEntries(userId);
  const { data: journalEntries = [] } = useJournalEntries(userId);
  const { data: stressEntries = [] } = useStressEntries(userId);
  const { data: sleepEntries = [] } = useSleepEntries(userId);
  const { data: chatConvos = [] } = useChatbotConversations(userId);

  const { score, breakdown } = useMemo(() => {
    if (!userId) return { score: 50, breakdown: { moodScore: 50, journalScore: 0, stressScore: 55, sleepScore: 60, chatScore: 0 } };

    // ── 1. MOOD FACTOR (25 pts) ──
    // Latest mood entry (not just today — carry over if not logged yet today)
    const latestMood = moodEntries[0]?.mood as MoodKey | undefined;
    const moodScore = latestMood ? MOOD_SCORE[latestMood] : 50;

    // ── 2. JOURNAL FACTOR (20 pts) ──
    // Streak: consecutive calendar days with a journal entry
    const sorted = [...journalEntries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      if (sorted.some((e) => e.created_at.startsWith(dateStr))) streak++;
      else break;
    }
    // Also bonus for journalling today
    const journalledToday = sorted.some((e) => isToday(e.created_at)) ? 1 : 0;
    const journalScore = Math.min(100, streak * 5 + journalledToday * 10);

    // ── 3. STRESS FACTOR (20 pts) ──
    const stressMap: Record<number, number> = { 1: 100, 2: 80, 3: 55, 4: 25, 5: 0 };
    const todayStress = stressEntries.filter((e) => isToday(e.created_at));
    const latestStress = (todayStress[0] ?? stressEntries[0])?.stress_level ?? 2;
    const stressScore = stressMap[Math.min(5, Math.max(1, Math.round(latestStress)))] ?? 55;

    // ── 4. SLEEP FACTOR (20 pts) ──
    const lastSleep = sleepEntries[0];
    let sleepScore = 60; // neutral default
    if (lastSleep?.duration_hours != null) {
      const h = lastSleep.duration_hours;
      if (h >= 8) sleepScore = 100;
      else if (h >= 7) sleepScore = 85;
      else if (h >= 6) sleepScore = 65;
      else if (h >= 5) sleepScore = 40;
      else sleepScore = 20;
    }

    // ── 5. AI ENGAGEMENT FACTOR (15 pts) ──
    // Reward using the chatbot today
    const chatToday = chatConvos.filter((c) => isToday(c.updated_at)).length;
    const chatScore = Math.min(100, chatToday * 50); // 0, 50, or 100

    // ── COMPOSITE SCORE ──
    const raw =
      moodScore * 0.25 +
      journalScore * 0.20 +
      stressScore * 0.20 +
      sleepScore * 0.20 +
      chatScore * 0.15;

    const computed = Math.round(Math.min(100, Math.max(0, raw)));

    return {
      score: computed,
      breakdown: { moodScore, journalScore, stressScore, sleepScore, chatScore },
    };
  }, [userId, moodEntries, journalEntries, stressEntries, sleepEntries, chatConvos]);

  // Persist score to Supabase profiles.mindora_score (fire-and-forget)
  useMemo(() => {
    if (!userId) return;
    supabase
      .from("profiles")
      .update({ mindora_score: score })
      .eq("id", userId)
      .then(() => undefined);
  }, [userId, score]);

  // Return current mood for display
  const mood = (moodEntries[0]?.mood ?? "neutral") as MoodKey;

  return { score, mood, breakdown };
}
