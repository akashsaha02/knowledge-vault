"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { DashboardNavMenu } from "@/components/dashboard/nav-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUiStore } from "@/stores/ui-store";
import { Settings } from "lucide-react";
import Link from "next/link";

export function MobileDrawer({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <Sheet open={open} onOpenChange={setMobileNavOpen}>
      <SheetContent
        side="left"
        className="mobile-nav-drawer w-[280px] max-w-[280px] p-4"
      >
        <SheetHeader className="p-0 text-left">
          <SheetTitle className="p-0">
            <BrandLogo
              href="/dashboard"
              variant="lockup"
              className="sider-brand-drawer-logo"
              onNavigate={() => setMobileNavOpen(false)}
            />
          </SheetTitle>
        </SheetHeader>
        <div className="mobile-drawer-content">
          <div className="sider-quick-actions">
            <CreateMenu block onNavigate={() => setMobileNavOpen(false)} />
          </div>
          <DashboardNavMenu onNavigate={() => setMobileNavOpen(false)} />
          <div className="sider-footer">
            <Link
              href="/dashboard/settings"
              className="nav-link"
              onClick={() => setMobileNavOpen(false)}
            >
              <Settings size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>Settings</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="sider-profile"
              onClick={() => setMobileNavOpen(false)}
            >
              <UserAvatar name={userName} image={userImage} size="sm" />
              <span className="sider-profile-copy">
                <span className="sider-profile-name">{userName}</span>
                <span className="sider-profile-meta">Account &amp; theme</span>
              </span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
