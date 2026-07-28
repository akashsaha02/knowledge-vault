"use client";

import { BookOpen, Home, Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SimpleCreateSheet } from "@/components/dashboard/simple-create-sheet";
import { useUiStore } from "@/stores/ui-store";

const ICON_SIZE = 20;

const TABS = [
  { key: "/dashboard", icon: Home, label: "Home" },
  { key: "/dashboard/notes", icon: BookOpen, label: "Notes" },
  { key: "create", icon: Plus, label: "New" },
  { key: "/dashboard/search", icon: Search, label: "Search" },
  { key: "more", icon: Menu, label: "More" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const createSheetOpen = useUiStore((s) => s.createSheetOpen);
  const setCreateSheetOpen = useUiStore((s) => s.setCreateSheetOpen);

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {TABS.map((tab) => {
          const Icon = tab.icon;

          if (tab.key === "create") {
            return (
              <button
                key={tab.key}
                type="button"
                className="mobile-bottom-nav-item mobile-bottom-nav-create"
                aria-label="Create something new"
                onClick={() => setCreateSheetOpen(true)}
              >
                <Icon size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          }

          if (tab.key === "more") {
            return (
              <button
                key={tab.key}
                type="button"
                className="mobile-bottom-nav-item"
                aria-label="Open navigation menu"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(true)}
              >
                <Icon size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          }

          const isActive =
            tab.key === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.key);

          return (
            <Link
              key={tab.key}
              href={tab.key}
              className={`mobile-bottom-nav-item ${isActive ? "mobile-bottom-nav-item-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <SimpleCreateSheet
        open={createSheetOpen}
        onClose={() => setCreateSheetOpen(false)}
      />
    </>
  );
}
