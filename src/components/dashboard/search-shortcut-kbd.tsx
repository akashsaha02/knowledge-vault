"use client";

import { useEffect, useState } from "react";

export function SearchShortcutKbd() {
  const [shortcut, setShortcut] = useState("Ctrl+K");

  useEffect(() => {
    setShortcut(/Mac/i.test(navigator.platform) ? "⌘K" : "Ctrl+K");
  }, []);

  return (
    <kbd className="dashboard-kbd" aria-hidden="true">
      {shortcut}
    </kbd>
  );
}
