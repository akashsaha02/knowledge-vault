import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function FilesPage() {
  return (
    <DashboardItemPage
      type="FILE"
      title="Files"
      emptyDescription="Upload a file you want to keep with your notes."
    />
  );
}
