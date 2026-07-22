"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBreadcrumbSegments } from "@/lib/nav-config";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = getBreadcrumbSegments(pathname);

  if (segments.length <= 1) return null;

  return (
    <nav className="dashboard-breadcrumbs" aria-label="Breadcrumb">
      <ol className="dashboard-breadcrumbs-list">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={segment.href} className="dashboard-breadcrumbs-item">
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
