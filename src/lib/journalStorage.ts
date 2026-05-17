/** Deprecated local storage helpers — data now lives in Supabase via useJournalEntries hook. */
export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  aiReflection?: string;
}

export function getJournalEntries(): JournalEntry[] {
  return [];
}

export function getJournalEntry(_id: string): JournalEntry | undefined {
  return undefined;
}

export function addJournalEntry(title: string, body: string): JournalEntry {
  return { id: crypto.randomUUID(), title, body, timestamp: new Date().toISOString() };
}

export function updateJournalEntry(_id: string, _patch: Partial<JournalEntry>): void {}

export function deleteJournalEntry(_id: string): void {}

export function getJournalStreak(): number {
  return 0;
}
