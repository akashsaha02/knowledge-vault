import type { ItemType } from "@/generated/prisma/client";
import {
  getCreateMenuItems,
  TYPE_ROUTES,
} from "@/features/items/item-type-registry";

export type NavItem = {
  key: string;
  label: string;
};

export type NavGroup = {
  id: string;
  label?: string;
  items: NavItem[];
};

/** Primary navigation, grouped for hierarchy without extra destinations. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "home",
    items: [{ key: "/dashboard", label: "Home" }],
  },
  {
    id: "library",
    label: "Library",
    items: [
      { key: "/dashboard/notes", label: "Notes" },
      { key: "/dashboard/snippets", label: "Code" },
      { key: "/dashboard/bookmarks", label: "Saved Links" },
    ],
  },
  {
    id: "organize",
    label: "Organize",
    items: [{ key: "/dashboard/projects", label: "Projects" }],
  },
];

/** Primary navigation */
export const MAIN_NAV: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

/** Quick-access items shown as icons when sidebar is collapsed */
export const COLLAPSED_MORE_NAV: NavItem[] = [
  { key: "/dashboard/files", label: "Files" },
  { key: "/dashboard/trash", label: "Trash" },
];

/** Secondary navigation — "More" section */
export const MORE_NAV: NavItem[] = [
  { key: "/dashboard/prompts", label: "AI Prompts" },
  { key: "/dashboard/files", label: "Files" },
  { key: "/dashboard/collections", label: "Collections" },
  { key: "/dashboard/tags", label: "Tags" },
  { key: "/dashboard/favorites", label: "Favorites" },
  { key: "/dashboard/archive", label: "Archive" },
  { key: "/dashboard/trash", label: "Trash" },
  { key: "/dashboard/search", label: "Search" },
];

export const ALL_NAV = [...MAIN_NAV, ...MORE_NAV];

export const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  ALL_NAV.map((item) => [item.key, item.label]),
);

export { TYPE_ROUTES };

export const CODE_ITEM_TYPES: ItemType[] = ["SNIPPET", "COMMAND"];

export const CREATE_LINKS = getCreateMenuItems();

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
