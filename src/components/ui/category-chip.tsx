import type { ItemType } from "@/generated/prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  Code,
  File,
  FileText,
  Link,
  Paperclip,
  Sparkles,
} from "lucide-react";

const TYPE_CONFIG: Record<
  string,
  { label: string; className: string; icon: LucideIcon }
> = {
  NOTE: { label: "Note", className: "category-chip-note", icon: FileText },
  SNIPPET: { label: "Snippet", className: "category-chip-code", icon: Code },
  COMMAND: { label: "Command", className: "category-chip-code", icon: Code },
  BOOKMARK: { label: "Saved Link", className: "category-chip-link", icon: Link },
  FILE: { label: "File", className: "category-chip-file", icon: Paperclip },
  PROMPT: { label: "Prompt", className: "category-chip-prompt", icon: Sparkles },
};

type CategoryChipProps = {
  type: ItemType | string;
  showIcon?: boolean;
  className?: string;
};

export function CategoryChip({
  type,
  showIcon = true,
  className = "",
}: CategoryChipProps) {
  const config = TYPE_CONFIG[type] ?? {
    label: type,
    className: "category-chip-default",
    icon: File,
  };
  const Icon = config.icon;

  return (
    <span
      className={`category-chip ${config.className} ${className}`.trim()}
      aria-label={`Type: ${config.label}`}
    >
      {showIcon ? (
        <Icon size={12} strokeWidth={1.75} aria-hidden="true" />
      ) : null}
      {config.label}
    </span>
  );
}
