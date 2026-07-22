import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { ItemWorkspace } from "@/components/items/item-workspace";
import type { ItemStatus, ItemType } from "@/generated/prisma/client";

type DashboardItemPageProps = {
  type?: ItemType;
  status?: ItemStatus;
  title: string;
  emptyDescription: string;
  favoritesOnly?: boolean;
};

export async function DashboardItemPage({
  type,
  status,
  title,
  emptyDescription,
  favoritesOnly,
}: DashboardItemPageProps) {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;

  return (
    <ItemWorkspace
      workspaceId={workspaceId}
      type={type}
      status={status}
      title={title}
      emptyDescription={emptyDescription}
      favoritesOnly={favoritesOnly}
    />
  );
}
