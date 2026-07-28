"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      onValueChange={async (workspaceId) => {
        await switchWorkspaceAction(workspaceId);
        router.refresh();
      }}
    >
      <SelectTrigger className="workspace-switcher">
        <SelectValue placeholder={currentWorkspaceName} />
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((m) => (
          <SelectItem key={m.workspaceId} value={m.workspaceId}>
            {m.workspace.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
