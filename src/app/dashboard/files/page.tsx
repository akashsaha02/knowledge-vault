import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function FilesPage() {
  return (
    <DashboardItemPage
      type="FILE"
      title="Files"
      emptyDescription="Keep a file next to the notes that need it."
    />
  );
}
