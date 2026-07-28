"use client";

import { BookOpen, Code2, Folder, Link as LinkIcon } from "lucide-react";
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

const QUICK_LINKS = [
  { href: "/dashboard/notes?new=1", label: "Note", icon: BookOpen },
  { href: "/dashboard/bookmarks?new=1", label: "Link", icon: LinkIcon },
  { href: "/dashboard/snippets?new=1", label: "Code", icon: Code2 },
  { href: "/dashboard/projects", label: "Project", icon: Folder },
] as const;

function getGreeting(userName: string): string {
  const hour = new Date().getHours();
  const name = userName.split(" ")[0];
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function displayTitle(title: string): string {
  if (!title || title.startsWith("Untitled")) return "Untitled";
  return title;
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

  return (
    <div className="home-dashboard">
      <WelcomeModal />

      <header className="home-hero">
        <div className="home-hero-text">
          <h1 className="home-greeting">{getGreeting(userName)}</h1>
          <p className="home-subline">Capture an idea, link, or snippet — it&apos;s saved instantly.</p>
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

      <section className="home-quick-links" aria-label="Quick create">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="home-quick-link">
              <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </section>

      {items.length === 0 ? (
        <EmptyState
          className="home-empty-state"
          title="Your nook is empty"
          description="Start with a note, saved link, or code snippet. Everything you create shows up here."
          primaryAction={{
            label: "Write a note",
            href: "/dashboard/notes?new=1",
          }}
          secondaryAction={{
            label: "Save a link",
            href: "/dashboard/bookmarks?new=1",
          }}
        />
      ) : (
        <section className="home-recents">
          <div className="home-recents-header">
            <h2 className="home-recents-title">
              {pinned.length > 0 ? "Pinned & recent" : "Recently saved"}
            </h2>
            <Link href="/dashboard/search" className="home-recents-link">
              Search all
            </Link>
          </div>

          <ul className="home-recent-list">
            {pinned.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="home-recent-row"
                  onClick={() =>
                    router.push(getItemHref(item.type as ItemType, item.id))
                  }
                >
                  <CategoryChip type={item.type} showIcon={false} />
                  <span className="home-recent-title">{displayTitle(item.title)}</span>
                  {item.plainText ? (
                    <span className="home-recent-preview">{item.plainText}</span>
                  ) : null}
                  <span className="home-recent-meta">
                    {item.isPinned ? "Pinned · " : ""}
                    {formatRelativeTime(item.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
            {recents.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="home-recent-row"
                  onClick={() =>
                    router.push(getItemHref(item.type as ItemType, item.id))
                  }
                >
                  <CategoryChip type={item.type} showIcon={false} />
                  <span className="home-recent-title">{displayTitle(item.title)}</span>
                  {item.plainText ? (
                    <span className="home-recent-preview">{item.plainText}</span>
                  ) : null}
                  <span className="home-recent-meta">{formatRelativeTime(item.updatedAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
