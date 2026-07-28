import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function PromptsPage() {
  return (
    <DashboardItemPage
      type="PROMPT"
      title="AI Prompts"
      emptyDescription="Save prompts you use with AI tools"
    />
  );
}
