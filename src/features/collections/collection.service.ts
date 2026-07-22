import "server-only";

import {
  createCollection,
  deleteCollection,
  findCollections,
  updateCollection,
} from "@/features/collections/collection.repository";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";
import { slugify, uniqueSlug } from "@/lib/slug";
import { db } from "@/lib/db";

export async function listCollections(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  return findCollections(workspaceId);
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
  while (
    await db.collection.findUnique({
      where: { workspaceId_slug: { workspaceId, slug } },
    })
  ) {
    slug = uniqueSlug(name, String(counter++));
  }

  return createCollection({
    name,
    slug,
    description,
    workspace: { connect: { id: workspaceId } },
  });
}

export async function updateCollectionForUser(
  userId: string,
  workspaceId: string,
  collectionId: string,
  data: { name?: string; description?: string },
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  return updateCollection(collectionId, data);
}

export async function deleteCollectionForUser(
  userId: string,
  workspaceId: string,
  collectionId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  return deleteCollection(collectionId);
}
