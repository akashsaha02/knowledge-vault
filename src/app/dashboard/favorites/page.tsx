import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function FavoritesPage() {
  return (
    <DashboardItemPage
      title="Favorites"
      emptyDescription="Tap the star on something important to find it here"
      favoritesOnly
    />
  );
}
