import Link from "next/link";
import type { ReactNode } from "react";

type QuickActionCardProps = {
  href: string;
  icon: ReactNode;
  label: string;
  description: string;
  variant: "note" | "link" | "file" | "project";
};

export function QuickActionCard({
  href,
  icon,
  label,
  description,
  variant,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`quick-action-card quick-action-card-${variant}`}
    >
      <span className="quick-action-card-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="quick-action-card-label">{label}</span>
      <span className="quick-action-card-desc">{description}</span>
    </Link>
  );
}
