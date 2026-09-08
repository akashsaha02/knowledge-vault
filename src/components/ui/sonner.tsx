"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-[var(--card)] group-[.toaster]:text-[var(--foreground)] group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-[var(--shadow-card)] rounded-[var(--radius-card)]",
        description: "group-[.toast]:text-[var(--muted)]",
        actionButton: "group-[.toast]:bg-[var(--brand)] group-[.toast]:text-white",
        cancelButton: "group-[.toast]:bg-[var(--accent-soft)]",
      },
    }}
    {...props}
  />
);

export { Toaster };
