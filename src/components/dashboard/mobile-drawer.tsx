"use client";

import { Drawer } from "antd";
import Link from "next/link";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { DashboardNavMenu } from "@/components/dashboard/nav-menu";
import { useUiStore } from "@/stores/ui-store";

export function MobileDrawer() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <Drawer
      title={
        <Link
          href="/dashboard"
          className="sider-brand sider-brand-drawer"
          onClick={() => setMobileNavOpen(false)}
        >
          <span className="sider-brand-icon">KV</span>
          <span className="sider-brand-text">Knowledge Vault</span>
        </Link>
      }
      placement="left"
      open={open}
      onClose={() => setMobileNavOpen(false)}
      className="mobile-nav-drawer"
      size={280}
    >
      <div className="mobile-drawer-content">
        <div className="sider-quick-actions">
          <CreateMenu block onNavigate={() => setMobileNavOpen(false)} />
        </div>
        <DashboardNavMenu
          onNavigate={() => setMobileNavOpen(false)}
          defaultLibraryOpen
          defaultOrganizeOpen
        />
      </div>
    </Drawer>
  );
}
