import type { MoodKey } from "@/types";

export interface MoodEntry {
  id: string;
  mood: MoodKey;
  timestamp: string;
  note?: string;
}

/** Deprecated local storage helpers — data now lives in Supabase via useMoodEntries hook. */
export function getMoodEntries(): MoodEntry[] {
  return [];
}

export function addMoodEntry(_mood: MoodKey, _note?: string): MoodEntry {
  return { id: crypto.randomUUID(), mood: _mood, timestamp: new Date().toISOString(), note: _note };
}

export function getLastMoodEntry(): MoodEntry | undefined {
  return undefined;
}

export function getMoodTrend(): "up" | "down" | "stable" | null {
  return null;
}
