import type { ItemType } from "@/generated/prisma/client";

export type NavItem = {
  key: string;
  label: string;
};

/** Primary navigation */
export const MAIN_NAV: NavItem[] = [
  { key: "/dashboard", label: "Home" },
  { key: "/dashboard/notes", label: "Notes" },
  { key: "/dashboard/snippets", label: "Code" },
  { key: "/dashboard/bookmarks", label: "Saved Links" },
  { key: "/dashboard/projects", label: "Projects" },
];

/** Quick-access items shown as icons when sidebar is collapsed */
export const COLLAPSED_MORE_NAV: NavItem[] = [
  { key: "/dashboard/files", label: "Files" },
  { key: "/dashboard/trash", label: "Trash" },
];

/** Secondary navigation — "More" section */
export const MORE_NAV: NavItem[] = [
  { key: "/dashboard/search", label: "Search" },
  { key: "/dashboard/files", label: "Files" },
  { key: "/dashboard/favorites", label: "Favorites" },
  { key: "/dashboard/prompts", label: "AI Prompts" },
  { key: "/dashboard/collections", label: "Collections" },
  { key: "/dashboard/tags", label: "Tags" },
  { key: "/dashboard/archive", label: "Archive" },
  { key: "/dashboard/trash", label: "Trash" },
];

export const BOTTOM_NAV: NavItem[] = [];

export const ALL_NAV = [...MAIN_NAV, ...MORE_NAV, ...BOTTOM_NAV];

export const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  ALL_NAV.map((item) => [item.key, item.label]),
);

export const TYPE_ROUTES: Partial<Record<ItemType, string>> = {
  NOTE: "/dashboard/notes",
  SNIPPET: "/dashboard/snippets",
  COMMAND: "/dashboard/snippets?tab=commands",
  BOOKMARK: "/dashboard/bookmarks",
  PROMPT: "/dashboard/prompts",
  FILE: "/dashboard/files",
};

export const CODE_ITEM_TYPES: ItemType[] = ["SNIPPET", "COMMAND"];

export const CREATE_LINKS = [
  { key: "note", label: "Note", description: "Write something down", href: "/dashboard/notes?new=1" },
  { key: "bookmark", label: "Saved Link", description: "Save a useful website", href: "/dashboard/bookmarks?new=1" },
  { key: "snippet", label: "Code snippet", description: "Save a piece of code", href: "/dashboard/snippets?new=1" },
  { key: "command", label: "Terminal command", description: "Save a shell command", href: "/dashboard/snippets?tab=commands&new=1" },
  { key: "file", label: "File", description: "Upload a file", href: "/dashboard/files?new=1" },
] as const;

export function getItemHref(type: ItemType, itemId: string): string {
  const base = TYPE_ROUTES[type] ?? "/dashboard/notes";
  const [path, query] = base.split("?");
  const params = new URLSearchParams(query ?? "");
  params.set("item", itemId);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export function getSelectedNavKey(pathname: string): string {
  if (pathname === "/dashboard") return "/dashboard";

  const match = ALL_NAV.filter((item) => item.key !== "/dashboard").find(
    (item) => pathname === item.key || pathname.startsWith(`${item.key}/`),
  );

  if (match) return match.key;

  // Legacy routes map to new nav
  if (pathname.startsWith("/dashboard/commands")) return "/dashboard/snippets";
  if (pathname.startsWith("/dashboard/inbox")) return "/dashboard/notes";

  return "/dashboard";
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
