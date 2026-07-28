"use client";

import { History } from "lucide-react";
import { useState } from "react";
import { getRevisionsAction } from "@/features/items/item.actions";
import { formatRelativeTime } from "@/lib/format-date";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ListSkeleton } from "@/components/ui/loading-skeleton";

type RevisionHistoryProps = {
  workspaceId: string;
  itemId: string;
  onRestore: (revision: {
    content: unknown;
    plainText: string;
  }) => Promise<void>;
};

type Revision = Awaited<ReturnType<typeof getRevisionsAction>>[number];

export function RevisionHistory({
  workspaceId,
  itemId,
  onRestore,
}: RevisionHistoryProps) {
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (revisions) return;
    setLoading(true);
    try {
      const data = await getRevisionsAction(workspaceId, itemId);
      setRevisions(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Accordion type="single" collapsible className="revision-history">
      <AccordionItem value="history" className="border-none">
        <AccordionTrigger
          className="py-2 hover:no-underline"
          onClick={() => {
            if (!revisions && !loading) void load();
          }}
        >
          <span className="revision-history-label">
            <History size={16} strokeWidth={1.75} aria-hidden="true" />
            Version history
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div>
            {!revisions && !loading ? (
              <Button size="sm" variant="secondary" onClick={() => void load()}>
                Load revisions
              </Button>
            ) : null}
            {loading ? <ListSkeleton rows={2} /> : null}
            {revisions?.length === 0 ? (
              <p className="text-(--muted) text-sm">No revisions yet.</p>
            ) : null}
            {revisions && revisions.length > 0 ? (
              <ul className="m-0 flex list-none flex-col divide-y divide-(--border) p-0">
                {revisions.map((revision) => (
                  <li
                    key={revision.id}
                    className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="m-0 text-sm">
                        {revision.changeSummary ?? "Revision"}
                      </p>
                      <p className="m-0 text-xs text-(--muted)">
                        {formatRelativeTime(revision.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() =>
                        void onRestore({
                          content: revision.content,
                          plainText: revision.plainText,
                        })
                      }
                    >
                      Restore
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
