"use client";

import {
  Archive,
  MoreHorizontal,
  Pin,
  Star,
  Trash2,
  Undo2,
} from "lucide-react";
import { formatFullDate } from "@/lib/format-date";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onPermanentDelete?: () => void;
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
  onPermanentDelete,
}: ItemDetailToolbarProps) {
  const moreItems = [
    status === "ACTIVE" && onArchive
      ? {
          key: "archive",
          icon: Archive,
          label: "Archive",
          onClick: onArchive,
          destructive: false,
        }
      : null,
    status === "ARCHIVED" && onRestore
      ? {
          key: "restore",
          icon: Undo2,
          label: "Restore",
          onClick: onRestore,
          destructive: false,
        }
      : null,
    status === "TRASHED" && onRestore
      ? {
          key: "restore",
          icon: Undo2,
          label: "Restore",
          onClick: onRestore,
          destructive: false,
        }
      : null,
    status === "TRASHED" && onPermanentDelete
      ? {
          key: "permanent-delete",
          icon: Trash2,
          label: "Delete permanently",
          onClick: onPermanentDelete,
          destructive: true,
        }
      : null,
    status !== "TRASHED"
      ? {
          key: "delete",
          icon: Trash2,
          label: "Move to Trash",
          onClick: onDelete,
          destructive: true,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];

  return (
    <div className="item-detail-toolbar">
      <span className="item-detail-meta text-sm text-[var(--muted)]">
        Edited {formatFullDate(updatedAt)}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          title={isPinned ? "Unpin" : "Pin to top"}
          onClick={onTogglePin}
          aria-label={isPinned ? "Unpin" : "Pin to top"}
          aria-pressed={isPinned}
          className={isPinned ? "item-toolbar-active" : ""}
        >
          <Pin className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title={isFavorite ? "Remove from favourites" : "Add to favourites"}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={isFavorite}
          className={isFavorite ? "item-toolbar-active" : ""}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.key}
                  className={item.destructive ? "text-[var(--destructive)]" : ""}
                  onClick={item.onClick}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
