import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function BookmarksPage() {
  return (
    <DashboardItemPage
      type="BOOKMARK"
      title="Saved Links"
      emptyDescription="Save your first link — paste a URL and give it a name"
    />
  );
}
