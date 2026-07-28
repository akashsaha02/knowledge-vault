import { notFound } from "next/navigation";
import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";
import { getCollectionForUser } from "@/features/collections/collection.service";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) notFound();

  const collection = await getCollectionForUser(
    user.id,
    workspaceId,
    collectionId,
  );
  if (!collection) notFound();

  return (
    <DashboardItemPage
      title={collection.name}
      description={
        collection.description ??
        "All items curated in this collection."
      }
      emptyDescription="No items in this collection yet. Assign items from their details panel."
      collectionId={collection.id}
    />
  );
}
