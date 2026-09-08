"use client";

import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageShell } from "@/components/dashboard/page-shell";
import { PageHint } from "@/components/onboarding/page-hint";
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
import { getItemHref } from "@/lib/nav-config";
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
  BOOKMARK: "Saved Links",
  PROMPT: "Prompts",
  FILE: "Files",
};

const QUICK_FILTERS: { id: string; label: string; type?: ItemType }[] = [
  { id: "all", label: "All" },
  { id: "NOTE", label: "Notes", type: "NOTE" },
  { id: "SNIPPET", label: "Code", type: "SNIPPET" },
  { id: "BOOKMARK", label: "Links", type: "BOOKMARK" },
];

const ALL_PROJECTS = "__all_projects__";
const ALL_TAGS = "__all_tags__";

type SearchPageClientProps = {
  workspaceId: string;
  projects: Array<{ id: string; name: string }>;
  tags: Array<{ id: string; name: string }>;
};

export function SearchPageClient({
  workspaceId,
  projects,
  tags,
}: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialQuery = searchParams.get("q") ?? "";
  const initialTagId = searchParams.get("tag") ?? undefined;
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<ItemType | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [tagId, setTagId] = useState<string | undefined>(initialTagId);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(
    async (
      value: string,
      typeFilter = type,
      projectFilter = projectId,
      tagFilter = tagId,
    ) => {
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
          {
            workspaceId,
            query: trimmed,
            type: typeFilter,
            projectId: projectFilter,
            tagId: tagFilter,
            limit: 50,
          },
          true,
        );
        setResults(data as SearchResult[]);
        addRecentSearch(trimmed);
        completeChecklistTask("search");
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, type, projectId, tagId],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length >= 2) {
        void runSearch(query);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  const grouped = useMemo(() => groupByType(results), [results]);
  const activeChip = type ?? "all";

  return (
    <PageShell
      title="Search"
      description="Search across everything in your Nook."
    >
      <PageHint id="search">
        Search across everything in your Nook.
      </PageHint>
      <div className="search-bar">
        <div className="relative flex flex-1 items-center">
          <Input
            ref={inputRef}
            className="pr-20 h-11 text-base"
            placeholder="Search Nook..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runSearch(query);
            }}
            aria-label="Search Nook"
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
      </div>

      <div className="search-type-chips" role="group" aria-label="Filter by type">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`search-type-chip${activeChip === filter.id ? " search-type-chip--active" : ""}`}
            aria-pressed={activeChip === filter.id}
            onClick={() => {
              const nextType = filter.type;
              setType(nextType);
              if (query.trim()) void runSearch(query, nextType, projectId, tagId);
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {projects.length > 0 || tags.length > 0 ? (
        <details className="search-filters-more">
          <summary className="search-filters-more-summary">More filters</summary>
          <div className="search-filters-more-body">
            {projects.length > 0 ? (
              <Select
                value={projectId ?? ALL_PROJECTS}
                onValueChange={(value) => {
                  const next = value === ALL_PROJECTS ? undefined : value;
                  setProjectId(next);
                  if (query.trim()) void runSearch(query, type, next, tagId);
                }}
              >
                <SelectTrigger className="min-w-[160px]" aria-label="Filter by project">
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROJECTS}>All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {tags.length > 0 ? (
              <Select
                value={tagId ?? ALL_TAGS}
                onValueChange={(value) => {
                  const next = value === ALL_TAGS ? undefined : value;
                  setTagId(next);
                  if (query.trim()) void runSearch(query, type, projectId, next);
                }}
              >
                <SelectTrigger className="min-w-[160px]" aria-label="Filter by tag">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_TAGS}>All tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </details>
      ) : null}

      {loading ? (
        <div className="search-loading">
          <LoadingSpinner size={16} />
          <span>Searching...</span>
        </div>
      ) : !hasSearched ? (
        <EmptyState
          title="Search your Nook"
          description="Type to search notes, code, and saved links."
          shortcut="Ctrl+K"
        />
      ) : results.length === 0 ? (
        <EmptyState
          title={query ? `No results for "${query}"` : "No results"}
          description="Try different words, or clear filters."
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
                const href = getItemHref(item.type, item.id);

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
