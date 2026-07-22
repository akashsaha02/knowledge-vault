"use client";

import { App, ConfigProvider } from "antd";
import { getAppTheme } from "@/lib/theme";
import { ThemeProvider, useThemeMode } from "@/components/providers/theme-context";

function ThemedApp({
  children,
  fontFamily,
  fontMono,
}: {
  children: React.ReactNode;
  fontFamily: string;
  fontMono: string;
}) {
  const { mode } = useThemeMode();

  return (
    <ConfigProvider theme={getAppTheme(mode, fontFamily, fontMono)}>
      <App>{children}</App>
    </ConfigProvider>
  );
}

export function AppProviders({
  children,
  fontFamily,
  fontMono,
}: {
  children: React.ReactNode;
  fontFamily: string;
  fontMono: string;
}) {
  return (
    <ThemeProvider>
      <ThemedApp fontFamily={fontFamily} fontMono={fontMono}>
        {children}
      </ThemedApp>
    </ThemeProvider>
  );
}

export { setThemeMode } from "@/components/providers/theme-context";
