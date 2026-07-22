type LoadingSkeletonProps = {
  rows?: number;
  className?: string;
};

export function ListSkeleton({ rows = 5, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`skeleton-list ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-list-item">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-body" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="skeleton-page" aria-hidden="true">
      <div className="skeleton-line skeleton-line-heading" />
      <div className="skeleton-line skeleton-line-subheading" />
      <ListSkeleton rows={4} />
    </div>
  );
}
