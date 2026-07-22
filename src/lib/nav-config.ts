import type { ItemType } from "@/generated/prisma/client";

export type NavItem = {
  key: string;
  label: string;
};

export const MAIN_NAV: NavItem[] = [
  { key: "/dashboard", label: "Home" },
  { key: "/dashboard/inbox", label: "Inbox" },
  { key: "/dashboard/search", label: "Search" },
];

export const LIBRARY_NAV: NavItem[] = [
  { key: "/dashboard/notes", label: "Notes" },
  { key: "/dashboard/snippets", label: "Snippets" },
  { key: "/dashboard/commands", label: "Commands" },
  { key: "/dashboard/bookmarks", label: "Bookmarks" },
  { key: "/dashboard/prompts", label: "Prompts" },
  { key: "/dashboard/files", label: "Files" },
];

export const ORGANIZE_NAV: NavItem[] = [
  { key: "/dashboard/projects", label: "Projects" },
  { key: "/dashboard/collections", label: "Collections" },
  { key: "/dashboard/tags", label: "Tags" },
  { key: "/dashboard/favorites", label: "Favorites" },
];

export const BOTTOM_NAV: NavItem[] = [
  { key: "/dashboard/archive", label: "Archive" },
  { key: "/dashboard/trash", label: "Trash" },
  { key: "/dashboard/settings", label: "Settings" },
];

export const ALL_NAV = [
  ...MAIN_NAV,
  ...LIBRARY_NAV,
  ...ORGANIZE_NAV,
  ...BOTTOM_NAV,
];

export const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  ALL_NAV.map((item) => [item.key, item.label]),
);

export const TYPE_ROUTES: Partial<Record<ItemType, string>> = {
  NOTE: "/dashboard/notes",
  SNIPPET: "/dashboard/snippets",
  COMMAND: "/dashboard/commands",
  BOOKMARK: "/dashboard/bookmarks",
  PROMPT: "/dashboard/prompts",
  FILE: "/dashboard/files",
};

export const CREATE_LINKS = [
  { key: "note", label: "Note", href: "/dashboard/notes?new=1" },
  { key: "snippet", label: "Snippet", href: "/dashboard/snippets?new=1" },
  { key: "command", label: "Command", href: "/dashboard/commands?new=1" },
  { key: "bookmark", label: "Bookmark", href: "/dashboard/bookmarks?new=1" },
  { key: "prompt", label: "Prompt", href: "/dashboard/prompts?new=1" },
] as const;

export function getSelectedNavKey(pathname: string): string {
  if (pathname === "/dashboard") return "/dashboard";

  const match = ALL_NAV.filter((item) => item.key !== "/dashboard").find(
    (item) => pathname === item.key || pathname.startsWith(`${item.key}/`),
  );

  return match?.key ?? "/dashboard";
}

export function getBreadcrumbSegments(pathname: string): { href: string; label: string }[] {
  const segments: { href: string; label: string }[] = [
    { href: "/dashboard", label: "Home" },
  ];

  const match = ALL_NAV.find(
    (item) => item.key !== "/dashboard" && pathname.startsWith(item.key),
  );

  if (match) {
    segments.push({ href: match.key, label: match.label });
  }

  return segments;
}
