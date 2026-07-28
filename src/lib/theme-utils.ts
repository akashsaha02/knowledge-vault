export type ThemeMode = "dark";

export function applyTheme() {
  if (typeof document === "undefined") return;
  document.documentElement.style.colorScheme = "dark";
}

export function readStoredTheme(): ThemeMode {
  return "dark";
}
