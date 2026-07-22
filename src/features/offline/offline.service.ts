import "server-only";

import { db } from "@/lib/db";

export async function saveOfflineDraft(data: {
  userId: string;
  workspaceId: string;
  itemId?: string;
  draftKey: string;
  content?: unknown;
  plainText?: string;
}) {
  return db.offlineDraft.upsert({
    where: {
      userId_draftKey: { userId: data.userId, draftKey: data.draftKey },
    },
    create: {
      userId: data.userId,
      workspaceId: data.workspaceId,
      itemId: data.itemId,
      draftKey: data.draftKey,
      content: data.content ?? undefined,
      plainText: data.plainText ?? "",
    },
    update: {
      content: data.content ?? undefined,
      plainText: data.plainText ?? "",
      itemId: data.itemId,
    },
  });
}

export async function getOfflineDraft(userId: string, draftKey: string) {
  return db.offlineDraft.findUnique({
    where: { userId_draftKey: { userId, draftKey } },
  });
}

export async function deleteOfflineDraft(userId: string, draftKey: string) {
  return db.offlineDraft.delete({
    where: { userId_draftKey: { userId, draftKey } },
  });
}
