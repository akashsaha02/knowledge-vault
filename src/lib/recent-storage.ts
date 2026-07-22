const RECENT_ITEMS_KEY = "kv-recent-items";
const RECENT_SEARCHES_KEY = "kv-recent-searches";
const MAX_RECENT_ITEMS = 8;
const MAX_RECENT_SEARCHES = 5;

export type RecentItem = {
  id: string;
  title: string;
  type: string;
  href: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors.
  }
}

export function getRecentItems(): RecentItem[] {
  return readJson<RecentItem[]>(RECENT_ITEMS_KEY, []);
}

export function addRecentItem(item: RecentItem) {
  const items = getRecentItems().filter((entry) => entry.id !== item.id);
  writeJson(RECENT_ITEMS_KEY, [item, ...items].slice(0, MAX_RECENT_ITEMS));
}

export function getRecentSearches(): string[] {
  return readJson<string[]>(RECENT_SEARCHES_KEY, []);
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const searches = getRecentSearches().filter(
    (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
  );
  writeJson(RECENT_SEARCHES_KEY, [trimmed, ...searches].slice(0, MAX_RECENT_SEARCHES));
}
