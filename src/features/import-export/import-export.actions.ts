"use server";

import {
  exportWorkspaceJson,
  exportWorkspaceZip,
} from "@/features/import-export/export.service";
import { importPayloadSchema } from "@/features/import-export/import.schema";
import { createItemForUser } from "@/features/items/item.service";
import { requireUser } from "@/lib/session";

export async function exportJsonAction(workspaceId: string) {
  const user = await requireUser();
  return exportWorkspaceJson(user.id, workspaceId);
}

export async function exportZipAction(workspaceId: string) {
  const user = await requireUser();
  return exportWorkspaceZip(user.id, workspaceId);
}

export async function importJsonAction(workspaceId: string, json: string) {
  const user = await requireUser();

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON");
  }

  const parsed = importPayloadSchema.parse(raw);
  const created = [];

  for (const item of parsed.items) {
    const result = await createItemForUser(user.id, {
      workspaceId,
      type: item.type,
      title: item.title,
      plainText: item.plainText,
      content: item.content,
      metadata: item.metadata,
      status: item.status,
    });
    created.push(result);
  }

  return { imported: created.length };
}
