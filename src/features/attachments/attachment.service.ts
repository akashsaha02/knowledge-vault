import "server-only";

import { randomUUID } from "crypto";
import {
  createAttachmentRecord,
  findAttachmentById,
  findAttachments,
  validateFile,
} from "@/features/attachments/attachment.repository";
import { assertValidAttachmentStorageKey } from "@/features/attachments/attachment.utils";
import { getAccessibleItem } from "@/features/items/item.service";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "attachments";

export async function getUploadUrl(
  userId: string,
  workspaceId: string,
  itemId: string,
  fileName: string,
  mimeType: string,
  sizeBytes: number,
) {
  await requireWorkspacePermission(userId, workspaceId, "create");
  await getAccessibleItem(userId, workspaceId, itemId);
  validateFile(mimeType, sizeBytes);

  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const storageKey = `${workspaceId}/${userId}/${itemId}/${randomUUID()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(storageKey);

  if (error || !data) {
    const message = error?.message ?? "Failed to create upload URL";
    if (message.toLowerCase().includes("does not exist")) {
      throw new Error(
        `Storage bucket "${BUCKET}" does not exist. Run: npm run setup:supabase`,
      );
    }
    throw new Error(message);
  }

  return { uploadUrl: data.signedUrl, storageKey, token: data.token };
}

export async function confirmUpload(
  userId: string,
  workspaceId: string,
  itemId: string,
  storageKey: string,
  originalName: string,
  mimeType: string,
  sizeBytes: number,
) {
  await requireWorkspacePermission(userId, workspaceId, "create");
  await getAccessibleItem(userId, workspaceId, itemId);
  validateFile(mimeType, sizeBytes);
  assertValidAttachmentStorageKey(storageKey, workspaceId, userId, itemId);

  return createAttachmentRecord({
    workspaceId,
    itemId,
    uploadedById: userId,
    storageKey,
    originalName,
    mimeType,
    sizeBytes,
  });
}

export async function getDownloadUrl(
  userId: string,
  workspaceId: string,
  attachmentId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "view");

  const record = await findAttachmentById(attachmentId);
  if (!record || record.workspaceId !== workspaceId) {
    throw new Error("Attachment not found");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(record.storageKey, 3600);

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create download URL");
  }

  return { url: data.signedUrl, fileName: record.originalName };
}

export async function listItemAttachments(
  userId: string,
  workspaceId: string,
  itemId: string,
) {
  await getAccessibleItem(userId, workspaceId, itemId);
  return findAttachments(itemId);
}
