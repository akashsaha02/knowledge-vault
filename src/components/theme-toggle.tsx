"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useDocumentTheme } from "@/components/providers/theme-context";
import { toggleThemeMode } from "@/lib/theme-utils";

export function ThemeToggle() {
  const mode = useDocumentTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button type="text" aria-label="Toggle theme" icon={<MoonOutlined />} />;
  }

  const isDark = mode === "dark";

  return (
    <Button
      type="text"
      aria-label="Toggle theme"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={() => toggleThemeMode(mode)}
    />
  );
}
