import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function FilesPage() {
  return (
    <DashboardItemPage
      type="FILE"
      title="Files"
      emptyDescription="No files yet"
    />
  );
}
