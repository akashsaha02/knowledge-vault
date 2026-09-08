import "server-only";

import {
  createProject,
  deleteProject,
  findProjectById,
  findProjects,
  slugExists,
} from "@/features/projects/project.repository";
import { requireProjectInWorkspace } from "@/features/workspaces/workspace-resources";
import { requireWorkspacePermission } from "@/features/workspaces/workspace.service";
import { slugify, uniqueSlug } from "@/lib/slug";

export async function listProjects(userId: string, workspaceId: string) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  return findProjects(workspaceId);
}

export async function getProjectForUser(
  userId: string,
  workspaceId: string,
  projectId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "view");
  await requireProjectInWorkspace(workspaceId, projectId);
  return findProjectById(projectId);
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
  while (await slugExists(workspaceId, slug)) {
    slug = uniqueSlug(name, String(counter++));
  }

  return createProject({
    name,
    slug,
    description,
    workspace: { connect: { id: workspaceId } },
  });
}

export async function deleteProjectForUser(
  userId: string,
  workspaceId: string,
  projectId: string,
) {
  await requireWorkspacePermission(userId, workspaceId, "editAll");
  await requireProjectInWorkspace(workspaceId, projectId);
  return deleteProject(projectId);
}
