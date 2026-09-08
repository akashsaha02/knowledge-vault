"use client";

import {
  Archive,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Pin,
  PinOff,
  RotateCcw,
  Star,
  Trash2,
} from "lucide-react";
import { CategoryChip } from "@/components/ui/category-chip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/format-date";
import { getNoteColorSidebarStyle, getNoteColorStyle } from "@/lib/note-colors";

type ItemListCardProps = {
  title: string;
  preview?: string | null;
  type?: string;
  updatedAt: Date | string;
  isPinned?: boolean;
  isFavorite?: boolean;
  isChecked?: boolean;
  isActive?: boolean;
  variant?: "card" | "sidebar";
  noteColorId?: string;
  onClick: () => void;
  onCheckChange?: (checked: boolean) => void;
  onPin?: () => void;
  onFavorite?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  onPermanentDelete?: () => void;
};

export function ItemListCard({
  title,
  preview,
  type,
  updatedAt,
  isPinned,
  isFavorite,
  isChecked = false,
  isActive,
  variant = "card",
  noteColorId,
  onClick,
  onCheckChange,
  onPin,
  onFavorite,
  onArchive,
  onRestore,
  onDelete,
  onPermanentDelete,
}: ItemListCardProps) {
  const displayTitle =
    title && title !== "Untitled note" && !title.startsWith("Untitled")
      ? title
      : "Untitled";

  const hasActions =
    onPin || onFavorite || onArchive || onRestore || onDelete || onPermanentDelete;
  const isSidebar = variant === "sidebar";

  return (
    <div
      className={`item-list-card-wrapper${isActive ? " item-list-card-wrapper-active" : ""}${isChecked ? " item-list-card-checked" : ""}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        aria-label={`${displayTitle}, ${type ?? "item"}`}
        aria-current={isActive ? "true" : undefined}
        className={`item-list-card${isActive ? " item-list-card-active" : ""}${isSidebar ? " item-list-card--sidebar" : ""}${noteColorId ? " item-list-card--colored" : ""}`}
        data-note-color={noteColorId || undefined}
        style={
          noteColorId
            ? isSidebar
              ? getNoteColorSidebarStyle(noteColorId)
              : getNoteColorStyle(noteColorId)
            : undefined
        }
      >
        <div className="item-list-card-inner">
          {!isSidebar && onCheckChange ? (
            <Checkbox
              checked={isChecked}
              className="item-list-card-checkbox mt-0.5"
              aria-label={`Mark "${displayTitle}" as done`}
              onClick={(event) => event.stopPropagation()}
              onCheckedChange={(checked) => onCheckChange(checked === true)}
            />
          ) : null}

          <div className="item-list-card-main">
            <div className="item-list-card-top flex items-start justify-between gap-2">
              <span className="item-list-card-title">{displayTitle}</span>
              <span className="item-list-card-badges flex gap-1">
                {isPinned ? (
                  <Pin className="item-list-card-pin h-3 w-3" aria-hidden />
                ) : null}
                {isFavorite ? (
                  <Star className="item-list-card-star h-3 w-3 fill-current" aria-hidden />
                ) : null}
              </span>
            </div>
            {preview ? (
              <p className="item-list-card-preview">{preview}</p>
            ) : (
              <p className="item-list-card-preview item-list-card-preview-empty">
                No content yet
              </p>
            )}
            {!isSidebar ? (
              <div className="item-list-card-footer">
                {type ? <CategoryChip type={type} showIcon={false} /> : null}
                <span className="item-list-card-date">
                  {formatRelativeTime(updatedAt)}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {hasActions ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="item-list-card-menu"
              aria-label={`Actions for ${displayTitle}`}
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {onPin ? (
              <DropdownMenuItem onClick={onPin}>
                {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                {isPinned ? "Unpin" : "Pin"}
              </DropdownMenuItem>
            ) : null}
            {onFavorite ? (
              <DropdownMenuItem onClick={onFavorite}>
                {isFavorite ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {isFavorite ? "Remove favorite" : "Favorite"}
              </DropdownMenuItem>
            ) : null}
            {onArchive ? (
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4" />
                Archive
              </DropdownMenuItem>
            ) : null}
            {onRestore ? (
              <DropdownMenuItem onClick={onRestore}>
                <RotateCcw className="h-4 w-4" />
                Restore
              </DropdownMenuItem>
            ) : null}
            {onDelete ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-[var(--destructive)]">
                  <Trash2 className="h-4 w-4" />
                  Move to Trash
                </DropdownMenuItem>
              </>
            ) : null}
            {onPermanentDelete ? (
              <DropdownMenuItem
                onClick={onPermanentDelete}
                className="text-[var(--destructive)]"
              >
                <Trash2 className="h-4 w-4" />
                Delete permanently
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
