"use client";

import {
  BookOutlined,
  CodeOutlined,
  ConsoleSqlOutlined,
  DeleteOutlined,
  FileOutlined,
  FolderOpenOutlined,
  HeartOutlined,
  HomeOutlined,
  InboxOutlined,
  ProjectOutlined,
  RobotOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  BOTTOM_NAV,
  getSelectedNavKey,
  LIBRARY_NAV,
  MAIN_NAV,
  ORGANIZE_NAV,
} from "@/lib/nav-config";

const ICONS: Record<string, React.ReactNode> = {
  "/dashboard": <HomeOutlined />,
  "/dashboard/inbox": <InboxOutlined />,
  "/dashboard/search": <SearchOutlined />,
  "/dashboard/notes": <BookOutlined />,
  "/dashboard/snippets": <CodeOutlined />,
  "/dashboard/commands": <ConsoleSqlOutlined />,
  "/dashboard/bookmarks": <StarOutlined />,
  "/dashboard/prompts": <RobotOutlined />,
  "/dashboard/files": <FileOutlined />,
  "/dashboard/projects": <ProjectOutlined />,
  "/dashboard/collections": <FolderOpenOutlined />,
  "/dashboard/tags": <FolderOpenOutlined />,
  "/dashboard/favorites": <HeartOutlined />,
  "/dashboard/archive": <FolderOpenOutlined />,
  "/dashboard/trash": <DeleteOutlined />,
  "/dashboard/settings": <SettingOutlined />,
};

function toMenuItems(
  items: { key: string; label: string }[],
): NonNullable<MenuProps["items"]> {
  return items.map((item) => ({
    key: item.key,
    icon: ICONS[item.key],
    label: item.label,
  }));
}

type DashboardNavMenuProps = {
  onNavigate?: () => void;
  defaultLibraryOpen?: boolean;
  defaultOrganizeOpen?: boolean;
  showBottomNav?: boolean;
};

export function DashboardNavMenu({
  onNavigate,
  defaultLibraryOpen = true,
  defaultOrganizeOpen = false,
  showBottomNav = true,
}: DashboardNavMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const selectedKey = getSelectedNavKey(pathname);

  const items: MenuProps["items"] = useMemo(
    () => [
      ...toMenuItems(MAIN_NAV),
      {
        key: "library",
        label: "Library",
        children: toMenuItems(LIBRARY_NAV),
      },
      {
        key: "organize",
        label: "Organize",
        children: toMenuItems(ORGANIZE_NAV),
      },
    ],
    [],
  );

  const bottomItems = useMemo(() => toMenuItems(BOTTOM_NAV), []);

  const defaultOpenKeys = useMemo(() => {
    const keys: string[] = [];
    if (defaultLibraryOpen) keys.push("library");
    if (defaultOrganizeOpen) keys.push("organize");
    if (LIBRARY_NAV.some((item) => item.key === selectedKey)) keys.push("library");
    if (ORGANIZE_NAV.some((item) => item.key === selectedKey)) keys.push("organize");
    return [...new Set(keys)];
  }, [defaultLibraryOpen, defaultOrganizeOpen, selectedKey]);

  return (
    <div className="dashboard-nav-menu">
      <div className="dashboard-nav-main">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={defaultOpenKeys}
          items={items}
          onClick={({ key }) => {
            if (key === "library" || key === "organize") return;
            router.push(key);
            onNavigate?.();
          }}
        />
      </div>
      {showBottomNav ? (
        <div className="dashboard-nav-bottom">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={bottomItems}
            onClick={({ key }) => {
              router.push(key);
              onNavigate?.();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
