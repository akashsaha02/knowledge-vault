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
  Notes: "Capture something you don't want to lose.",
  Code: "Save snippets and terminal commands you want to reuse.",
  "Saved Links": "Save pages you want to find again.",
  "AI Prompts": "Keep reusable prompts with {{variables}} you can copy.",
  Files: "Upload a file and keep it with the rest of your Nook.",
  Favorites: "Things you marked as important.",
  Archive: "Removed from your active workspace without deleting.",
  Trash: "Items waiting to be restored or deleted permanently.",
};

export async function DashboardItemPage({
  type,
  types,
  status = "ACTIVE",
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
