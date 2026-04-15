export function applyDataTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}
