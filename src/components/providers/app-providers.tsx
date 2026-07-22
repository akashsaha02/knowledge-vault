"use client";

import { App, ConfigProvider, theme as antdTheme } from "antd";
import type { ThemeConfig } from "antd";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function getThemeConfig(mode: ThemeMode, fontFamily: string): ThemeConfig {
  return {
    token: {
      fontFamily,
      colorPrimary: "#171717",
      borderRadius: 8,
    },
    algorithm:
      mode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };
}

export function AppProviders({
  children,
  fontFamily,
}: {
  children: React.ReactNode;
  fontFamily: string;
}) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
    if (stored === "light" || stored === "dark") {
      setMode(stored);
      document.documentElement.dataset.theme = stored;
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setMode(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<ThemeMode>;
      if (custom.detail === "light" || custom.detail === "dark") {
        setMode(custom.detail);
        localStorage.setItem("theme-mode", custom.detail);
        document.documentElement.dataset.theme = custom.detail;
      }
    };

    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  return (
    <ConfigProvider theme={getThemeConfig(mode, fontFamily)}>
      <App>{children}</App>
    </ConfigProvider>
  );
}

export function setThemeMode(mode: ThemeMode) {
  window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
}
