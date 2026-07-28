import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpen,
  Code,
  Folder,
  Home,
  Link,
  MoreHorizontal,
  Paperclip,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";

const ICON_SIZE = 18;

export const NAV_ICON_MAP: Record<string, LucideIcon> = {
  "/dashboard": Home,
  "/dashboard/notes": BookOpen,
  "/dashboard/projects": Folder,
  "/dashboard/bookmarks": Link,
  "/dashboard/search": Search,
  "/dashboard/snippets": Code,
  "/dashboard/files": Paperclip,
  "/dashboard/favorites": Star,
  "/dashboard/prompts": Sparkles,
  "/dashboard/collections": BookOpen,
  "/dashboard/tags": Tag,
  "/dashboard/archive": Archive,
  "/dashboard/trash": Trash2,
  "/dashboard/settings": Settings,
  more: MoreHorizontal,
};

export function navIcon(key: string): ReactNode {
  const Icon = NAV_ICON_MAP[key] ?? Home;
  return <Icon size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />;
}
