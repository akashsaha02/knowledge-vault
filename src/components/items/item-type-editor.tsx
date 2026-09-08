"use client";

import { NoteEditor } from "@/components/editor/note-editor";
import { SnippetEditor } from "@/components/items/snippet-editor";
import { CommandEditor } from "@/components/items/command-editor";
import { PromptEditor } from "@/components/items/prompt-editor";
import { BookmarkEditor } from "@/components/items/bookmark-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteColorPicker } from "@/components/items/note-color-picker";
import type { ItemType } from "@/generated/prisma/client";
import { completeChecklistTask } from "@/lib/onboarding-storage";
import { getNoteColor, withNoteColor } from "@/lib/item-metadata";

export type EditableItem = {
  id: string;
  type: ItemType;
  title: string;
  content: unknown;
  plainText: string | null;
  metadata: unknown;
};

type ItemUpdateFields = {
  title?: string;
  plainText?: string;
  metadata?: unknown;
  content?: unknown;
};

type ItemTypeEditorProps = {
  item: EditableItem;
  isNotionSplit?: boolean;
  onSaveNote: (json: unknown, plainText: string) => Promise<void>;
  onUpdate: (fields: ItemUpdateFields) => Promise<void>;
};

export function ItemTypeEditor({
  item,
  isNotionSplit,
  onSaveNote,
  onUpdate,
}: ItemTypeEditorProps) {
  return (
    <>
      {item.type === "NOTE" ? (
        <div className="note-color-row">
          <span className="note-color-label">Color</span>
          <NoteColorPicker
            value={getNoteColor(item.metadata)}
            onChange={(colorId) => {
              void onUpdate({
                metadata: withNoteColor(item.metadata, colorId),
              });
            }}
          />
        </div>
      ) : null}

      {item.type === "NOTE" && (
        <NoteEditor
          itemId={item.id}
          content={item.content}
          plainText={item.plainText}
          onSave={onSaveNote}
          placeholder="Start writing..."
          className={isNotionSplit ? "note-editor--calm" : undefined}
        />
      )}

      {item.type === "SNIPPET" && (
        <SnippetEditor
          code={
            (item.metadata as { code?: string })?.code ??
            item.plainText ??
            ""
          }
          language={
            (item.metadata as { language?: string })?.language ??
            "typescript"
          }
          onCodeChange={async (code) => {
            const metadata = {
              ...(item.metadata as object),
              code,
              language:
                (item.metadata as { language?: string })?.language ??
                "typescript",
            };
            await onUpdate({ metadata, plainText: code });
            completeChecklistTask("snippet");
          }}
          onLanguageChange={async (language) => {
            const metadata = {
              ...(item.metadata as object),
              language,
            };
            await onUpdate({ metadata });
          }}
        />
      )}

      {item.type === "COMMAND" && (
        <CommandEditor
          command={
            (item.metadata as { command?: string })?.command ??
            item.plainText ??
            ""
          }
          shell={(item.metadata as { shell?: string })?.shell}
          undoCommand={
            (item.metadata as { undoCommand?: string })?.undoCommand
          }
          onSave={async (data) => {
            await onUpdate({
              metadata: data,
              plainText: data.command,
            });
          }}
        />
      )}

      {item.type === "BOOKMARK" && (
        <BookmarkEditor
          url={(item.metadata as { url?: string })?.url ?? ""}
          title={item.title}
          metadata={(item.metadata as Record<string, unknown>) ?? {}}
          onSave={async (data) => {
            await onUpdate({
              title: data.title,
              plainText: data.plainText,
              metadata: data.metadata,
            });
            completeChecklistTask("bookmark");
          }}
        />
      )}

      {item.type === "PROMPT" && (
        <PromptEditor
          content={
            (item.metadata as { template?: string })?.template ??
            item.plainText ??
            ""
          }
          onSave={async (template) => {
            await onUpdate({
              metadata: { template },
              plainText: template,
            });
          }}
        />
      )}

      {item.type === "FILE" && (
        <EmptyState
          title="This is a file item"
          description="Add the actual file in Attachments below. FILE is a vault entry that holds uploads — it is not a separate storage type."
        />
      )}
    </>
  );
}
