"use client";

import {
  ChevronDown,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateMenu } from "@/components/dashboard/create-menu";
import { SearchShortcutKbd } from "@/components/dashboard/search-shortcut-kbd";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { useTheme } from "@/components/providers/theme-context";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useUiStore } from "@/stores/ui-store";

export function DashboardHeader({
  userName,
  userImage,
  workspaceId,
  workspaceName,
  workspaceCount = 1,
}: {
  userName: string;
  userImage?: string | null;
  workspaceId: string;
  workspaceName?: string;
  workspaceCount?: number;
}) {
  const router = useRouter();
  const { preference, setPreference } = useTheme();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-inner">
        <div className="dashboard-header-left">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          <Breadcrumbs />
        </div>

        <div className="dashboard-header-center hidden sm:flex">
          <button
            type="button"
            className="dashboard-search-btn"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Search Nook"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline flex-1 text-left">Search Nook...</span>
            <SearchShortcutKbd />
          </button>
        </div>

        <div className="dashboard-header-right">
          {workspaceCount > 1 ? (
            <WorkspaceSwitcher
              currentWorkspaceId={workspaceId}
              currentWorkspaceName={workspaceName ?? "Workspace"}
            />
          ) : null}
          <button
            type="button"
            className="dashboard-search-btn sm:hidden"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Search Nook"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="hidden md:block">
            <CreateMenu />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="dashboard-user-btn" aria-label="Account menu">
                <UserAvatar name={userName} image={userImage} size="sm" />
                <span className="dashboard-user-name">{userName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--muted)] hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPreference("light")}>
                <Sun className="h-4 w-4" />
                Light{preference === "light" ? " ·" : ""}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreference("dark")}>
                <Moon className="h-4 w-4" />
                Dark{preference === "dark" ? " ·" : ""}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreference("system")}>
                <Monitor className="h-4 w-4" />
                System{preference === "system" ? " ·" : ""}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/sign-in");
                  router.refresh();
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
