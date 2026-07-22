"use client";

import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { authClient } from "@/lib/auth-client";
import { useUiStore } from "@/stores/ui-store";

const { Header } = Layout;
const { Text } = Typography;

export function DashboardHeader({
  userName,
  workspaceId,
  workspaceName,
}: {
  userName: string;
  workspaceId: string;
  workspaceName?: string;
}) {
  const router = useRouter();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const saveStatus = useUiStore((s) => s.saveStatus);

  return (
    <Header className="dashboard-header">
      <div className="dashboard-header-inner">
        <Space size="middle" className="dashboard-header-left">
          <Button
            type="text"
            className="dashboard-header-icon-btn dashboard-header-menu-mobile"
            aria-label="Open navigation menu"
            icon={<MenuOutlined />}
            onClick={() => setMobileNavOpen(true)}
          />
          <Button
            type="text"
            className="dashboard-header-icon-btn dashboard-header-menu-desktop"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />
          <WorkspaceSwitcher
            currentWorkspaceId={workspaceId}
            currentWorkspaceName={workspaceName ?? "Workspace"}
          />
          <Breadcrumbs />
        </Space>

        <Space size="middle" className="dashboard-header-right">
          {saveStatus !== "idle" ? (
            <Text className="dashboard-save-status" aria-live="polite">
              {saveStatus}
            </Text>
          ) : null}
          <Button
            type="default"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => setCommandPaletteOpen(true)}
            className="dashboard-search-btn"
            aria-label="Open command palette (Ctrl+K)"
          >
            <span className="dashboard-search-btn-label">Search</span>
            <kbd className="dashboard-kbd">Ctrl+K</kbd>
          </Button>
          <ThemeToggle />
          <Dropdown
            menu={{
              items: [
                {
                  key: "settings",
                  icon: <SettingOutlined />,
                  label: "Settings",
                  onClick: () => router.push("/dashboard/settings"),
                },
                { type: "divider" },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Log out",
                  onClick: async () => {
                    await authClient.signOut();
                    router.push("/sign-in");
                    router.refresh();
                  },
                },
              ],
            }}
            trigger={["click"]}
          >
            <button
              type="button"
              className="dashboard-user-btn"
              aria-label="Account menu"
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="dashboard-avatar"
              />
              <Text className="dashboard-user-name">{userName}</Text>
            </button>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
}
