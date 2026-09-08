"use client";

import { BookOpen, Code2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";
import { QuickCapture } from "@/components/dashboard/quick-capture";
import { CategoryChip } from "@/components/ui/category-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/format-date";
import { getItemHref } from "@/lib/nav-config";
import type { ItemType } from "@/generated/prisma/client";

type DashboardItem = {
  id: string;
  title: string;
  type: string;
  plainText: string | null;
  updatedAt: Date | string;
  isPinned?: boolean;
  projectName?: string | null;
};

type DashboardHomeProps = {
  userName: string;
  workspaceId: string;
  items: DashboardItem[];
  stats: {
    hasNote: boolean;
    hasSnippet: boolean;
    hasBookmark: boolean;
    hasProject: boolean;
    hasTag: boolean;
  };
};

function displayTitle(title: string): string {
  if (!title || title.startsWith("Untitled")) return "Untitled";
  return title;
}

function ItemRow({
  item,
  onOpen,
}: {
  item: DashboardItem;
  onOpen: () => void;
}) {
  return (
    <li>
      <button type="button" className="home-recent-row" onClick={onOpen}>
        <CategoryChip type={item.type} showIcon={false} />
        <span className="home-recent-title">{displayTitle(item.title)}</span>
        {item.plainText ? (
          <span className="home-recent-preview">{item.plainText}</span>
        ) : null}
        <span className="home-recent-meta">
          {item.projectName ? `${item.projectName} · ` : ""}
          {formatRelativeTime(item.updatedAt)}
        </span>
      </button>
    </li>
  );
}

export function DashboardHome({
  userName,
  workspaceId,
  items,
  stats,
}: DashboardHomeProps) {
  const router = useRouter();
  const pinned = items.filter((item) => item.isPinned);
  const recents = items.filter((item) => !item.isPinned).slice(0, 8);
  const isNew = items.length === 0;
  const firstName = userName.split(" ")[0];

  return (
    <div className="home-dashboard">
      <WelcomeModal />

      <header className="home-hero">
        <div className="home-hero-text">
          {isNew ? (
            <>
              <p className="home-welcome-kicker">Welcome to Nook</p>
              <h1 className="home-greeting">Your space for things worth keeping.</h1>
              <p className="home-subline">
                Capture notes, code, links and ideas. Find them when you need them.
              </p>
            </>
          ) : (
            <>
              <h1 className="home-greeting">Welcome back, {firstName}</h1>
              <p className="home-subline">
                Capture something, or continue where you left off.
              </p>
            </>
          )}
        </div>
        <QuickCapture workspaceId={workspaceId} />
      </header>

      <OnboardingChecklist
        hasNote={stats.hasNote}
        hasSnippet={stats.hasSnippet}
        hasBookmark={stats.hasBookmark}
        hasProject={stats.hasProject}
        hasTag={stats.hasTag}
      />

      {isNew ? (
        <EmptyState
          className="home-empty-state"
          title="Start your Nook."
          description="Save your first thought, snippet or useful link."
          primaryAction={{
            label: "New note",
            href: "/dashboard/notes?new=1",
          }}
          secondaryAction={{
            label: "Save link",
            href: "/dashboard/bookmarks?new=1",
          }}
        />
      ) : (
        <>
          {pinned.length > 0 ? (
            <section className="home-section" aria-labelledby="home-pinned">
              <div className="home-recents-header">
                <h2 id="home-pinned" className="home-recents-title">
                  Pinned
                </h2>
              </div>
              <ul className="home-recent-list home-pinned-list">
                {pinned.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onOpen={() =>
                      router.push(getItemHref(item.type as ItemType, item.id))
                    }
                  />
                ))}
              </ul>
            </section>
          ) : null}

          <section className="home-section" aria-labelledby="home-recent">
            <div className="home-recents-header">
              <h2 id="home-recent" className="home-recents-title">
                Continue where you left off
              </h2>
              <Link href="/dashboard/search" className="home-recents-link">
                Search all
              </Link>
            </div>
            {recents.length === 0 && pinned.length > 0 ? (
              <p className="home-subline">Pinned items are above. Capture something new anytime.</p>
            ) : (
              <ul className="home-recent-list">
                {recents.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onOpen={() =>
                      router.push(getItemHref(item.type as ItemType, item.id))
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {isNew ? (
        <div className="home-quick-links" aria-label="More ways to start">
          <Link href="/dashboard/snippets?new=1" className="home-quick-link">
            <Code2 size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>Save code</span>
          </Link>
          <Link href="/dashboard/notes?new=1" className="home-quick-link">
            <BookOpen size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>New note</span>
          </Link>
          <Link href="/dashboard/bookmarks?new=1" className="home-quick-link">
            <LinkIcon size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>Save link</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
