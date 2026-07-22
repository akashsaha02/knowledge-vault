import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function FavoritesPage() {
  return (
    <DashboardItemPage
      title="Favorites"
      emptyDescription="No favorites yet"
      favoritesOnly
    />
  );
}
