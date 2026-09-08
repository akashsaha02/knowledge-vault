import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function BookmarksPage() {
  return (
    <DashboardItemPage
      type="BOOKMARK"
      title="Saved Links"
      emptyDescription="Save pages you want to find again."
    />
  );
}
