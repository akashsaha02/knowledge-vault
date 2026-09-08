import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";
import { CODE_ITEM_TYPES } from "@/lib/nav-config";

export default function SnippetsPage() {
  return (
    <DashboardItemPage
      types={CODE_ITEM_TYPES}
      title="Code"
      description="Snippets and terminal commands in one place."
      emptyDescription="Save the snippet you'll need again."
    />
  );
}
