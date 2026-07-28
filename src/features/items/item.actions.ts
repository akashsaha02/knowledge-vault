"use server";

import { revalidatePath } from "next/cache";
import {
  archiveItem,
  createItemForUser,
  getAccessibleItem,
  getItemRevisions,
  listAccessibleItems,
  permanentlyDeleteItem,
  restoreItem,
  trashItem,
  updateItemForUser,
} from "@/features/items/item.service";
import {
  createItemSchema,
  searchItemsSchema,
  updateItemSchema,
} from "@/features/items/item.schema";
import type { ItemType } from "@/generated/prisma/client";
import { requireUser } from "@/lib/session";
import type { ItemListFilters } from "@/features/items/item.types";

const TYPE_PATHS: Partial<Record<ItemType, string>> = {
  NOTE: "/dashboard/notes",
  SNIPPET: "/dashboard/snippets",
  COMMAND: "/dashboard/snippets",
  BOOKMARK: "/dashboard/bookmarks",
  PROMPT: "/dashboard/prompts",
  FILE: "/dashboard/files",
};

function revalidateItemPaths(type?: ItemType) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/trash");
  revalidatePath("/dashboard/archive");
  if (type && TYPE_PATHS[type]) {
    revalidatePath(TYPE_PATHS[type]!);
  }
}

export async function listItemsAction(filters: ItemListFilters) {
  const user = await requireUser();
  return listAccessibleItems(user.id, filters);
}

export async function getItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  return getAccessibleItem(user.id, workspaceId, itemId);
}

export async function createItemAction(input: unknown) {
  const user = await requireUser();
  const parsed = createItemSchema.parse(input);
  const item = await createItemForUser(user.id, parsed);
  revalidateItemPaths(parsed.type);
  return item;
}

export async function updateItemAction(input: unknown) {
  const user = await requireUser();
  const parsed = updateItemSchema.parse(input);
  const item = await updateItemForUser(user.id, parsed);
  revalidateItemPaths(item.type);
  return item;
}

export async function archiveItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await archiveItem(user.id, workspaceId, itemId);
  revalidateItemPaths(item.type);
  return item;
}

export async function restoreItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const item = await restoreItem(user.id, workspaceId, itemId);
  revalidateItemPaths(item.type);
  return item;
}

export async function trashItemAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  const existing = await getAccessibleItem(user.id, workspaceId, itemId);
  const item = await trashItem(user.id, workspaceId, itemId);
  revalidateItemPaths(existing.type);
  return item;
}

export async function permanentlyDeleteItemAction(
  workspaceId: string,
  itemId: string,
) {
  const user = await requireUser();
  const existing = await getAccessibleItem(user.id, workspaceId, itemId, {
    includeTrashed: true,
  });
  await permanentlyDeleteItem(user.id, workspaceId, itemId);
  revalidateItemPaths(existing.type);
  return { deleted: true };
}

export async function getRevisionsAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  return getItemRevisions(user.id, workspaceId, itemId);
}

export async function searchItemsAction(input: unknown) {
  const user = await requireUser();
  const parsed = searchItemsSchema.parse(input);
  return listAccessibleItems(user.id, parsed);
}
