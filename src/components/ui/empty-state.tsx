import { Inbox } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  EmptyStateIllustration,
  type IllustrationName,
} from "@/components/ui/illustration";

type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateSize = "sm" | "md" | "lg";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  illustration?: IllustrationName;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  shortcut?: string;
  size?: EmptyStateSize;
  className?: string;
};

function ActionButton({
  action,
  variant = "secondary",
}: {
  action: EmptyStateAction;
  variant?: "default" | "secondary" | "link";
}) {
  if (action.href) {
    return (
      <Button variant={variant} size="lg" asChild>
        <Link href={action.href}>{action.label}</Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} size="lg" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  illustration,
  primaryAction,
  secondaryAction,
  shortcut,
  size = "md",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`empty-state empty-state--${size} ${className}`.trim()}
      role="status"
    >
      <div className="empty-state-visual" aria-hidden="true">
        {illustration ? (
          <EmptyStateIllustration name={illustration} />
        ) : (
          <div className="empty-state-icon">{icon ?? <Inbox size={24} strokeWidth={1.5} />}</div>
        )}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description ? (
        <p className="empty-state-description">{description}</p>
      ) : null}
      {shortcut ? (
        <p className="empty-state-shortcut">
          Tip: press <kbd>{shortcut}</kbd>
        </p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="empty-state-actions">
          {primaryAction ? (
            <ActionButton action={primaryAction} variant="default" />
          ) : null}
          {secondaryAction ? (
            <ActionButton action={secondaryAction} variant="secondary" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
