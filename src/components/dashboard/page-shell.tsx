import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";

type PageShellProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  /** Fill available height — used for split-panel item pages. */
  fullHeight?: boolean;
};

export function PageShell({
  title,
  description,
  actions,
  children,
  fullHeight = false,
}: PageShellProps) {
  if (fullHeight) {
    return (
      <div className="page-shell page-shell--full-height">
        <div className="page-shell-body page-shell-body--fill">{children}</div>
      </div>
    );
  }

  const header = (
    <PageHeader title={title} description={description} actions={actions} />
  );

  return (
    <div className="page-shell">
      {header}
      <div className="page-shell-body">{children}</div>
    </div>
  );
}
