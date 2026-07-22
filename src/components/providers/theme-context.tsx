"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  applyTheme,
  readStoredTheme,
  toggleThemeMode,
  type ThemeMode,
} from "@/lib/theme-utils";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readStoredTheme();
    setModeState(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<ThemeMode>;
      if (custom.detail === "light" || custom.detail === "dark") {
        setModeState(custom.detail);
      }
    };

    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    applyTheme(next);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));
  };

  const toggle = () => {
    setModeState((current) => toggleThemeMode(current));
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;

  return {
    mode: "light",
    setMode: applyTheme,
    toggle: () => toggleThemeMode(readStoredTheme()),
    mounted: false,
  };
}

/** Reads theme from `data-theme` on <html> — safe outside React context. */
export function useDocumentTheme(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const read = () => {
      const theme = document.documentElement.dataset.theme;
      setMode(theme === "dark" ? "dark" : "light");
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("theme-change", read);
    return () => {
      observer.disconnect();
      window.removeEventListener("theme-change", read);
    };
  }, []);

  return mode;
}

export function setThemeMode(mode: ThemeMode) {
  applyTheme(mode);
  window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
}

export type { ThemeMode };
