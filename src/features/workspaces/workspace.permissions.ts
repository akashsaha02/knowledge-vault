import { WorkspaceRole } from "@/generated/prisma/client";

export const ROLE_PERMISSIONS = {
  view: ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as WorkspaceRole[],
  create: ["OWNER", "ADMIN", "MEMBER"] as WorkspaceRole[],
  editOwn: ["OWNER", "ADMIN", "MEMBER"] as WorkspaceRole[],
  editAll: ["OWNER", "ADMIN"] as WorkspaceRole[],
  invite: ["OWNER", "ADMIN"] as WorkspaceRole[],
  changeRoles: ["OWNER", "ADMIN"] as WorkspaceRole[],
  deleteWorkspace: ["OWNER"] as WorkspaceRole[],
} as const;

export function hasPermission(
  role: WorkspaceRole,
  action: keyof typeof ROLE_PERMISSIONS,
): boolean {
  return ROLE_PERMISSIONS[action].includes(role);
}
