import type { ReactNode } from "react";

type PageHeaderProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  if (!title && !description && !actions) return null;

  return (
    <header className="page-shell-header">
      <div className="page-shell-header-text">
        {title ? <h1 className="page-shell-title">{title}</h1> : null}
        {description ? (
          <p className="page-shell-description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="page-shell-actions">{actions}</div> : null}
    </header>
  );
}
