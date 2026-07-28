import { Suspense } from "react";
import { InlineLoader } from "@/components/ui/content-loader";
import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function NotesPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <DashboardItemPage
        type="NOTE"
        title="Notes"
        emptyDescription="Write something you want to remember"
      />
    </Suspense>
  );
}
