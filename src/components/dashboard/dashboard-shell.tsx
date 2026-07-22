"use client";

import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CommandPalette } from "@/components/command-palette";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Layout } from "antd";

const { Content } = Layout;

type DashboardShellProps = {
  children: React.ReactNode;
  userName: string;
  workspaceId: string;
  workspaceName: string;
};

export function DashboardShell({
  children,
  userName,
  workspaceId,
  workspaceName,
}: DashboardShellProps) {
  return (
    <Layout className="min-h-screen">
      <DashboardSidebar />
      <Layout>
        <DashboardHeader userName={userName} workspaceName={workspaceName} />
        <div className="px-4 py-2 border-b border-neutral-100">
          <WorkspaceSwitcher
            currentWorkspaceId={workspaceId}
            currentWorkspaceName={workspaceName}
          />
        </div>
        <Content className="bg-white">{children}</Content>
      </Layout>
      <CommandPalette />
    </Layout>
  );
}
