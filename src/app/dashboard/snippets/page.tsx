import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";
import { CODE_ITEM_TYPES } from "@/lib/nav-config";

export default function SnippetsPage() {
  return (
    <DashboardItemPage
      types={CODE_ITEM_TYPES}
      title="Code"
      description="Save snippets and terminal commands you want to reuse."
      emptyDescription="Keep useful snippets and commands here."
    />
  );
}
