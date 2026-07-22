import "server-only";

import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";

export async function createShareLink(
  userId: string,
  workspaceId: string,
  options: {
    itemId?: string;
    expiresAt?: Date;
    password?: string;
    allowCopy?: boolean;
    allowDownload?: boolean;
  },
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  const token = randomBytes(32).toString("hex");

  return db.shareLink.create({
    data: {
      workspaceId,
      itemId: options.itemId,
      token,
      expiresAt: options.expiresAt,
      password: options.password,
      allowCopy: options.allowCopy ?? false,
      allowDownload: options.allowDownload ?? false,
    },
  });
}

export async function revokeShareLink(
  userId: string,
  workspaceId: string,
  shareLinkId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  return db.shareLink.update({
    where: { id: shareLinkId },
    data: { revokedAt: new Date() },
  });
}

export async function getShareLinkByToken(token: string) {
  const link = await db.shareLink.findUnique({ where: { token } });
  if (!link || link.revokedAt) return null;
  if (link.expiresAt && link.expiresAt < new Date()) return null;
  return link;
}
