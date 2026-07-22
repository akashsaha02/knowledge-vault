import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { listAccessibleItems } from "@/features/items/item.service";
import { requireUser } from "@/lib/session";
import { PageShell } from "@/components/dashboard/page-shell";
import { ItemWorkspace } from "@/components/items/item-workspace";
import type { ItemStatus, ItemType } from "@/generated/prisma/client";

type DashboardItemPageProps = {
  type?: ItemType;
  status?: ItemStatus;
  title: string;
  description?: string;
  emptyDescription: string;
  favoritesOnly?: boolean;
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  Inbox: "Drafts and unsorted items waiting to be organized.",
  Notes: "Write and organize your notes with a rich text editor.",
  Snippets: "Save and reuse code snippets with syntax highlighting.",
  Commands: "Store shell commands and terminal one-liners.",
  Bookmarks: "Keep track of useful links and web resources.",
  Prompts: "Manage AI prompts and templates.",
  Files: "Upload and reference file attachments.",
  Favorites: "Quick access to your starred items.",
  Archive: "Items you've archived but haven't deleted.",
  Trash: "Deleted items — restore or permanently remove.",
};

export async function DashboardItemPage({
  type,
  status,
  title,
  description,
  emptyDescription,
  favoritesOnly,
}: DashboardItemPageProps) {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  const initialItems = await listAccessibleItems(user.id, {
    workspaceId,
    type,
    status,
    favoritesOnly,
    limit: 50,
  });

  return (
    <PageShell
      title={title}
      description={description ?? PAGE_DESCRIPTIONS[title]}
      fullHeight
    >
      <ItemWorkspace
        workspaceId={workspaceId}
        type={type}
        status={status}
        title={title}
        emptyDescription={emptyDescription}
        favoritesOnly={favoritesOnly}
        initialItems={initialItems}
      />
    </PageShell>
  );
}
