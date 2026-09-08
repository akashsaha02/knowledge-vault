import Link from "next/link";
import type { ReactNode } from "react";
import { IconContainer } from "@/components/ui/icon-container";
import { cn } from "@/lib/utils";

type QuickActionProps = {
  href: string;
  icon: ReactNode;
  label: string;
  className?: string;
};

export function QuickAction({ href, icon, label, className }: QuickActionProps) {
  return (
    <Link href={href} className={cn("quick-action", className)}>
      <IconContainer tone="brand" size="sm">
        {icon}
      </IconContainer>
      <span className="quick-action-label">{label}</span>
    </Link>
  );
}
