import "server-only";

import {
  createItem,
  createRevision,
  findItemById,
  findItems,
  findRevisions,
  slugExists,
  softDeleteItem,
  updateItem,
} from "@/features/items/item.repository";
import type { CreateItemInput, UpdateItemInput } from "@/features/items/item.schema";
import {
  canEditItem,
  requireWorkspaceMember,
  requireWorkspacePermission,
} from "@/features/workspaces/workspace.service";
import { uniqueSlug } from "@/lib/slug";
import type { ItemStatus, ItemType, Prisma } from "@/generated/prisma/client";
import type { ItemListFilters } from "@/features/items/item.types";

async function resolveUniqueSlug(workspaceId: string, title: string) {
  let slug = uniqueSlug(title);
  let counter = 1;
  while (await slugExists(workspaceId, slug)) {
    slug = uniqueSlug(title, String(counter++));
  }
  return slug;
}

export async function listAccessibleItems(
  userId: string,
  filters: ItemListFilters,
) {
  await requireWorkspaceMember(userId, filters.workspaceId);
  return findItems(filters);
}

export async function getAccessibleItem(
  userId: string,
  workspaceId: string,
  itemId: string,
) {
  await requireWorkspaceMember(userId, workspaceId);
  const item = await findItemById(itemId);
  if (!item || item.workspaceId !== workspaceId || item.deletedAt) {
    throw new Error("Item not found");
  }
  return item;
}

export async function createItemForUser(
  userId: string,
  input: CreateItemInput,
) {
  await requireWorkspacePermission(userId, input.workspaceId, "create");
  const slug = await resolveUniqueSlug(input.workspaceId, input.title);

  const item = await createItem({
    title: input.title,
    slug,
    type: input.type,
    plainText: input.plainText ?? "",
    content: (input.content as Prisma.InputJsonValue) ?? undefined,
    metadata: (input.metadata as Prisma.InputJsonValue) ?? undefined,
    visibility: input.visibility,
    workspace: { connect: { id: input.workspaceId } },
    createdBy: { connect: { id: userId } },
    ...(input.projectId && { project: { connect: { id: input.projectId } } }),
    ...(input.collectionId && {
      collection: { connect: { id: input.collectionId } },
    }),
    ...(input.parentId && { parent: { connect: { id: input.parentId } } }),
    ...(input.tagIds?.length && {
      tags: {
        create: input.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    }),
  });

  await createRevision({
    itemId: item.id,
    createdById: userId,
    content: (input.content as object) ?? {},
    plainText: input.plainText ?? "",
    changeSummary: "Initial version",
  });

  return item;
}

export async function updateItemForUser(
  userId: string,
  input: UpdateItemInput,
) {
  const member = await requireWorkspaceMember(userId, input.workspaceId);
  const existing = await getAccessibleItem(userId, input.workspaceId, input.id);

  if (!canEditItem(member.role, userId, existing.createdById)) {
    throw new Error("Insufficient permissions");
  }

  const item = await updateItem(input.id, {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.content !== undefined && {
      content: input.content as Prisma.InputJsonValue,
    }),
    ...(input.plainText !== undefined && { plainText: input.plainText }),
    ...(input.metadata !== undefined && {
      metadata: input.metadata as Prisma.InputJsonValue,
    }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.visibility !== undefined && { visibility: input.visibility }),
    ...(input.isPinned !== undefined && { isPinned: input.isPinned }),
    ...(input.isFavorite !== undefined && { isFavorite: input.isFavorite }),
    ...(input.projectId !== undefined && {
      project: input.projectId
        ? { connect: { id: input.projectId } }
        : { disconnect: true },
    }),
    ...(input.collectionId !== undefined && {
      collection: input.collectionId
        ? { connect: { id: input.collectionId } }
        : { disconnect: true },
    }),
    ...(input.tagIds && {
      tags: {
        deleteMany: {},
        create: input.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
    }),
  });

  if (input.content !== undefined || input.plainText !== undefined) {
    const lastRevision = (await findRevisions(input.id))[0];
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const shouldCreateRevision =
      !lastRevision ||
      lastRevision.createdAt.getTime() < fiveMinutesAgo ||
      lastRevision.plainText !== (input.plainText ?? existing.plainText);

    if (shouldCreateRevision) {
      await createRevision({
        itemId: input.id,
        createdById: userId,
        content: (input.content as object) ?? existing.content ?? {},
        plainText: input.plainText ?? existing.plainText,
        changeSummary: "Auto-saved revision",
      });
    }
  }

  return item;
}

export async function archiveItem(userId: string, workspaceId: string, itemId: string) {
  return updateItemForUser(userId, {
    id: itemId,
    workspaceId,
    status: "ARCHIVED",
  });
}

export async function restoreItem(
  userId: string,
  workspaceId: string,
  itemId: string,
  status: ItemStatus = "ACTIVE",
) {
  return updateItemForUser(userId, { id: itemId, workspaceId, status });
}

export async function trashItem(userId: string, workspaceId: string, itemId: string) {
  const member = await requireWorkspaceMember(userId, workspaceId);
  const existing = await getAccessibleItem(userId, workspaceId, itemId);
  if (!canEditItem(member.role, userId, existing.createdById)) {
    throw new Error("Insufficient permissions");
  }
  return softDeleteItem(itemId);
}

export async function getItemRevisions(
  userId: string,
  workspaceId: string,
  itemId: string,
) {
  await getAccessibleItem(userId, workspaceId, itemId);
  return findRevisions(itemId);
}
