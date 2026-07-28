import { LoadingSpinner } from "@/components/ui/loading-skeleton";

type ContentLoaderProps = {
  label?: string;
  className?: string;
};

export function CenteredContentLoader({
  label = "Loading…",
  className = "",
}: ContentLoaderProps) {
  return (
    <div className={`content-loader ${className}`.trim()} role="status" aria-live="polite">
      <div className="content-loader-inner">
        <LoadingSpinner size={20} />
        {label ? <span className="content-loader-label">{label}</span> : null}
      </div>
    </div>
  );
}

export function RouteLoadingFallback() {
  return <CenteredContentLoader className="content-loader--route" />;
}

export function InlineLoader({ label }: { label?: string }) {
  return <CenteredContentLoader className="content-loader--inline" label={label} />;
}
