import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva("status-badge", {
  variants: {
    tone: {
      default: "status-badge--default",
      success: "status-badge--success",
      warning: "status-badge--warning",
      danger: "status-badge--danger",
      info: "status-badge--info",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

type StatusBadgeProps = {
  children: ReactNode;
  className?: string;
  showDot?: boolean;
} & VariantProps<typeof statusBadgeVariants>;

export function StatusBadge({
  children,
  tone,
  className,
  showDot = true,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)}>
      {showDot ? <span className="status-badge-dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
