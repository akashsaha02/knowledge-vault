import { ShareCopyButton } from "@/components/sharing/share-copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryChip } from "@/components/ui/category-chip";
import { BRAND_NAME } from "@/lib/brand";
import type { ItemType } from "@/generated/prisma/client";

type SharedItem = {
  title: string;
  type: ItemType;
  plainText: string | null;
  metadata: unknown;
  tags: Array<{ tag: { id: string; name: string } }>;
} | null;

type SharedItemViewProps = {
  item: SharedItem;
  allowCopy: boolean;
};

function metadataRecord(metadata: unknown): Record<string, unknown> {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? (metadata as Record<string, unknown>)
    : {};
}

function domainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SharedItemView({ item, allowCopy }: SharedItemViewProps) {
  if (!item) {
    return (
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-6">
          <p className="text-[var(--muted)]">
            This link is no longer attached to an item.
          </p>
        </CardContent>
      </Card>
    );
  }

  const meta = metadataRecord(item.metadata);
  const body = item.plainText ?? "";
  const selectClass = allowCopy ? "" : " select-none";

  return (
    <Card className="max-w-2xl w-full share-item-card">
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryChip type={item.type} />
          {allowCopy ? (
            <Badge variant="secondary">Copy allowed</Badge>
          ) : (
            <Badge variant="outline">Copy disabled</Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
        <p className="text-sm text-[var(--muted)]">Shared via {BRAND_NAME}</p>
      </CardHeader>
      <CardContent>
        {item.type === "NOTE" ? (
          body ? (
            <div className={`share-note-body${selectClass}`}>{body}</div>
          ) : (
            <p className="text-[var(--muted)]">No text content.</p>
          )
        ) : null}

        {item.type === "SNIPPET" ? (
          <pre className={`share-code-preview font-mono text-sm${selectClass}`}>
            {(meta.code as string | undefined) || body || "No code."}
          </pre>
        ) : null}

        {item.type === "COMMAND" ? (
          <div className="share-command-block">
            {typeof meta.shell === "string" ? (
              <p className="text-xs text-[var(--muted)] mb-2">{meta.shell}</p>
            ) : null}
            <pre className={`share-code-preview font-mono text-sm${selectClass}`}>
              {(meta.command as string | undefined) || body || "No command."}
            </pre>
          </div>
        ) : null}

        {item.type === "BOOKMARK" ? (
          <div className="share-bookmark-block">
            {typeof meta.url === "string" ? (
              <a
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="share-bookmark-url"
              >
                {domainFromUrl(meta.url)}
              </a>
            ) : null}
            {typeof meta.description === "string" ? (
              <p className="mt-2">{meta.description}</p>
            ) : body ? (
              <p className="mt-2">{body}</p>
            ) : null}
          </div>
        ) : null}

        {item.type === "PROMPT" ? (
          <pre className={`share-code-preview font-mono text-sm${selectClass}`}>
            {(meta.template as string | undefined) || body || "No prompt."}
          </pre>
        ) : null}

        {item.type === "FILE" ? (
          <p className="text-[var(--muted)]">
            This shared file listing includes the title only.
          </p>
        ) : null}

        {item.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((entry) => (
              <Badge key={entry.tag.id} variant="outline">
                {entry.tag.name}
              </Badge>
            ))}
          </div>
        ) : null}

        {allowCopy && body ? (
          <div className="mt-4">
            <ShareCopyButton text={body} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
