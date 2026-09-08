"use client";

import { FriendlyConfirmDialog } from "@/components/ui/friendly-confirm-dialog";

type ItemDeleteTarget = {
  id: string;
  title: string;
};

type ItemDeleteDialogsProps = {
  trashOpen: boolean;
  permanentOpen: boolean;
  cardTarget: ItemDeleteTarget | null;
  onConfirmTrash: () => Promise<void> | void;
  onConfirmPermanent: () => Promise<void> | void;
  onConfirmCardTrash: () => Promise<void> | void;
  onCancelTrash: () => void;
  onCancelPermanent: () => void;
  onCancelCard: () => void;
};

export function ItemDeleteDialogs({
  trashOpen,
  permanentOpen,
  cardTarget,
  onConfirmTrash,
  onConfirmPermanent,
  onConfirmCardTrash,
  onCancelTrash,
  onCancelPermanent,
  onCancelCard,
}: ItemDeleteDialogsProps) {
  return (
    <>
      <FriendlyConfirmDialog
        open={permanentOpen}
        title="Delete permanently?"
        description="This cannot be undone. The item will be removed forever."
        confirmLabel="Delete permanently"
        cancelLabel="Keep in Trash"
        danger
        onConfirm={onConfirmPermanent}
        onCancel={onCancelPermanent}
      />
      <FriendlyConfirmDialog
        open={trashOpen}
        title="Move to Trash?"
        description="You can bring it back later from the Trash section."
        confirmLabel="Move to Trash"
        cancelLabel="Keep it"
        danger
        onConfirm={onConfirmTrash}
        onCancel={onCancelTrash}
      />
      <FriendlyConfirmDialog
        open={Boolean(cardTarget)}
        title="Move to Trash?"
        description={
          cardTarget
            ? `"${cardTarget.title}" will be moved to Trash. You can restore it later.`
            : ""
        }
        confirmLabel="Move to Trash"
        cancelLabel="Keep it"
        danger
        onConfirm={onConfirmCardTrash}
        onCancel={onCancelCard}
      />
    </>
  );
}
