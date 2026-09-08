import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary-soft-fg)]",
        secondary:
          "border-transparent bg-[var(--surface-muted)] text-[var(--text-secondary)]",
        outline: "text-[var(--foreground)] border-[var(--border)]",
        success: "border-transparent bg-[var(--success-soft)] text-[var(--success)]",
        warning: "border-transparent bg-[var(--warning-soft)] text-[var(--warning)]",
        danger: "border-transparent bg-[var(--danger-soft)] text-[var(--danger)]",
        info: "border-transparent bg-[var(--info-soft)] text-[var(--info)]",
        note: "border-transparent bg-[var(--tag-bg)] text-[var(--tag-text)]",
        link: "border-transparent bg-[var(--tag-bg)] text-[var(--tag-text)]",
        code: "border-transparent bg-[var(--tag-bg)] text-[var(--tag-text)]",
        file: "border-transparent bg-[var(--tag-bg)] text-[var(--tag-text)]",
        project:
          "border-transparent bg-[var(--tag-bg)] text-[var(--tag-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
