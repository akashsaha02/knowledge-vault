"use client";

import { CommandPalette } from "@/components/command-palette";
import { DashboardHeader } from "@/components/dashboard/header";
import { SaveStatusIndicator } from "@/components/dashboard/save-status-indicator";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileDrawer } from "@/components/dashboard/mobile-drawer";
import { MobileNav } from "@/components/dashboard/mobile-nav";

type DashboardShellProps = {
  children: React.ReactNode;
  userName: string;
  userImage?: string | null;
  workspaceId: string;
  workspaceName: string;
  workspaceCount?: number;
};

export function DashboardShell({
  children,
  userName,
  userImage,
  workspaceId,
  workspaceName,
  workspaceCount = 1,
}: DashboardShellProps) {
  return (
    <div className="dashboard-app">
      <div className="dashboard-root">
        <DashboardSidebar userName={userName} userImage={userImage} />
        <div className="dashboard-main">
          <DashboardHeader
            userName={userName}
            userImage={userImage}
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            workspaceCount={workspaceCount}
          />
          <main id="main-content" className="dashboard-content" tabIndex={-1}>
            {children}
          </main>
          <MobileNav />
        </div>
        <MobileDrawer userName={userName} userImage={userImage} />
        <CommandPalette workspaceId={workspaceId} />
        <SaveStatusIndicator />
      </div>
    </div>
  );
}
