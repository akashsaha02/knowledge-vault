export type ThemeMode = "light" | "dark";

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  localStorage.setItem("theme-mode", mode);
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme-mode");
  return stored === "dark" ? "dark" : "light";
}

export function toggleThemeMode(current: ThemeMode): ThemeMode {
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));
  return next;
}
