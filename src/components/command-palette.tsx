"use client";

import { Command } from "cmdk";
import { Modal, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { searchAction } from "@/features/search/search.actions";
import type { ItemType } from "@/generated/prisma/client";
import { CREATE_LINKS, TYPE_ROUTES } from "@/lib/nav-config";
import {
  addRecentSearch,
  getRecentItems,
  getRecentSearches,
  type RecentItem,
} from "@/lib/recent-storage";
import { useUiStore } from "@/stores/ui-store";

const NAV_COMMANDS = [
  { id: "search-page", label: "Go to search page", href: "/dashboard/search" },
  { id: "projects", label: "Open projects", href: "/dashboard/projects" },
  { id: "inbox", label: "Open inbox", href: "/dashboard/inbox" },
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
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      title={null}
      closable={false}
      width={560}
      className="command-palette-modal"
      aria-label="Command palette"
    >
      <Command label="Command palette" className="w-full" shouldFilter={!showSearchResults}>
        <Command.Input
          placeholder="Search vault or type a command..."
          value={query}
          onValueChange={setQuery}
        />
        <Command.List>
          {searching ? (
            <div className="command-palette-loading">
              <Spin size="small" /> Searching...
            </div>
          ) : null}

          {showSearchResults ? (
            <Command.Group heading="Results">
              {results.length === 0 && !searching ? (
                <Command.Empty>No results found.</Command.Empty>
              ) : null}
              {results.map((item) => {
                const href = `${TYPE_ROUTES[item.type] ?? "/dashboard"}?item=${item.id}`;
                const preview =
                  item.plainText ?? item.plain_text ?? "No preview";
                return (
                  <Command.Item
                    key={item.id}
                    value={`${item.title} ${preview}`}
                    onSelect={() => navigate(href)}
                  >
                    <span className="command-palette-item-title">{item.title}</span>
                    <span className="command-palette-item-meta">{item.type}</span>
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
                    Create {cmd.label.toLowerCase()}
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Navigate">
                {NAV_COMMANDS.map((cmd) => (
                  <Command.Item
                    key={cmd.id}
                    onSelect={() => navigate(cmd.href)}
                  >
                    {cmd.label}
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
                      {item.title}
                      <span className="command-palette-item-meta">{item.type}</span>
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

              <Command.Empty>No matching commands.</Command.Empty>
            </>
          )}
        </Command.List>
      </Command>
    </Modal>
  );
}
