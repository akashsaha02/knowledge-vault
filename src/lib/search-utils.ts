export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
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
