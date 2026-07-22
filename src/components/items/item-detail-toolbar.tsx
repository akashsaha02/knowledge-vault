"use client";

import {
  DeleteOutlined,
  InboxOutlined,
  MoreOutlined,
  PushpinOutlined,
  PushpinFilled,
  StarOutlined,
  StarFilled,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Popconfirm, Space, Tooltip, Typography } from "antd";
import { formatFullDate } from "@/lib/format-date";

const { Text } = Typography;

type ItemDetailToolbarProps = {
  updatedAt: Date | string;
  isPinned?: boolean;
  isFavorite?: boolean;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED" | "TRASHED";
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete: () => void;
};

export function ItemDetailToolbar({
  updatedAt,
  isPinned,
  isFavorite,
  status,
  onTogglePin,
  onToggleFavorite,
  onArchive,
  onRestore,
  onDelete,
}: ItemDetailToolbarProps) {
  const moreItems = [
    status === "ACTIVE" && onArchive
      ? {
          key: "archive",
          icon: <InboxOutlined />,
          label: "Archive",
          onClick: onArchive,
        }
      : null,
    status === "ARCHIVED" && onRestore
      ? {
          key: "restore",
          icon: <UndoOutlined />,
          label: "Restore",
          onClick: onRestore,
        }
      : null,
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Move to trash",
      danger: true,
      onClick: onDelete,
    },
  ].filter(Boolean) as {
    key: string;
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick: () => void;
  }[];

  return (
    <div className="item-detail-toolbar">
      <Text type="secondary" className="item-detail-meta">
        Edited {formatFullDate(updatedAt)}
      </Text>
      <Space size={4}>
        <Tooltip title={isPinned ? "Unpin" : "Pin note"}>
          <Button
            type="text"
            size="small"
            icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
            onClick={onTogglePin}
            className={isPinned ? "item-toolbar-active" : ""}
          />
        </Tooltip>
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          <Button
            type="text"
            size="small"
            icon={isFavorite ? <StarFilled /> : <StarOutlined />}
            onClick={onToggleFavorite}
            className={isFavorite ? "item-toolbar-active" : ""}
          />
        </Tooltip>
        <Dropdown menu={{ items: moreItems }} trigger={["click"]}>
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Dropdown>
      </Space>
    </div>
  );
}
