const ONBOARDING_PATHS = new Set([
  "/",
  "/signin",
  "/signup",
  "/assessment",
  "/profile-setup",
  "/forgot-password",
]);

const HIDE_BOTTOM_PREFIXES = [
  "/chatbot/voice",
  "/mindful/exercise/active",
  "/sleep/active",
  "/sleep/wake",
  "/sleep/results",
  "/mood/set",
  "/notifications/smart",
  "/resources/play",
  "/mindful/complete",
];

export function isOnboardingPath(pathname: string) {
  return ONBOARDING_PATHS.has(pathname);
}

export function shouldHideBottomNav(pathname: string) {
  if (ONBOARDING_PATHS.has(pathname)) return true;
  return HIDE_BOTTOM_PREFIXES.some((p) => pathname.startsWith(p));
}
