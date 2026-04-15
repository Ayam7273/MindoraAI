import type { MoodKey } from "@/types";

const MOOD_SCORE: Record<MoodKey, number> = {
  depressed: 10,
  sad: 30,
  neutral: 50,
  happy: 75,
  overjoyed: 100,
};

/** 8h sleep = 100; <5h approaches 20; linear interpolate between 5–8h */
export function sleepHoursToScore(hours: number): number {
  if (hours >= 8) return 100;
  if (hours <= 0) return 20;
  if (hours < 5) return 20;
  return 20 + ((hours - 5) / (8 - 5)) * 80;
}

/** Stress level 1 (calm) = 100 … 5 (extreme) = 10 */
export function stressLevelToScore(level: number): number {
  const map: Record<number, number> = { 1: 100, 2: 80, 3: 60, 4: 30, 5: 10 };
  return map[Math.min(5, Math.max(1, Math.round(level)))] ?? 60;
}

export function journalStreakToScore(streakDays: number): number {
  return Math.min(100, streakDays * 3);
}

export function computeMindoraScore(input: {
  mood: MoodKey;
  sleepHours: number;
  stressLevel: number;
  journalStreakDays: number;
}): number {
  const m = MOOD_SCORE[input.mood];
  const s = sleepHoursToScore(input.sleepHours);
  const t = stressLevelToScore(input.stressLevel);
  const j = journalStreakToScore(input.journalStreakDays);
  const raw = m * 0.25 + s * 0.25 + t * 0.25 + j * 0.25;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

