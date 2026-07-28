"use client";

import { createContext, useContext, useEffect } from "react";
import { applyTheme } from "@/lib/theme-utils";

type ThemeContextValue = {
  mode: "dark";
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ mode: "dark", mounted: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  return useContext(ThemeContext);
}

export function useDocumentTheme(): "dark" {
  return "dark";
}

export function setThemeMode() {
  applyTheme();
}

export type ThemeMode = "dark";
