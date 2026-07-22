import "server-only";

import { db } from "@/lib/db";
import { AuthorizationError } from "@/features/workspaces/workspace.service";

export async function requireProjectInWorkspace(
  workspaceId: string,
  projectId: string,
) {
  const project = await db.project.findFirst({
    where: { id: projectId, workspaceId },
  });
  if (!project) {
    throw new AuthorizationError("Project not found");
  }
  return project;
}

export async function requireCollectionInWorkspace(
  workspaceId: string,
  collectionId: string,
) {
  const collection = await db.collection.findFirst({
    where: { id: collectionId, workspaceId },
  });
  if (!collection) {
    throw new AuthorizationError("Collection not found");
  }
  return collection;
}

export async function requireTagsInWorkspace(
  workspaceId: string,
  tagIds: string[],
) {
  if (tagIds.length === 0) return;

  const count = await db.tag.count({
    where: { workspaceId, id: { in: tagIds } },
  });

  if (count !== tagIds.length) {
    throw new AuthorizationError("One or more tags not found");
  }
}

export async function requireParentItemInWorkspace(
  workspaceId: string,
  parentId: string,
  excludeItemId?: string,
) {
  if (excludeItemId && parentId === excludeItemId) {
    throw new AuthorizationError("Item cannot be its own parent");
  }

  const parent = await db.item.findFirst({
    where: { id: parentId, workspaceId, deletedAt: null },
  });

  if (!parent) {
    throw new AuthorizationError("Parent item not found");
  }

  return parent;
}

export async function validateItemReferences(
  workspaceId: string,
  refs: {
    projectId?: string | null;
    collectionId?: string | null;
    parentId?: string | null;
    tagIds?: string[];
    itemId?: string;
  },
) {
  if (refs.projectId) {
    await requireProjectInWorkspace(workspaceId, refs.projectId);
  }
  if (refs.collectionId) {
    await requireCollectionInWorkspace(workspaceId, refs.collectionId);
  }
  if (refs.parentId) {
    await requireParentItemInWorkspace(workspaceId, refs.parentId, refs.itemId);
  }
  if (refs.tagIds?.length) {
    await requireTagsInWorkspace(workspaceId, refs.tagIds);
  }
}
