import "server-only";

import {
  createCollection,
  deleteCollection,
  findCollectionById,
  findCollections,
  slugExists,
} from "@/features/collections/collection.repository";
import { requireCollectionInWorkspace } from "@/features/workspaces/workspace-resources";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";
import { slugify, uniqueSlug } from "@/lib/slug";

export async function listCollections(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  return findCollections(workspaceId);
}

export async function getCollectionForUser(
  userId: string,
  workspaceId: string,
  collectionId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  await requireCollectionInWorkspace(workspaceId, collectionId);
  return findCollectionById(collectionId);
}

export async function createCollectionForUser(
  userId: string,
  workspaceId: string,
  name: string,
  description?: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "create");
  let slug = slugify(name);
  let counter = 1;
  while (await slugExists(workspaceId, slug)) {
    slug = uniqueSlug(name, String(counter++));
  }

  return createCollection({
    name,
    slug,
    description,
    workspace: { connect: { id: workspaceId } },
  });
}

export async function deleteCollectionForUser(
  userId: string,
  workspaceId: string,
  collectionId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  await requireCollectionInWorkspace(workspaceId, collectionId);
  return deleteCollection(collectionId);
}
