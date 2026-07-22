"use server";

import {
  exportWorkspaceJson,
  exportWorkspaceZip,
} from "@/features/import-export/export.service";
import { createItemForUser } from "@/features/items/item.service";
import { requireUser } from "@/lib/session";
import type { ItemType } from "@/generated/prisma/client";

export async function exportJsonAction(workspaceId: string) {
  const user = await requireUser();
  return exportWorkspaceJson(user.id, workspaceId);
}

export async function exportZipAction(workspaceId: string) {
  const user = await requireUser();
  return exportWorkspaceZip(user.id, workspaceId);
}

export async function importJsonPreviewAction(workspaceId: string, json: string) {
  const user = await requireUser();
  const parsed = JSON.parse(json) as {
    items?: Array<{ title: string; type: ItemType; plainText?: string }>;
  };
  return {
    count: parsed.items?.length ?? 0,
    items: parsed.items?.slice(0, 10) ?? [],
    userId: user.id,
    workspaceId,
  };
}

export async function importJsonAction(workspaceId: string, json: string) {
  const user = await requireUser();
  const parsed = JSON.parse(json) as {
    items?: Array<{
      title: string;
      type: ItemType;
      plainText?: string;
      content?: unknown;
      metadata?: Record<string, unknown>;
    }>;
  };

  const created = [];
  for (const item of parsed.items ?? []) {
    const result = await createItemForUser(user.id, {
      workspaceId,
      type: item.type,
      title: item.title,
      plainText: item.plainText,
      content: item.content,
      metadata: item.metadata,
    });
    created.push(result);
  }

  return { imported: created.length };
}
