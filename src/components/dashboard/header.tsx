"use client";

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useUiStore } from "@/stores/ui-store";

const { Header } = Layout;
const { Text } = Typography;

export function DashboardHeader({
  userName,
  workspaceName,
}: {
  userName: string;
  workspaceName?: string;
}) {
  const router = useRouter();
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const saveStatus = useUiStore((s) => s.saveStatus);

  return (
    <Header className="!bg-white !px-6 border-b border-neutral-200 flex items-center justify-between">
      <Space>
        <Text strong>{workspaceName ?? "Workspace"}</Text>
        <Text type="secondary" className="text-xs">
          {saveStatus === "idle" ? "" : saveStatus}
        </Text>
      </Space>
      <Space>
        <Text
          className="cursor-pointer text-sm text-neutral-500"
          onClick={() => setCommandPaletteOpen(true)}
        >
          Ctrl+K
        </Text>
        <ThemeToggle />
        <Dropdown
          menu={{
            items: [
              {
                key: "settings",
                label: "Settings",
                onClick: () => router.push("/dashboard/settings"),
              },
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
        >
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <Text>{userName}</Text>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
