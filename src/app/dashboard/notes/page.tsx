import { Suspense } from "react";
import { Spin } from "antd";
import { DashboardItemPage } from "@/components/dashboard/dashboard-item-page";

export default function NotesPage() {
  return (
    <Suspense fallback={<Spin className="m-8" />}>
      <DashboardItemPage
        type="NOTE"
        title="Notes"
        emptyDescription="No notes yet"
      />
    </Suspense>
  );
}
