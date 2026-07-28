import { Suspense } from "react";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { requireUser } from "@/lib/session";
import { SearchPageClient } from "@/components/dashboard/search-page-client";
import { InlineLoader } from "@/components/ui/content-loader";

export default async function SearchPage() {
  const user = await requireUser();
  const workspaceId = await getActiveWorkspace(user.id);
  if (!workspaceId) return null;
  return (
    <Suspense fallback={<InlineLoader />}>
      <SearchPageClient workspaceId={workspaceId} />
    </Suspense>
  );
}
