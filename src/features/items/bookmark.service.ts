import "server-only";

import { validateBookmarkUrl } from "@/lib/url-validation";

export async function fetchBookmarkMetadata(rawUrl: string) {
  const url = validateBookmarkUrl(rawUrl);
  const response = await fetch(url, {
    headers: { "User-Agent": "KnowledgeVaultBot/1.0" },
    signal: AbortSignal.timeout(8000),
  });

  const html = await response.text();
  const title =
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ??
    new URL(url).hostname;
  const description =
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ??
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
    )?.[1] ??
    "";

  const siteName =
    html.match(
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ?? new URL(url).hostname;

  const previewImageUrl =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ?? undefined;

  const faviconUrl = `${new URL(url).origin}/favicon.ico`;

  return {
    url,
    title,
    description,
    siteName,
    previewImageUrl,
    faviconUrl,
    plainText: `${title} ${description} ${url}`,
  };
}
