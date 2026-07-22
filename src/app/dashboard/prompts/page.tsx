import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function PromptsPage() {
  return (
    <DashboardItemPage
      type="PROMPT"
      title="Prompts"
      emptyDescription="No prompts yet"
    />
  );
}
