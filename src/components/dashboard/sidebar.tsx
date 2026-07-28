"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { DashboardNavMenu } from "@/components/dashboard/nav-menu";
import { SidebarPersist } from "@/components/dashboard/sidebar-persist";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

export function DashboardSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <>
      <SidebarPersist />
      <aside
        className={cn(
          "dashboard-sider dashboard-sider-desktop",
          collapsed ? "dashboard-sider--collapsed" : "dashboard-sider--expanded",
        )}
      >
        <div className={cn("sider-brand", collapsed && "sider-brand-collapsed")}>
          <BrandLogo href="/dashboard" collapsed={collapsed} variant="lockup" />
        </div>

        <div className="sider-quick-actions">
          <CreateMenu block collapsed={collapsed} />
        </div>

        <div className="sider-menu-wrap">
          <DashboardNavMenu collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
