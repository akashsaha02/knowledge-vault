import "server-only";

import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import {
  AuthorizationError,
  requireWorkspacePermission,
} from "@/features/workspaces/workspace.service";

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

  const link = await db.shareLink.findFirst({
    where: { id: shareLinkId, workspaceId },
  });

  if (!link) {
    throw new AuthorizationError("Share link not found");
  }

  return db.shareLink.update({
    where: { id: link.id },
    data: { revokedAt: new Date() },
  });
}

export async function getShareLinkByToken(token: string) {
  const link = await db.shareLink.findUnique({ where: { token } });
  if (!link || link.revokedAt) return null;
  if (link.expiresAt && link.expiresAt < new Date()) return null;
  return link;
}

export async function getPublicSharedContent(token: string) {
  const link = await getShareLinkByToken(token);
  if (!link) return null;

  await db.shareLink.update({
    where: { id: link.id },
    data: { viewCount: { increment: 1 } },
  });

  if (!link.itemId) {
    return { link, item: null };
  }

  const item = await db.item.findFirst({
    where: {
      id: link.itemId,
      workspaceId: link.workspaceId,
      deletedAt: null,
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return { link, item };
}
