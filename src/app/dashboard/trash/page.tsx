import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function TrashPage() {
  return (
    <DashboardItemPage
      title="Trash"
      emptyDescription="Items you move to Trash appear here until you restore or delete them permanently."
      status="TRASHED"
    />
  );
}
