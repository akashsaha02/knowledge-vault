"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navIcon } from "@/lib/nav-icons";
import {
  BOTTOM_NAV,
  COLLAPSED_MORE_NAV,
  getSelectedNavKey,
  MAIN_NAV,
  MORE_NAV,
} from "@/lib/nav-config";
import { cn } from "@/lib/utils";

type DashboardNavMenuProps = {
  onNavigate?: () => void;
  showBottomNav?: boolean;
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
  showBottomNav = true,
  collapsed = false,
}: DashboardNavMenuProps) {
  const pathname = usePathname();
  const selectedKey = getSelectedNavKey(pathname);
  const isInMore = MORE_NAV.some((item) => item.key === selectedKey);
  const [moreOpen, setMoreOpen] = useState(isInMore);

  return (
    <div className="dashboard-nav-menu">
      <div className="dashboard-nav-main">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.key}
            href={item.key}
            label={item.label}
            active={selectedKey === item.key}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
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

      {showBottomNav && !collapsed ? (
        <div className="dashboard-nav-bottom">
          {BOTTOM_NAV.map((item) => (
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
      ) : null}
    </div>
  );
}
