"use client";

import { BookOpen, Code2, Folder, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";
import { QuickCapture } from "@/components/dashboard/quick-capture";
import { Illustration } from "@/components/ui/illustration";
import { MetricCard } from "@/components/ui/metric-card";
import { QuickAction } from "@/components/ui/quick-action";
import { UserAvatar } from "@/components/ui/user-avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/format-date";
import { getTimeOfDayGreeting } from "@/lib/greeting";
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
  userImage?: string | null;
  workspaceId: string;
  items: DashboardItem[];
  stats: {
    hasNote: boolean;
    hasSnippet: boolean;
    hasBookmark: boolean;
    hasProject: boolean;
    hasTag: boolean;
    noteCount: number;
    snippetCount: number;
    bookmarkCount: number;
    projectCount: number;
  };
};

function displayTitle(title: string): string {
  if (!title || title.startsWith("Untitled")) return "Untitled";
  return title;
}

function activityVerb(type: string): string {
  if (type === "BOOKMARK") return "saved";
  if (type === "SNIPPET" || type === "COMMAND") return "updated";
  return "edited";
}

function ItemRow({
  item,
  userName,
  userImage,
  onOpen,
}: {
  item: DashboardItem;
  userName: string;
  userImage?: string | null;
  onOpen: () => void;
}) {
  return (
    <li>
      <button type="button" className="home-recent-row" onClick={onOpen}>
        <span className="home-activity-avatar">
          <UserAvatar name={userName} image={userImage} size="sm" />
        </span>
        <span className="home-recent-title">
          You {activityVerb(item.type)} {displayTitle(item.title)}
        </span>
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
  userImage,
  workspaceId,
  items,
  stats,
}: DashboardHomeProps) {
  const router = useRouter();
  const pinned = items.filter((item) => item.isPinned);
  const recents = items.filter((item) => !item.isPinned).slice(0, 8);
  const isNew = items.length === 0 && stats.projectCount === 0;
  const firstName = userName.split(" ")[0];
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
  }, []);

  return (
    <div className="home-dashboard">
      <WelcomeModal />

      <header className="home-hero">
        <div className="home-hero-row">
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
                <h1 className="home-greeting">
                  {greeting}, {firstName}
                </h1>
                <p className="home-subline">Here&apos;s what&apos;s in your Nook today.</p>
              </>
            )}
          </div>
          <div className="home-hero-art">
            <Illustration name={isNew ? "welcome" : "capture"} size="sm" />
          </div>
        </div>
        <QuickCapture workspaceId={workspaceId} />
      </header>

      <section aria-label="Quick actions">
        <div className="quick-action-row">
          <QuickAction
            href="/dashboard/notes?new=1"
            icon={<BookOpen size={16} strokeWidth={1.75} />}
            label="New note"
          />
          <QuickAction
            href="/dashboard/snippets?new=1"
            icon={<Code2 size={16} strokeWidth={1.75} />}
            label="Save code"
          />
          <QuickAction
            href="/dashboard/bookmarks?new=1"
            icon={<LinkIcon size={16} strokeWidth={1.75} />}
            label="Save link"
          />
          <QuickAction
            href="/dashboard/projects"
            icon={<Folder size={16} strokeWidth={1.75} />}
            label="New project"
          />
        </div>
      </section>

      {!isNew ? (
        <section aria-label="Library summary">
          <div className="metric-grid">
            <MetricCard
              href="/dashboard/notes"
              icon={<BookOpen size={16} strokeWidth={1.75} />}
              label="Notes"
              value={stats.noteCount}
              hint={stats.noteCount === 1 ? "Ready to open" : "In your library"}
            />
            <MetricCard
              href="/dashboard/snippets"
              icon={<Code2 size={16} strokeWidth={1.75} />}
              label="Code"
              value={stats.snippetCount}
              hint="Snippets and commands"
            />
            <MetricCard
              href="/dashboard/bookmarks"
              icon={<LinkIcon size={16} strokeWidth={1.75} />}
              label="Saved links"
              value={stats.bookmarkCount}
              hint={stats.bookmarkCount === 0 ? "Save a page you use often" : "Ready to reopen"}
            />
            <MetricCard
              href="/dashboard/projects"
              icon={<Folder size={16} strokeWidth={1.75} />}
              label="Projects"
              value={stats.projectCount}
              hint={stats.projectCount === 0 ? "Group related work" : "Places to keep work together"}
            />
          </div>
        </section>
      ) : null}

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
          illustration="empty"
          title="Start your Nook"
          description="Save your first thought, snippet or useful link. It will show up here."
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
                    userName={userName}
                    userImage={userImage}
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
            ) : recents.length === 0 ? (
              <EmptyState
                size="sm"
                illustration="capture"
                title="Nothing recent yet"
                description="New notes, code, and links will appear here."
              />
            ) : (
              <ul className="home-recent-list">
                {recents.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    userName={userName}
                    userImage={userImage}
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
    </div>
  );
}
