"use client";

import { useEffect, type ReactNode } from "react";
import { applyTheme } from "@/lib/theme-utils";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyTheme();
  }, []);

  return children;
}
