function readStorage(keys: string[]): string | null {
  if (typeof window === "undefined") return null;
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value != null) return value;
  }
  return null;
}

const RECENT_ITEMS_KEY = "nook-recent-items";
const RECENT_ITEMS_KEY_LEGACY = "kv-recent-items";
const RECENT_SEARCHES_KEY = "nook-recent-searches";
const RECENT_SEARCHES_KEY_LEGACY = "kv-recent-searches";
const MAX_RECENT_ITEMS = 8;
const MAX_RECENT_SEARCHES = 5;

export type RecentItem = {
  id: string;
  title: string;
  type: string;
  href: string;
};

function readJson<T>(keys: string[], fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = readStorage(keys);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(primary: string, value: T, legacy?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(primary, JSON.stringify(value));
    if (legacy) localStorage.removeItem(legacy);
  } catch {
    // Ignore quota errors.
  }
}

export function getRecentItems(): RecentItem[] {
  return readJson<RecentItem[]>([RECENT_ITEMS_KEY, RECENT_ITEMS_KEY_LEGACY], []);
}

export function addRecentItem(item: RecentItem) {
  const items = getRecentItems().filter((entry) => entry.id !== item.id);
  writeJson(RECENT_ITEMS_KEY, [item, ...items].slice(0, MAX_RECENT_ITEMS), RECENT_ITEMS_KEY_LEGACY);
}

export function getRecentSearches(): string[] {
  return readJson<string[]>([RECENT_SEARCHES_KEY, RECENT_SEARCHES_KEY_LEGACY], []);
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const searches = getRecentSearches().filter(
    (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
  );
  writeJson(
    RECENT_SEARCHES_KEY,
    [trimmed, ...searches].slice(0, MAX_RECENT_SEARCHES),
    RECENT_SEARCHES_KEY_LEGACY,
  );
}
