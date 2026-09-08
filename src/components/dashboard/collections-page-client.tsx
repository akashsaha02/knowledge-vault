"use client";

import { ResourceListPage } from "@/components/dashboard/resource-list-page";
import {
  createCollectionAction,
  deleteCollectionAction,
  listCollectionsAction,
} from "@/features/collections/collection.actions";

export function CollectionsPageClient({ workspaceId }: { workspaceId: string }) {
  return (
    <ResourceListPage
      workspaceId={workspaceId}
      title="Collections"
      description="Lightweight groupings across types — reading lists and reference sets. Projects remain the primary way to organize work."
      createLabel="New collection"
      emptyTitle="No collections yet"
      emptyActionLabel="Create collection"
      namePlaceholder="e.g. Reading list, Dev resources"
      descriptionPlaceholder="What belongs in this collection?"
      dialogTitle="Create collection"
      submitLabel="Create collection"
      nameFieldId="collection-name"
      descriptionFieldId="collection-description"
      loadErrorTitle="Could not load collections"
      loadErrorMessage="Could not load collections"
      createdToast="Collection created"
      deletedToast="Collection deleted"
      itemHref={(id) => `/dashboard/collections/${id}`}
      listAction={listCollectionsAction}
      createAction={createCollectionAction}
      deleteAction={deleteCollectionAction}
    />
  );
}
