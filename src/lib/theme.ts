export function applyDataTheme(_dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", "light");
}
