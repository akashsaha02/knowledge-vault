"use client";

import {
  Archive,
  MoreHorizontal,
  PanelRight,
  Pin,
  Share2,
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
  onShare?: () => void;
  onDetails?: () => void;
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
  onShare,
  onDetails,
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
          destructive: false,
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
          title={isPinned ? "Unpin — keep this easy to reach" : "Pin — keep this easy to reach"}
          onClick={onTogglePin}
          aria-label={isPinned ? "Unpin" : "Pin — keep this easy to reach"}
          aria-pressed={isPinned}
          className={isPinned ? "item-toolbar-active" : ""}
        >
          <Pin className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title={isFavorite ? "Remove favorite — mark as important" : "Favorite — mark as important"}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Favorite — mark as important"}
          aria-pressed={isFavorite}
          className={isFavorite ? "item-toolbar-active" : ""}
        >
          <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        {onShare ? (
          <Button
            variant="ghost"
            size="icon"
            title="Share"
            onClick={onShare}
            aria-label="Share item"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        ) : null}
        {onDetails ? (
          <Button
            variant="ghost"
            size="sm"
            title="Details"
            onClick={onDetails}
            aria-label="Open details"
          >
            <PanelRight className="h-4 w-4" />
            Details
          </Button>
        ) : null}
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
