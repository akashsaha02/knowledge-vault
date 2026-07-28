"use server";

import { revalidatePath } from "next/cache";
import {
  createCollectionForUser,
  deleteCollectionForUser,
  getCollectionForUser,
  listCollections,
  updateCollectionForUser,
} from "@/features/collections/collection.service";
import { requireUser } from "@/lib/session";

export async function listCollectionsAction(workspaceId: string) {
  const user = await requireUser();
  return listCollections(user.id, workspaceId);
}

export async function getCollectionAction(
  workspaceId: string,
  collectionId: string,
) {
  const user = await requireUser();
  return getCollectionForUser(user.id, workspaceId, collectionId);
}

export async function createCollectionAction(
  workspaceId: string,
  name: string,
  description?: string,
) {
  const user = await requireUser();
  const collection = await createCollectionForUser(
    user.id,
    workspaceId,
    name,
    description,
  );
  revalidatePath("/dashboard/collections");
  return collection;
}

export async function updateCollectionAction(
  workspaceId: string,
  collectionId: string,
  data: { name?: string; description?: string },
) {
  const user = await requireUser();
  const collection = await updateCollectionForUser(
    user.id,
    workspaceId,
    collectionId,
    data,
  );
  revalidatePath("/dashboard/collections");
  return collection;
}

export async function deleteCollectionAction(
  workspaceId: string,
  collectionId: string,
) {
  const user = await requireUser();
  await deleteCollectionForUser(user.id, workspaceId, collectionId);
  revalidatePath("/dashboard/collections");
}
