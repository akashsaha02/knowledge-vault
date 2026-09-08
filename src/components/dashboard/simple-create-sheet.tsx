"use client";

import {
  BookOpen,
  Code,
  Folder,
  Link as LinkIcon,
  Paperclip,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CREATE_LINKS } from "@/lib/nav-config";

const SHEET_ICONS: Record<string, React.ReactNode> = {
  note: <BookOpen size={16} strokeWidth={1.75} />,
  bookmark: <LinkIcon size={16} strokeWidth={1.75} />,
  snippet: <Code size={16} strokeWidth={1.75} />,
  command: <Terminal size={16} strokeWidth={1.75} />,
  prompt: <Sparkles size={16} strokeWidth={1.75} />,
  file: <Paperclip size={16} strokeWidth={1.75} />,
};

const SHEET_ICON_CLASS: Record<string, string> = {
  note: "create-sheet-icon-note",
  bookmark: "create-sheet-icon-link",
  snippet: "create-sheet-icon-code",
  command: "create-sheet-icon-code",
  file: "create-sheet-icon-file",
};

type SimpleCreateSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function SimpleCreateSheet({ open, onClose }: SimpleCreateSheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="create-sheet-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="create-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="What do you want to create?"
      >
        <div className="create-sheet-header">
          <span className="create-sheet-title">New</span>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={16} strokeWidth={1.75} />
          </Button>
        </div>

        <div className="create-sheet-grid">
          {CREATE_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="create-sheet-item"
              onClick={onClose}
            >
              <span
                className={`create-sheet-icon ${SHEET_ICON_CLASS[item.key] ?? ""}`}
                aria-hidden="true"
              >
                {SHEET_ICONS[item.key]}
              </span>
              <span className="create-sheet-item-label">{item.label}</span>
              <span className="create-sheet-item-desc">{item.description}</span>
            </Link>
          ))}

          <Link
            href="/dashboard/projects?new=1"
            className="create-sheet-item create-sheet-icon-project"
            onClick={onClose}
          >
            <span className="create-sheet-icon" aria-hidden="true">
              <Folder size={16} strokeWidth={1.75} />
            </span>
            <span className="create-sheet-item-label">Project</span>
            <span className="create-sheet-item-desc">
              Keep things organised
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
