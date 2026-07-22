"use server";

import { revalidatePath } from "next/cache";
import {
  getActiveWorkspace,
  getUserWorkspaces,
  switchWorkspace,
} from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";

export async function getWorkspacesAction() {
  const user = await requireUser();
  return getUserWorkspaces(user.id);
}

export async function getActiveWorkspaceAction() {
  const user = await requireUser();
  return getActiveWorkspace(user.id);
}

export async function switchWorkspaceAction(workspaceId: string) {
  const user = await requireUser();
  await switchWorkspace(user.id, workspaceId);
  revalidatePath("/dashboard");
  return workspaceId;
}
