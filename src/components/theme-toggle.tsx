"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { setThemeMode } from "@/components/providers/app-providers";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme-mode");
    setIsDark(stored === "dark");
  }, []);

  return (
    <Button
      type="text"
      aria-label="Toggle theme"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setIsDark(!isDark);
        setThemeMode(next);
      }}
    />
  );
}
