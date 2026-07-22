import { Button } from "antd";
import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  shortcut?: string;
  className?: string;
};

function ActionButton({
  action,
  type = "default",
}: {
  action: EmptyStateAction;
  type?: "primary" | "default" | "link";
}) {
  if (action.href) {
    return (
      <Link href={action.href}>
        <Button type={type}>{action.label}</Button>
      </Link>
    );
  }

  return (
    <Button type={type} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  shortcut,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      {icon ? <div className="empty-state-icon">{icon}</div> : null}
      <h3 className="empty-state-title">{title}</h3>
      {description ? <p className="empty-state-description">{description}</p> : null}
      {shortcut ? (
        <p className="empty-state-shortcut">
          Shortcut: <kbd>{shortcut}</kbd>
        </p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="empty-state-actions">
          {primaryAction ? (
            <ActionButton action={primaryAction} type="primary" />
          ) : null}
          {secondaryAction ? (
            <ActionButton action={secondaryAction} type="default" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
