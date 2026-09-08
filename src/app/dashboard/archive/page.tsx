import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function ArchivePage() {
  return (
    <DashboardItemPage
      title="Archive"
      emptyDescription="Remove from your active workspace without deleting. Nothing is here yet."
      status="ARCHIVED"
    />
  );
}
