"use client";

import { ThemeProvider } from "@/components/providers/theme-context";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );
}

export { setThemeMode } from "@/components/providers/theme-context";
