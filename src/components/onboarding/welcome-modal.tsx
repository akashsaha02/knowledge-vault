"use client";

import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <Modal
      open={open}
      title="Welcome to Knowledge Vault"
      onCancel={close}
      footer={[
        <Button key="explore" onClick={close}>
          Explore on my own
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={() => {
            close();
            router.push("/dashboard/notes?new=1");
          }}
        >
          Create your first note
        </Button>,
      ]}
    >
      <p className="text-[var(--muted)] leading-relaxed">
        Store notes, code snippets, terminal commands, bookmarks, and prompts in
        one secure workspace. Use <kbd>Ctrl+K</kbd> to search anything instantly.
      </p>
    </Modal>
  );
}
