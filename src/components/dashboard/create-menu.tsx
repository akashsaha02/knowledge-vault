"use client";

import {
  BookOutlined,
  CodeOutlined,
  ConsoleSqlOutlined,
  DownOutlined,
  PlusOutlined,
  RobotOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useRouter } from "next/navigation";
import { CREATE_LINKS } from "@/lib/nav-config";

const CREATE_ICONS: Record<string, React.ReactNode> = {
  note: <BookOutlined />,
  snippet: <CodeOutlined />,
  command: <ConsoleSqlOutlined />,
  bookmark: <StarOutlined />,
  prompt: <RobotOutlined />,
};

type CreateMenuProps = {
  block?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function CreateMenu({
  block = false,
  collapsed = false,
  onNavigate,
}: CreateMenuProps) {
  const router = useRouter();

  return (
    <Dropdown
      menu={{
        items: CREATE_LINKS.map((item) => ({
          key: item.key,
          icon: CREATE_ICONS[item.key],
          label: item.label,
          onClick: () => {
            router.push(item.href);
            onNavigate?.();
          },
        })),
      }}
      trigger={["click"]}
    >
      <Button
        type="primary"
        block={block}
        icon={<PlusOutlined />}
        className={collapsed ? "create-menu-collapsed" : undefined}
        aria-label="Create new item"
      >
        {collapsed ? null : (
          <>
            New <DownOutlined className="create-menu-chevron" />
          </>
        )}
      </Button>
    </Dropdown>
  );
}
