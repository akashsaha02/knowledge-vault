"use client";

import { PushpinFilled, StarFilled } from "@ant-design/icons";
import { formatRelativeTime } from "@/lib/format-date";

type ItemListCardProps = {
  title: string;
  preview?: string | null;
  type?: string;
  updatedAt: Date | string;
  isPinned?: boolean;
  isFavorite?: boolean;
  selected?: boolean;
  onClick: () => void;
};

export function ItemListCard({
  title,
  preview,
  type,
  updatedAt,
  isPinned,
  isFavorite,
  selected,
  onClick,
}: ItemListCardProps) {
  const displayTitle =
    title && title !== "Untitled note" && !title.startsWith("Untitled")
      ? title
      : "Untitled";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-selected={selected}
      aria-label={`${displayTitle}, ${type ?? "item"}`}
      className={`item-list-card ${selected ? "item-list-card-selected" : ""}`}
    >
      <div className="item-list-card-top">
        <span className="item-list-card-title">{displayTitle}</span>
        <span className="item-list-card-badges">
          {isPinned ? <PushpinFilled className="item-list-card-pin" aria-hidden /> : null}
          {isFavorite ? <StarFilled className="item-list-card-star" aria-hidden /> : null}
        </span>
      </div>
      {preview ? (
        <p className="item-list-card-preview">{preview}</p>
      ) : (
        <p className="item-list-card-preview item-list-card-preview-empty">
          No additional text
        </p>
      )}
      <div className="item-list-card-footer">
        {type ? <span className="item-list-card-type">{type}</span> : null}
        <span className="item-list-card-date">
          {formatRelativeTime(updatedAt)}
        </span>
      </div>
    </button>
  );
}
