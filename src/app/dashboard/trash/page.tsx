import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function TrashPage() {
  return (
    <DashboardItemPage
      title="Trash"
      emptyDescription="Deleted items will appear here for a while. You can bring them back."
      status="TRASHED"
    />
  );
}
