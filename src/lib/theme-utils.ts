export function applyTheme() {
  if (typeof document === "undefined") return;
  document.documentElement.style.colorScheme = "dark";
}
