"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-skeleton";
import { CategoryChip } from "@/components/ui/category-chip";
import { searchAction } from "@/features/search/search.actions";
import type { ItemType } from "@/generated/prisma/client";
import { CREATE_LINKS, getItemHref } from "@/lib/nav-config";
import { navIcon } from "@/lib/nav-icons";
import {
  addRecentSearch,
  getRecentItems,
  getRecentSearches,
  type RecentItem,
} from "@/lib/recent-storage";
import { useUiStore } from "@/stores/ui-store";

const NAV_COMMANDS = [
  { id: "notes", label: "Open notes", href: "/dashboard/notes" },
  { id: "code", label: "Open code", href: "/dashboard/snippets" },
  { id: "bookmarks", label: "Open saved links", href: "/dashboard/bookmarks" },
  { id: "search-page", label: "Go to search page", href: "/dashboard/search" },
  { id: "files", label: "Open files", href: "/dashboard/files" },
  { id: "favorites", label: "Open favorites", href: "/dashboard/favorites" },
  { id: "projects", label: "Open projects", href: "/dashboard/projects" },
  { id: "trash", label: "Open trash", href: "/dashboard/trash" },
  { id: "settings", label: "Open settings", href: "/dashboard/settings" },
] as const;

type SearchHit = {
  id: string;
  title: string;
  type: ItemType;
  plainText?: string;
  plain_text?: string;
};

type CommandPaletteProps = {
  workspaceId: string;
};

export function CommandPalette({ workspaceId }: CommandPaletteProps) {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchHit[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setResults([]);
      router.push(href);
    },
    [router, setOpen],
  );

  const runSearch = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (trimmed.length < 2) {
        setResults([]);
        return;
      }

      setSearching(true);
      try {
        const data = await searchAction(
          { workspaceId, query: trimmed, limit: 8 },
          true,
        );
        setResults(data as SearchHit[]);
        addRecentSearch(trimmed);
        setRecentSearches(getRecentSearches());
      } finally {
        setSearching(false);
      }
    },
    [workspaceId],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    setRecentItems(getRecentItems());
    setRecentSearches(getRecentSearches());
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n" && !e.shiftKey) {
        e.preventDefault();
        navigate("/dashboard/notes?new=1");
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        navigate("/dashboard/snippets?new=1");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, open, setOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runSearch(query);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  const showSearchResults = query.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="command-palette-modal max-w-[560px] p-0 gap-0 [&>button]:hidden"
        aria-label="Command palette"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command label="Command palette" className="w-full" shouldFilter={!showSearchResults}>
          <div className="p-3 pb-0">
            <Command.Input
              placeholder="Search vault or type a command..."
              value={query}
              onValueChange={setQuery}
            />
          </div>
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            {searching ? (
              <div className="command-palette-loading">
                <LoadingSpinner size={14} /> Searching...
              </div>
            ) : null}

            {showSearchResults ? (
              <Command.Group heading="Results">
                {results.length === 0 && !searching ? (
                  <Command.Empty>No results found.</Command.Empty>
                ) : null}
                {results.map((item) => {
                  const href = getItemHref(item.type, item.id);
                  const preview =
                    item.plainText ?? item.plain_text ?? "No preview";
                  return (
                    <Command.Item
                      key={item.id}
                      value={`${item.title} ${preview}`}
                      onSelect={() => navigate(href)}
                    >
                      <span className="command-palette-item-title flex-1">{item.title}</span>
                      <CategoryChip type={item.type} showIcon={false} />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ) : (
              <>
                <Command.Group heading="Create">
                  {CREATE_LINKS.map((cmd) => (
                    <Command.Item
                      key={cmd.key}
                      onSelect={() => navigate(cmd.href)}
                    >
                      {navIcon(cmd.href.split("?")[0])}
                      <span className="command-palette-item-title">Create {cmd.label.toLowerCase()}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Navigate">
                  {NAV_COMMANDS.map((cmd) => (
                    <Command.Item
                      key={cmd.id}
                      onSelect={() => navigate(cmd.href)}
                    >
                      {navIcon(cmd.href)}
                      <span className="command-palette-item-title">{cmd.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {recentItems.length > 0 ? (
                  <Command.Group heading="Recent">
                    {recentItems.map((item) => (
                      <Command.Item
                        key={item.id}
                        onSelect={() => navigate(item.href)}
                      >
                        <span className="command-palette-item-title flex-1">{item.title}</span>
                        <CategoryChip type={item.type} showIcon={false} />
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : null}

                {recentSearches.length > 0 ? (
                  <Command.Group heading="Recent searches">
                    {recentSearches.map((search) => (
                      <Command.Item
                        key={search}
                        onSelect={() => setQuery(search)}
                      >
                        {search}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : null}
              </>
            )}
          </Command.List>
          <div className="command-palette-footer">
            <span><kbd>⌘K</kbd> Toggle</span>
            <span><kbd>⌘N</kbd> New note</span>
            <span><kbd>⌘⇧N</kbd> New snippet</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
