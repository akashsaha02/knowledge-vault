"use server";

import {
  confirmUpload,
  getDownloadUrl,
  getUploadUrl,
  listItemAttachments,
} from "@/features/attachments/attachment.service";
import { requireUser } from "@/lib/session";

export async function getUploadUrlAction(
  workspaceId: string,
  itemId: string,
  fileName: string,
  mimeType: string,
  sizeBytes: number,
) {
  const user = await requireUser();
  return getUploadUrl(
    user.id,
    workspaceId,
    itemId,
    fileName,
    mimeType,
    sizeBytes,
  );
}

export async function confirmUploadAction(
  workspaceId: string,
  itemId: string,
  storageKey: string,
  originalName: string,
  mimeType: string,
  sizeBytes: number,
) {
  const user = await requireUser();
  return confirmUpload(
    user.id,
    workspaceId,
    itemId,
    storageKey,
    originalName,
    mimeType,
    sizeBytes,
  );
}

export async function getDownloadUrlAction(
  workspaceId: string,
  attachmentId: string,
) {
  const user = await requireUser();
  return getDownloadUrl(user.id, workspaceId, attachmentId);
}

export async function listAttachmentsAction(workspaceId: string, itemId: string) {
  const user = await requireUser();
  return listItemAttachments(user.id, workspaceId, itemId);
}
