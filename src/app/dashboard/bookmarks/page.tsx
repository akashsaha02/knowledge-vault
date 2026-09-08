import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function BookmarksPage() {
  return (
    <DashboardItemPage
      type="BOOKMARK"
      title="Saved Links"
      emptyDescription="Keep useful pages close."
    />
  );
}
