"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type BookmarkViewerProps = {
  url: string;
  title: string;
  description?: string;
  siteName?: string;
  faviconUrl?: string;
  previewImageUrl?: string;
};

export function BookmarkViewer({
  url,
  title,
  description,
  siteName,
  faviconUrl,
  previewImageUrl,
}: BookmarkViewerProps) {
  return (
    <Card className="overflow-hidden">
      {previewImageUrl && (
        <div className="relative h-40 w-full mb-4">
          <Image
            src={previewImageUrl}
            alt={title}
            fill
            className="object-cover rounded"
            unoptimized
          />
        </div>
      )}
      <CardContent className={previewImageUrl ? "pt-0" : "pt-6"}>
        <div className="flex items-start gap-3">
          {faviconUrl && (
            <Image src={faviconUrl} alt="" width={20} height={20} unoptimized />
          )}
          <div className="flex-1">
            <h4 className="mb-1 text-lg font-semibold">
              {title}
            </h4>
            {siteName && (
              <p className="text-sm text-[var(--muted)]">{siteName}</p>
            )}
            {description && (
              <p className="mt-2 mb-0">{description}</p>
            )}
            <Button
              variant="link"
              className="!px-0 mt-2 h-auto"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                {url}
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
