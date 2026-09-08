import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SharePasswordGate } from "@/components/sharing/share-password-gate";
import { SharedItemView } from "@/features/sharing/components/shared-item-view";
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
        <SharedItemView item={item} allowCopy={link.allowCopy} />
      </div>

      <footer className="share-page-footer">
        Powered by {BRAND_NAME}
      </footer>
    </div>
  );
}
