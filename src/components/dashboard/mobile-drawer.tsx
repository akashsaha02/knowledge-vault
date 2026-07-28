"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { DashboardNavMenu } from "@/components/dashboard/nav-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUiStore } from "@/stores/ui-store";

export function MobileDrawer() {
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
