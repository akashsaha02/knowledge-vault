"use client";

import {
  HomeOutlined,
  InboxOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/stores/ui-store";

const TABS = [
  { key: "/dashboard", icon: <HomeOutlined />, label: "Home" },
  { key: "/dashboard/search", icon: <SearchOutlined />, label: "Search" },
  { key: "create", icon: <PlusOutlined />, label: "Create" },
  { key: "/dashboard/inbox", icon: <InboxOutlined />, label: "Inbox" },
  { key: "more", icon: <MenuOutlined />, label: "More" },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {TABS.map((tab) => {
        if (tab.key === "create") {
          return (
            <button
              key={tab.key}
              type="button"
              className="mobile-bottom-nav-item mobile-bottom-nav-create"
              aria-label="Create new item"
              onClick={() => setCommandPaletteOpen(true)}
            >
              {tab.icon}
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
              aria-expanded={false}
              onClick={() => setMobileNavOpen(true)}
            >
              {tab.icon}
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
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
