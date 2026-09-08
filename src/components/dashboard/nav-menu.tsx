"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navIcon } from "@/lib/nav-icons";
import {
  COLLAPSED_MORE_NAV,
  getSelectedNavKey,
  MORE_NAV,
  NAV_GROUPS,
} from "@/lib/nav-config";
import { cn } from "@/lib/utils";

type DashboardNavMenuProps = {
  onNavigate?: () => void;
  collapsed?: boolean;
};

function NavLink({
  href,
  label,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = navIcon(href);
  return (
    <Link
      href={href}
      className={cn(
        "nav-link",
        active && "nav-link--active",
        collapsed && "nav-link--collapsed",
      )}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
    >
      {Icon}
      {!collapsed ? <span>{label}</span> : null}
    </Link>
  );
}

export function DashboardNavMenu({
  onNavigate,
  collapsed = false,
}: DashboardNavMenuProps) {
  const pathname = usePathname();
  const selectedKey = getSelectedNavKey(pathname);
  const isInMore = MORE_NAV.some((item) => item.key === selectedKey);
  const [moreOpen, setMoreOpen] = useState(isInMore);

  return (
    <div className="dashboard-nav-menu">
      <div className="dashboard-nav-main">
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="nav-group">
            {group.label && !collapsed ? (
              <p className="nav-group-label">{group.label}</p>
            ) : null}
            {group.items.map((item) => (
              <NavLink
                key={item.key}
                href={item.key}
                label={item.label}
                active={selectedKey === item.key}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}

        {!collapsed ? (
          <>
            <button
              type="button"
              className={cn("nav-link w-full", isInMore && "nav-link--active")}
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
            >
              {navIcon("more")}
              <span className="flex-1 text-left">More</span>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")}
              />
            </button>
            {moreOpen ? (
              <div className="nav-more-children">
                {MORE_NAV.map((item) => (
                  <NavLink
                    key={item.key}
                    href={item.key}
                    label={item.label}
                    active={selectedKey === item.key}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {COLLAPSED_MORE_NAV.map((item) => (
              <NavLink
                key={item.key}
                href={item.key}
                label={item.label}
                active={selectedKey === item.key}
                collapsed
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
