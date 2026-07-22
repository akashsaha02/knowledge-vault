"use client";

import Link from "next/link";
import { Layout } from "antd";
import { useDocumentTheme } from "@/components/providers/theme-context";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { DashboardNavMenu } from "@/components/dashboard/nav-menu";
import { useUiStore } from "@/stores/ui-store";

const { Sider } = Layout;

export function DashboardSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mode = useDocumentTheme();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setSidebarCollapsed}
      width={260}
      collapsedWidth={72}
      theme={mode === "dark" ? "dark" : "light"}
      className="dashboard-sider dashboard-sider-desktop"
      trigger={null}
    >
      <Link
        href="/dashboard"
        className={`sider-brand ${collapsed ? "sider-brand-collapsed" : ""}`}
      >
        <span className="sider-brand-icon">KV</span>
        {!collapsed ? (
          <span className="sider-brand-text">Knowledge Vault</span>
        ) : null}
      </Link>

      <div className="sider-quick-actions">
        <CreateMenu block collapsed={collapsed} />
      </div>

      <div className="sider-menu-wrap">
        <DashboardNavMenu defaultLibraryOpen defaultOrganizeOpen={false} />
      </div>
    </Sider>
  );
}
