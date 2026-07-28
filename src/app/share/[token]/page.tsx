import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SharePasswordGate } from "@/components/sharing/share-password-gate";
import { ShareCopyButton } from "@/components/sharing/share-copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryChip } from "@/components/ui/category-chip";
import { BRAND_NAME } from "@/lib/brand";
import { getPublicSharedContent } from "@/features/sharing/share.service";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const shared = await getPublicSharedContent(token);
  if (!shared) {
    notFound();
  }

  if (shared.requiresPassword) {
    return <SharePasswordGate token={token} />;
  }

  const { link, item } = shared as Extract<typeof shared, { requiresPassword: false }>;

  return (
    <div className="share-page">
      <header className="share-page-header">
        <BrandLogo href="/" variant="lockup" />
      </header>

      <div className="share-page-body">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Shared via {BRAND_NAME}</CardTitle>
          </CardHeader>
          <CardContent>
            {!item ? (
              <p className="text-[var(--muted)]">
                This link is active but no item is attached yet. Ask the owner to
                share a specific note or snippet.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <CategoryChip type={item.type} />
                  {link.allowCopy ? (
                    <Badge variant="secondary">Copy allowed</Badge>
                  ) : (
                    <Badge variant="outline">Copy disabled</Badge>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                {item.plainText ? (
                  <pre
                    className={`share-content-preview font-mono text-sm${link.allowCopy ? "" : " select-none"}`}
                  >
                    {item.plainText}
                  </pre>
                ) : (
                  <p className="text-[var(--muted)]">No text content.</p>
                )}
                {item.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((entry) => (
                      <Badge key={entry.tag.id} variant="outline">
                        {entry.tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {link.allowCopy && item.plainText ? (
                  <div className="mt-4">
                    <ShareCopyButton text={item.plainText} />
                  </div>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="share-page-footer">
        Powered by {BRAND_NAME}
      </footer>
    </div>
  );
}
