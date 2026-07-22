"use client";

import { Select } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getWorkspacesAction,
  switchWorkspaceAction,
} from "@/features/workspaces/workspace.actions";

type WorkspaceOption = Awaited<ReturnType<typeof getWorkspacesAction>>[number];

export function WorkspaceSwitcher({
  currentWorkspaceId,
  currentWorkspaceName,
}: {
  currentWorkspaceId: string;
  currentWorkspaceName: string;
}) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);

  useEffect(() => {
    getWorkspacesAction().then(setWorkspaces);
  }, []);

  return (
    <Select
      value={currentWorkspaceId}
      style={{ minWidth: 220 }}
      options={workspaces.map((m) => ({
        value: m.workspaceId,
        label: m.workspace.name,
      }))}
      onChange={async (workspaceId) => {
        await switchWorkspaceAction(workspaceId);
        router.refresh();
      }}
      placeholder={currentWorkspaceName}
    />
  );
}
