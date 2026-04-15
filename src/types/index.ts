export type MoodKey = "depressed" | "sad" | "neutral" | "happy" | "overjoyed";

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
}
