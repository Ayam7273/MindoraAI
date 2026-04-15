/** Demo keyword heuristic — production must use clinician-reviewed pipelines. */

const PATTERNS = [
  /\bkill myself\b/i,
  /\bsuicid\w*\b/i,
  /\bend it all\b/i,
  /\bwant to die\b/i,
  /\bnot worth living\b/i,
];

export function detectCrisisLanguage(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  return PATTERNS.some((p) => p.test(t));
}
