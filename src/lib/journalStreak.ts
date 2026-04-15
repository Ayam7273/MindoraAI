import { format, parseISO, subDays } from "date-fns";

/** Consecutive calendar days with a journal entry, counting backward from the most recent entry day. */
export function computeJournalStreak(createdAtIsoStrings: string[]): number {
  if (createdAtIsoStrings.length === 0) return 0;
  const dayKeys = new Set(createdAtIsoStrings.map((s) => format(parseISO(s), "yyyy-MM-dd")));
  const latest = createdAtIsoStrings
    .map((s) => parseISO(s))
    .reduce((a, b) => (a > b ? a : b));
  let cur = latest;
  let streak = 0;
  for (let i = 0; i < 730; i++) {
    const key = format(cur, "yyyy-MM-dd");
    if (dayKeys.has(key)) {
      streak += 1;
      cur = subDays(cur, 1);
    } else {
      break;
    }
  }
  return streak;
}
