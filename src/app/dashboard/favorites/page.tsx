import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function FavoritesPage() {
  return (
    <DashboardItemPage
      title="Favorites"
      emptyDescription="Mark something as important with the star. Favorites stay easy to find."
      favoritesOnly
    />
  );
}
