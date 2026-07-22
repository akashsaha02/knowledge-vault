"use server";

import { askVault, suggestTagsFromContent } from "@/features/ai/ai.service";
import { requireUser } from "@/lib/session";

export async function askVaultAction(workspaceId: string, question: string) {
  const user = await requireUser();
  return askVault(user.id, workspaceId, question);
}

export async function suggestTagsAction(plainText: string) {
  await requireUser();
  return suggestTagsFromContent(plainText);
}
