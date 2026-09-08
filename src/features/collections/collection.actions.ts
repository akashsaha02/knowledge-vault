"use server";

import { revalidatePath } from "next/cache";
import {
  createCollectionForUser,
  deleteCollectionForUser,
  listCollections,
} from "@/features/collections/collection.service";
import { requireUser } from "@/lib/session";

export async function listCollectionsAction(workspaceId: string) {
  const user = await requireUser();
  return listCollections(user.id, workspaceId);
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

export async function deleteCollectionAction(
  workspaceId: string,
  collectionId: string,
) {
  const user = await requireUser();
  await deleteCollectionForUser(user.id, workspaceId, collectionId);
  revalidatePath("/dashboard/collections");
}
