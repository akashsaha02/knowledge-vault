"use client";

import { Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";

type BookmarkViewerProps = {
  url: string;
  title: string;
  description?: string;
  siteName?: string;
  faviconUrl?: string;
  previewImageUrl?: string;
};

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function BookmarkViewer({
  url,
  title,
  description,
  siteName,
  faviconUrl,
  previewImageUrl,
}: BookmarkViewerProps) {
  const domain = siteName || domainFromUrl(url);

  return (
    <article className="saved-link-card">
      {previewImageUrl ? (
        <div className="saved-link-preview">
          <Image
            src={previewImageUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}
      <div className="saved-link-card-top">
        {faviconUrl ? (
          <Image
            src={faviconUrl}
            alt=""
            width={20}
            height={20}
            className="saved-link-favicon"
            unoptimized
          />
        ) : null}
        <div>
          <h4 className="saved-link-title">{title || "Untitled link"}</h4>
          <p className="saved-link-domain">{domain}</p>
        </div>
      </div>
      {description ? (
        <p className="saved-link-description">{description}</p>
      ) : null}
      <div className="saved-link-actions">
        <Button asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => void copyToClipboard(url, "Link copied")}
        >
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
      </div>
    </article>
  );
}
