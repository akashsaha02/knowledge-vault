"use server";

import { revalidatePath } from "next/cache";
import { createTagForUser, listTags } from "@/features/tags/tag.service";
import { requireUser } from "@/lib/session";

export async function listTagsAction(workspaceId: string) {
  const user = await requireUser();
  return listTags(user.id, workspaceId);
}

export async function createTagAction(
  workspaceId: string,
  name: string,
  color?: string,
) {
  const user = await requireUser();
  const tag = await createTagForUser(user.id, workspaceId, name, color);
  revalidatePath("/dashboard");
  return tag;
}
