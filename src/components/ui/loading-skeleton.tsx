import { Loader2 } from "lucide-react";

type LoadingSkeletonProps = {
  rows?: number;
  className?: string;
};

export function LoadingSpinner({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Loader2
      className={`loading-spinner animate-spin ${className}`.trim()}
      size={size}
      aria-hidden="true"
    />
  );
}

function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`skeleton-line ${className}`.trim()} />;
}

export function ListSkeleton({ rows = 5, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`skeleton-list ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-list-item">
          <SkeletonLine className="skeleton-line-title" />
          <SkeletonLine className="skeleton-line-body" />
        </div>
      ))}
    </div>
  );
}

export function ItemListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="skeleton-item-list" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-item-list-card">
          <SkeletonLine className="skeleton-line-title" />
          <SkeletonLine className="skeleton-line-body" />
          <SkeletonLine className="skeleton-line-meta" />
        </div>
      ))}
    </div>
  );
}

export function ItemGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="skeleton-card-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-keep-card">
          <SkeletonLine className="skeleton-line-title" />
          <SkeletonLine className="skeleton-line-body" />
          <SkeletonLine className="skeleton-line-body skeleton-line-short" />
          <div className="skeleton-card-footer">
            <SkeletonLine className="skeleton-line-badge" />
            <SkeletonLine className="skeleton-line-date" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="home-dashboard" aria-hidden="true">
      <div className="home-hero">
        <SkeletonLine className="skeleton-line-detail-title" />
        <SkeletonLine className="skeleton-line-body skeleton-line-short" />
      </div>
      <div className="skeleton-metric-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton-metric">
            <SkeletonLine className="skeleton-avatar" />
            <SkeletonLine className="skeleton-line-meta" />
            <SkeletonLine className="skeleton-line-title" />
          </div>
        ))}
      </div>
      <ListSkeleton rows={4} />
    </div>
  );
}

export function PageBodySkeleton() {
  return (
    <div className="skeleton-page-body" aria-hidden="true">
      <ListSkeleton rows={4} />
    </div>
  );
}

export function ItemDetailSkeleton() {
  return (
    <div className="skeleton-item-detail" aria-hidden="true">
      <SkeletonLine className="skeleton-line-back" />
      <SkeletonLine className="skeleton-line-detail-title" />
      <div className="skeleton-editor">
        <SkeletonLine className="skeleton-line-toolbar" />
        <SkeletonLine className="skeleton-line-editor" />
        <SkeletonLine className="skeleton-line-editor" />
        <SkeletonLine className="skeleton-line-editor skeleton-line-editor-short" />
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="skeleton-editor" aria-hidden="true">
      <SkeletonLine className="skeleton-line-toolbar" />
      <SkeletonLine className="skeleton-line-editor" />
      <SkeletonLine className="skeleton-line-editor skeleton-line-editor-short" />
    </div>
  );
}
