"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { DashboardNavMenu } from "@/components/dashboard/nav-menu";
import { SidebarPersist } from "@/components/dashboard/sidebar-persist";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

export function DashboardSidebar({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const pathname = usePathname();
  const settingsActive = pathname.startsWith("/dashboard/settings");

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

        <div className="sider-footer">
          <Link
            href="/dashboard/settings"
            className={cn(
              "nav-link",
              settingsActive && "nav-link--active",
              collapsed && "nav-link--collapsed",
            )}
            aria-current={settingsActive ? "page" : undefined}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings size={18} strokeWidth={1.75} aria-hidden="true" />
            {!collapsed ? <span>Settings</span> : null}
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn("sider-profile", collapsed && "justify-center px-0")}
            title={collapsed ? userName : undefined}
          >
            <UserAvatar name={userName} image={userImage} size="sm" />
            {!collapsed ? (
              <span className="sider-profile-copy">
                <span className="sider-profile-name">{userName}</span>
                <span className="sider-profile-meta">Account &amp; theme</span>
              </span>
            ) : null}
          </Link>
        </div>
      </aside>
    </>
  );
}
