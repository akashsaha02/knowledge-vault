"use client";

import { CommandPalette } from "@/components/command-palette";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileDrawer } from "@/components/dashboard/mobile-drawer";
import { MobileNav } from "@/components/dashboard/mobile-nav";
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
    <Layout className="dashboard-root">
      <DashboardSidebar />
      <Layout className="dashboard-main">
        <DashboardHeader
          userName={userName}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
        />
        <Content id="main-content" className="dashboard-content" tabIndex={-1}>
          {children}
        </Content>
        <MobileNav />
      </Layout>
      <MobileDrawer />
      <CommandPalette workspaceId={workspaceId} />
    </Layout>
  );
}
