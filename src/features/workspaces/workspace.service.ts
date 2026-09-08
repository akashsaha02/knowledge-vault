import "server-only";

import { uniqueSlug } from "@/lib/slug";
import {
  createWorkspace,
  findMember,
  findUserActiveWorkspaceId,
  findUserWorkspaces,
  setActiveWorkspace,
} from "@/features/workspaces/workspace.repository";
import { hasPermission, canEditItem } from "@/features/workspaces/workspace.permissions";

export class AuthorizationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function bootstrapPersonalWorkspace(userId: string, name: string) {
  const slug = uniqueSlug(name || "personal", userId.slice(0, 8));
  const workspace = await createWorkspace({
    name: `${name}'s Workspace`,
    slug,
    isPersonal: true,
    userId,
    role: "OWNER",
  });

  await setActiveWorkspace(userId, workspace.id);
  return workspace;
}

export async function requireWorkspaceMember(
  userId: string,
  workspaceId: string,
) {
  const member = await findMember(workspaceId, userId);
  if (!member) {
    throw new AuthorizationError("Not a workspace member");
  }
  return member;
}

export async function requireWorkspacePermission(
  userId: string,
  workspaceId: string,
  action: Parameters<typeof hasPermission>[1],
) {
  const member = await requireWorkspaceMember(userId, workspaceId);
  if (!hasPermission(member.role, action)) {
    throw new AuthorizationError("Insufficient permissions");
  }
  return member;
}

export async function getUserWorkspaces(userId: string) {
  return findUserWorkspaces(userId);
}

export async function getActiveWorkspace(userId: string) {
  const activeWorkspaceId = await findUserActiveWorkspaceId(userId);

  if (activeWorkspaceId) {
    const member = await findMember(activeWorkspaceId, userId);
    if (member) {
      return member.workspaceId;
    }
  }

  const memberships = await findUserWorkspaces(userId);
  const first = memberships[0];
  if (!first) {
    return null;
  }

  await setActiveWorkspace(userId, first.workspaceId);
  return first.workspaceId;
}

export async function switchWorkspace(userId: string, workspaceId: string) {
  await requireWorkspaceMember(userId, workspaceId);
  await setActiveWorkspace(userId, workspaceId);
  return workspaceId;
}

export { canEditItem };