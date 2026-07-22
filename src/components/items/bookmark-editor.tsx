"use client";

import { App, Button, Input, Space } from "antd";
import { useState } from "react";
import { previewBookmarkAction } from "@/features/items/bookmark.actions";
import { BookmarkViewer } from "@/components/items/bookmark-viewer";
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
  const { message } = App.useApp();
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
      message.success("Bookmark metadata fetched");
      schedule();
    } catch {
      message.error("Could not fetch URL metadata");
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="bookmark-editor">
      <Space.Compact className="w-full mb-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          aria-label="Bookmark URL"
          onPressEnter={() => void fetchMetadata()}
        />
        <Button loading={fetching} type="primary" onClick={() => void fetchMetadata()}>
          Fetch
        </Button>
      </Space.Compact>

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
