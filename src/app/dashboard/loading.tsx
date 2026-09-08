import { PageBodySkeleton } from "@/components/ui/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="page-shell">
      <PageBodySkeleton />
    </div>
  );
}
