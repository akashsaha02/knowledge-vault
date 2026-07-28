"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUiStore } from "@/stores/ui-store";

export function useAutosave(
  onSave: () => Promise<void>,
  options?: { delay?: number; enabled?: boolean },
) {
  const delay = options?.delay ?? 1500;
  const enabled = options?.enabled ?? true;
  const setSaveStatus = useUiStore((s) => s.setSaveStatus);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const flush = useCallback(async () => {
    if (!enabled || isSavingRef.current) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    isSavingRef.current = true;
    setSaveStatus("saving");
    try {
      await onSaveRef.current();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled, setSaveStatus]);

  const schedule = useCallback(() => {
    if (!enabled) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void flush();
    }, delay);
  }, [delay, enabled, flush]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void flush();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flush]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  return { schedule, flush };
}
