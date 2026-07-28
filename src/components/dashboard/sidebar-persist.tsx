"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/ui-store";

const STORAGE_KEY = "nook-sidebar-collapsed";

export function SidebarPersist() {
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setSidebarCollapsed(true);
    } catch {
      /* ignore */
    }
  }, [setSidebarCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(sidebarCollapsed));
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed]);

  return null;
}
