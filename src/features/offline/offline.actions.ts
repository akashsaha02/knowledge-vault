"use server";

import {
  deleteOfflineDraft,
  getOfflineDraft,
  saveOfflineDraft,
} from "@/features/offline/offline.service";
import { requireUser } from "@/lib/session";

export async function saveDraftAction(
  workspaceId: string,
  draftKey: string,
  content: unknown,
  plainText: string,
  itemId?: string,
) {
  const user = await requireUser();
  return saveOfflineDraft({
    userId: user.id,
    workspaceId,
    draftKey,
    content,
    plainText,
    itemId,
  });
}

export async function getDraftAction(draftKey: string) {
  const user = await requireUser();
  return getOfflineDraft(user.id, draftKey);
}

export async function deleteDraftAction(draftKey: string) {
  const user = await requireUser();
  return deleteOfflineDraft(user.id, draftKey);
}
