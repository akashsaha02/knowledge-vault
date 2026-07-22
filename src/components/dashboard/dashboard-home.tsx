"use client";

import {
  BookOutlined,
  CodeOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Tag } from "antd";
import Link from "next/link";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";
import { PageShell } from "@/components/dashboard/page-shell";
import { QuickCapture } from "@/components/dashboard/quick-capture";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/format-date";
import { TYPE_ROUTES } from "@/lib/nav-config";

const shortcuts = [
  { href: "/dashboard/notes?new=1", icon: <BookOutlined />, label: "Note" },
  { href: "/dashboard/snippets?new=1", icon: <CodeOutlined />, label: "Snippet" },
  { href: "/dashboard/inbox", icon: <InboxOutlined />, label: "Inbox" },
  { href: "/dashboard/search", icon: <SearchOutlined />, label: "Search" },
];

type DashboardItem = {
  id: string;
  title: string;
  type: string;
  plainText: string | null;
  updatedAt: Date | string;
  isPinned?: boolean;
  isFavorite?: boolean;
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

function NoteCard({ item }: { item: DashboardItem }) {
  const href = `${TYPE_ROUTES[item.type as keyof typeof TYPE_ROUTES] ?? "/dashboard/notes"}?item=${item.id}`;
  const preview = item.plainText?.trim() || "No additional text";

  return (
    <Link href={href} className="keep-note-card">
      {item.isPinned ? <span className="keep-note-card-pin">Pinned</span> : null}
      <h3 className="keep-note-card-title">
        {item.title.startsWith("Untitled") ? "Untitled" : item.title}
      </h3>
      <p className="keep-note-card-preview">{preview}</p>
      <div className="keep-note-card-footer">
        <Tag className="keep-note-card-tag">{item.type}</Tag>
        <span>{formatRelativeTime(item.updatedAt)}</span>
      </div>
    </Link>
  );
}

export function DashboardHome({
  userName,
  workspaceId,
  items,
  stats,
}: DashboardHomeProps) {
  const pinned = items.filter((item) => item.isPinned);
  const others = items.filter((item) => !item.isPinned);
  const isNewUser = items.length === 0;

  return (
    <PageShell
      title={isNewUser ? `Welcome, ${userName}` : `Welcome back, ${userName}`}
      description="Capture ideas quickly, organize by project, and find anything with search."
    >
      <WelcomeModal />
      <OnboardingChecklist
        hasNote={stats.hasNote}
        hasSnippet={stats.hasSnippet}
        hasBookmark={stats.hasBookmark}
        hasProject={stats.hasProject}
        hasTag={stats.hasTag}
      />

      <QuickCapture workspaceId={workspaceId} />

      <div className="home-shortcuts">
        {shortcuts.map((shortcut) => (
          <Link key={shortcut.href} href={shortcut.href} className="home-shortcut">
            {shortcut.icon}
            <span>{shortcut.label}</span>
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your vault is ready"
          description="Capture a quick note above, or pick a template to get started."
          primaryAction={{
            label: "Create your first note",
            href: "/dashboard/notes?new=1",
          }}
          secondaryAction={{
            label: "Browse snippets",
            href: "/dashboard/snippets?new=1",
          }}
        />
      ) : (
        <>
          {pinned.length > 0 ? (
            <section className="home-notes-section">
              <div className="home-section-header">
                <h2>Pinned</h2>
              </div>
              <div className="keep-notes-grid">
                {pinned.map((item) => (
                  <NoteCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="home-notes-section">
            <div className="home-section-header">
              <h2>{pinned.length > 0 ? "Recent" : "Recent items"}</h2>
              <Link href="/dashboard/notes">
                <Button type="link" icon={<PlusOutlined />}>
                  View all
                </Button>
              </Link>
            </div>
            <div className="keep-notes-grid">
              {(pinned.length > 0 ? others : items).map((item) => (
                <NoteCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      )}
    </PageShell>
  );
}
