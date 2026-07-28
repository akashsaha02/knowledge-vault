"use client";

import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentFade } from "@/components/ui/content-fade";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-skeleton";
import { searchAction } from "@/features/search/search.actions";
import type { ItemType } from "@/generated/prisma/client";
import { TYPE_ROUTES } from "@/lib/nav-config";
import { completeChecklistTask } from "@/lib/onboarding-storage";
import { addRecentSearch } from "@/lib/recent-storage";
import { groupByType, highlightMatch } from "@/lib/search-utils";

type SearchResult = {
  id: string;
  title: string;
  type: ItemType;
  plainText?: string;
  plain_text?: string;
};

const typeLabels: Record<string, string> = {
  NOTE: "Notes",
  SNIPPET: "Snippets",
  COMMAND: "Commands",
  BOOKMARK: "Bookmarks",
  PROMPT: "Prompts",
  FILE: "Files",
};

const ALL_TYPES = "__all__";

export function SearchPageClient({ workspaceId }: { workspaceId: string }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<ItemType | undefined>();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(
    async (value: string, typeFilter = type) => {
      const trimmed = value.trim();
      if (!trimmed) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      try {
        const data = await searchAction(
          { workspaceId, query: trimmed, type: typeFilter, limit: 50 },
          true,
        );
        setResults(data as SearchResult[]);
        addRecentSearch(trimmed);
        completeChecklistTask("search");
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, type],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length >= 2) {
        void runSearch(query);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  const grouped = useMemo(() => groupByType(results), [results]);

  return (
    <PageShell
      title="Search"
      description="Find notes, snippets, and more across your vault."
    >
      <div className="search-bar">
        <div className="relative flex flex-1 items-center">
          <Input
            className="pr-20"
            placeholder="Search your vault..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runSearch(query);
            }}
            aria-label="Search your vault"
          />
          {query ? (
            <button
              type="button"
              className="absolute right-[5.5rem] text-[var(--muted)] hover:text-[var(--foreground)]"
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <Button
            className="absolute right-1"
            size="sm"
            disabled={loading}
            onClick={() => void runSearch(query)}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </div>
        <Select
          value={type ?? ALL_TYPES}
          onValueChange={(value) => {
            const nextType = value === ALL_TYPES ? undefined : (value as ItemType);
            setType(nextType);
            if (query.trim()) void runSearch(query, nextType);
          }}
        >
          <SelectTrigger className="min-w-[160px]" aria-label="Filter by type">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>All types</SelectItem>
            {Object.entries(typeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="search-loading">
          <LoadingSpinner size={16} />
          <span>Searching...</span>
        </div>
      ) : !hasSearched ? (
        <EmptyState
          title="Search your vault"
          description="Type at least 2 characters to search as you type, or press Enter."
          shortcut="Ctrl+K"
        />
      ) : results.length === 0 ? (
        <EmptyState
          title={query ? `No results for "${query}"` : "No results"}
          description="Try different keywords or remove filters."
          primaryAction={{
            label: "Clear search",
            onClick: () => {
              setQuery("");
              setResults([]);
              setHasSearched(false);
            },
          }}
        />
      ) : (
        <ContentFade>
        <div className="search-results">
          <p className="search-results-count">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
          {Object.entries(grouped).map(([groupType, groupItems]) => (
            <section key={groupType} className="search-results-group">
              <h3 className="search-results-group-title">
                {typeLabels[groupType] ?? groupType}
              </h3>
              {groupItems.map((item) => {
                const preview =
                  item.plainText ?? item.plain_text ?? "No preview available";
                const href = `${TYPE_ROUTES[item.type] ?? "/dashboard"}?item=${item.id}`;

                return (
                  <Link key={item.id} href={href} className="search-result-card">
                    <div className="search-result-card-top">
                      <strong
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.title, query),
                        }}
                      />
                      <span className="search-result-type">
                        {typeLabels[item.type] ?? item.type}
                      </span>
                    </div>
                    <p
                      className="search-result-preview"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(preview.slice(0, 200), query),
                      }}
                    />
                  </Link>
                );
              })}
            </section>
          ))}
        </div>
        </ContentFade>
      )}
    </PageShell>
  );
}
