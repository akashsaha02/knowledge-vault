import { escapeHtml } from "@/lib/escape-html";

export function highlightMatch(text: string, query: string): string {
  const escapedText = escapeHtml(text);
  if (!query.trim()) return escapedText;
  const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  return escapedText.replace(regex, "<mark>$1</mark>");
}

export function groupByType<T extends { type: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = item.type;
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});
}
