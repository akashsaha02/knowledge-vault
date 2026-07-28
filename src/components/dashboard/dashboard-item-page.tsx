import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { listAccessibleItems } from "@/features/items/item.service";
import { requireUser } from "@/lib/session";
import { PageShell } from "@/components/dashboard/page-shell";
import { ItemWorkspace } from "@/components/items/item-workspace";
import type { ItemStatus, ItemType } from "@/generated/prisma/client";

type DashboardItemPageProps = {
  type?: ItemType;
  types?: ItemType[];
  status?: ItemStatus;
  title: string;
  description?: string;
  emptyDescription: string;
  favoritesOnly?: boolean;
  projectId?: string;
  collectionId?: string;
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  Notes: "Write and organize your notes with a rich text editor.",
  Code: "Save and reuse code snippets and terminal commands.",
  "Saved Links": "Keep track of useful links and web resources.",
  "AI Prompts": "Manage AI prompts and templates.",
  Files: "Upload and reference file attachments.",
  Favorites: "Quick access to your starred items.",
  Archive: "Items you've archived but haven't deleted.",
  Trash: "Deleted items — restore or permanently remove.",
};

export async function DashboardItemPage({
  type,
  types,
  status,
  title,
  description,
  emptyDescription,
  favoritesOnly,
  projectId,
  collectionId,
}: DashboardItemPageProps) {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  const initialItems = await listAccessibleItems(user.id, {
    workspaceId,
    type,
    types,
    status,
    favoritesOnly,
    projectId,
    collectionId,
    limit: 50,
  });

  const isSplitPage =
    status === "ACTIVE" &&
    !favoritesOnly &&
    ((type && ["NOTE", "SNIPPET", "COMMAND", "PROMPT"].includes(type)) ||
      Boolean(types?.length));

  return (
    <PageShell
      title={isSplitPage ? undefined : title}
      description={
        isSplitPage ? undefined : (description ?? PAGE_DESCRIPTIONS[title])
      }
      fullHeight={isSplitPage}
    >
      <ItemWorkspace
        workspaceId={workspaceId}
        type={type}
        types={types}
        status={status}
        title={title}
        emptyDescription={emptyDescription}
        favoritesOnly={favoritesOnly}
        projectId={projectId}
        collectionId={collectionId}
        initialItems={initialItems}
      />
    </PageShell>
  );
}
