/** Safe wrapper for navigator.vibrate (no-op if unsupported). */

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export function hapticLight() {
  vibrate(10);
}

export function hapticSuccess() {
  vibrate([50, 30, 50]);
}

export function hapticError() {
  vibrate([100, 50, 100]);
}
