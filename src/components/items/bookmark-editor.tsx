"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookmarkViewer } from "@/components/items/bookmark-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { previewBookmarkAction } from "@/features/items/bookmark.actions";
import { useAutosave } from "@/hooks/use-autosave";

type BookmarkEditorProps = {
  url: string;
  title: string;
  metadata: Record<string, unknown>;
  onSave: (data: {
    url: string;
    title: string;
    plainText: string;
    metadata: Record<string, unknown>;
  }) => Promise<void>;
};

export function BookmarkEditor({
  url: initialUrl,
  title: initialTitle,
  metadata: initialMetadata,
  onSave,
}: BookmarkEditorProps) {
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState(initialTitle);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [fetching, setFetching] = useState(false);

  const { schedule } = useAutosave(async () => {
    await onSave({
      url,
      title,
      plainText: (metadata.description as string) ?? title,
      metadata: { ...metadata, url },
    });
  });

  async function fetchMetadata() {
    if (!url.trim()) return;
    setFetching(true);
    try {
      const data = await previewBookmarkAction(url.trim());
      setTitle(data.title);
      setMetadata({
        url: data.url,
        faviconUrl: data.faviconUrl,
        previewImageUrl: data.previewImageUrl,
        siteName: data.siteName,
        description: data.description,
      });
      toast.success("Bookmark metadata fetched");
      schedule();
    } catch {
      toast.error("Could not fetch URL metadata");
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="bookmark-editor">
      <div className="mb-4 flex w-full">
        <Input
          className="rounded-r-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          aria-label="Bookmark URL"
          onKeyDown={(e) => {
            if (e.key === "Enter") void fetchMetadata();
          }}
        />
        <Button
          className="rounded-l-none"
          disabled={fetching}
          onClick={() => void fetchMetadata()}
        >
          {fetching ? <Loader2 className="animate-spin" /> : null}
          Fetch
        </Button>
      </div>

      <Input
        className="mb-4"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          schedule();
        }}
        placeholder="Bookmark title"
        aria-label="Bookmark title"
      />

      {url ? (
        <BookmarkViewer
          url={url}
          title={title}
          description={metadata.description as string | undefined}
          siteName={metadata.siteName as string | undefined}
          faviconUrl={metadata.faviconUrl as string | undefined}
          previewImageUrl={metadata.previewImageUrl as string | undefined}
        />
      ) : null}
    </div>
  );
}
