import "server-only";

import {
  createProject,
  deleteProject,
  findProjects,
  updateProject,
} from "@/features/projects/project.repository";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";
import { slugify, uniqueSlug } from "@/lib/slug";
import { db } from "@/lib/db";

export async function listProjects(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  return findProjects(workspaceId);
}

export async function createProjectForUser(
  userId: string,
  workspaceId: string,
  name: string,
  description?: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "create");
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (
    await db.project.findUnique({
      where: { workspaceId_slug: { workspaceId, slug } },
    })
  ) {
    slug = uniqueSlug(name, String(counter++));
  }

  return createProject({
    name,
    slug,
    description,
    workspace: { connect: { id: workspaceId } },
  });
}

export async function updateProjectForUser(
  userId: string,
  workspaceId: string,
  projectId: string,
  data: { name?: string; description?: string; color?: string },
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  return updateProject(projectId, data);
}

export async function deleteProjectForUser(
  userId: string,
  workspaceId: string,
  projectId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  return deleteProject(projectId);
}
