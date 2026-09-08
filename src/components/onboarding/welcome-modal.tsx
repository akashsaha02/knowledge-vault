"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BRAND_NAME } from "@/lib/brand";
import { dismissWelcome, isWelcomeDismissed } from "@/lib/onboarding-storage";

export function WelcomeModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isWelcomeDismissed()) {
      setOpen(true);
    }
  }, []);

  function close() {
    dismissWelcome();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to {BRAND_NAME}</DialogTitle>
        </DialogHeader>
        <p className="welcome-modal-text">
          Keep notes, code, links and useful things together.
        </p>
        <p className="welcome-modal-text">
          Press ⌘K (or Ctrl+K) anytime to search.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={close}>
            I&apos;ll look around first
          </Button>
          <Button
            onClick={() => {
              close();
              router.push("/dashboard/notes?new=1");
            }}
          >
            Create something
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
