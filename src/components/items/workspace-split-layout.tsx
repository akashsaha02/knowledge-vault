import type { ReactNode } from "react";

type WorkspaceSplitLayoutProps = {
  sidebar: ReactNode;
  detail: ReactNode;
  footer?: ReactNode;
};

export function WorkspaceSplitLayout({
  sidebar,
  detail,
  footer,
}: WorkspaceSplitLayoutProps) {
  return (
    <div className="workspace-page">
      <div className="item-workspace item-workspace-split">
        {sidebar}
        <main className="item-workspace-detail">{detail}</main>
      </div>
      {footer}
    </div>
  );
}
