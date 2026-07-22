"use client";

import { Command } from "cmdk";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUiStore } from "@/stores/ui-store";

const COMMANDS = [
  { id: "search", label: "Search everything", href: "/dashboard/search" },
  { id: "note", label: "Create note", href: "/dashboard/notes?new=NOTE" },
  { id: "snippet", label: "Create snippet", href: "/dashboard/snippets?new=SNIPPET" },
  { id: "bookmark", label: "Create bookmark", href: "/dashboard/bookmarks?new=BOOKMARK" },
  { id: "command", label: "Create command", href: "/dashboard/commands?new=COMMAND" },
  { id: "projects", label: "Open projects", href: "/dashboard/projects" },
  { id: "settings", label: "Open settings", href: "/dashboard/settings" },
];

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n" && !e.shiftKey) {
        e.preventDefault();
        router.push("/dashboard/notes?new=NOTE");
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        router.push("/dashboard/snippets?new=SNIPPET");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, router, setOpen]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      title={null}
      closable={false}
      width={560}
    >
      <Command label="Command palette" className="w-full">
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {COMMANDS.map((cmd) => (
            <Command.Item
              key={cmd.id}
              onSelect={() => {
                setOpen(false);
                router.push(cmd.href);
              }}
            >
              {cmd.label}
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </Modal>
  );
}
