"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBreadcrumbSegments } from "@/lib/nav-config";
import { useUiStore } from "@/stores/ui-store";

export function Breadcrumbs() {
  const pathname = usePathname();
  const selectedItemTitle = useUiStore((s) => s.selectedItemTitle);
  const segments = getBreadcrumbSegments(pathname);

  if (segments.length <= 1 && !selectedItemTitle) return null;

  const allSegments = selectedItemTitle
    ? [...segments, { href: pathname, label: selectedItemTitle }]
    : segments;

  return (
    <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
      <ol className="dashboard-breadcrumbs-list">
        {allSegments.map((segment, index) => {
          const isLast = index === allSegments.length - 1;
          return (
            <li key={`${segment.href}-${segment.label}`} className="dashboard-breadcrumbs-item">
              {isLast ? (
                <span aria-current="page">{segment.label}</span>
              ) : (
                <Link href={segment.href}>{segment.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
