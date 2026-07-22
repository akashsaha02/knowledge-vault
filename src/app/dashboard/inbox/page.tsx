import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default async function InboxPage() {
  return (
    <DashboardItemPage
      title="Inbox"
      emptyDescription="Inbox is empty"
      status="DRAFT"
    />
  );
}
