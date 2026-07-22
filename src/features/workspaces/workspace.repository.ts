import { db } from "@/lib/db";
import type { WorkspaceRole } from "@/generated/prisma/client";

export async function findWorkspaceById(id: string) {
  return db.workspace.findUnique({ where: { id } });
}

export async function findMember(workspaceId: string, userId: string) {
  return db.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
}

export async function findUserWorkspaces(userId: string) {
  return db.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createWorkspace(data: {
  name: string;
  slug: string;
  isPersonal?: boolean;
  userId: string;
  role?: WorkspaceRole;
}) {
  return db.workspace.create({
    data: {
      name: data.name,
      slug: data.slug,
      isPersonal: data.isPersonal ?? false,
      members: {
        create: {
          userId: data.userId,
          role: data.role ?? "OWNER",
        },
      },
    },
    include: { members: true },
  });
}

export async function setActiveWorkspace(userId: string, workspaceId: string) {
  return db.user.update({
    where: { id: userId },
    data: { activeWorkspaceId: workspaceId },
  });
}
