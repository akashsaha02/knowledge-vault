"use client";

import {
  FolderOpenOutlined,
  BookOutlined,
  CodeOutlined,
  DeleteOutlined,
  FileOutlined,
  HeartOutlined,
  HomeOutlined,
  InboxOutlined,
  ProjectOutlined,
  RobotOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/stores/ui-store";

const { Sider } = Layout;

const NAV_ITEMS = [
  { key: "/dashboard", icon: <HomeOutlined />, label: "Home" },
  { key: "/dashboard/inbox", icon: <InboxOutlined />, label: "Inbox" },
  { key: "/dashboard/search", icon: <SearchOutlined />, label: "Search" },
  { key: "/dashboard/projects", icon: <ProjectOutlined />, label: "Projects" },
  { key: "/dashboard/collections", icon: <FolderOpenOutlined />, label: "Collections" },
  { key: "/dashboard/notes", icon: <BookOutlined />, label: "Notes" },
  { key: "/dashboard/snippets", icon: <CodeOutlined />, label: "Snippets" },
  { key: "/dashboard/commands", icon: <ConsoleSqlOutlined />, label: "Commands" },
  { key: "/dashboard/bookmarks", icon: <StarOutlined />, label: "Bookmarks" },
  { key: "/dashboard/prompts", icon: <RobotOutlined />, label: "Prompts" },
  { key: "/dashboard/files", icon: <FileOutlined />, label: "Files" },
  { key: "/dashboard/favorites", icon: <HeartOutlined />, label: "Favorites" },
  { key: "/dashboard/archive", icon: <FolderOpenOutlined />, label: "Archive" },
  { key: "/dashboard/trash", icon: <DeleteOutlined />, label: "Trash" },
  { key: "/dashboard/settings", icon: <SettingOutlined />, label: "Settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  const selectedKey =
    NAV_ITEMS.find((item) => pathname.startsWith(item.key))?.key ??
    "/dashboard";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => useUiStore.getState().toggleSidebar()}
      width={240}
      theme="light"
      className="border-r border-neutral-200"
    >
      <div className="px-4 py-4 font-semibold">Knowledge Vault</div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={NAV_ITEMS.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link href={item.key}>{item.label}</Link>,
        }))}
      />
    </Sider>
  );
}
