import { create } from "zustand";
import type { ItemType } from "@/generated/prisma/client";

type SaveStatus = "idle" | "editing" | "saving" | "saved" | "offline" | "error";

interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  activeWorkspaceId: string | null;
  selectedItemId: string | null;
  saveStatus: SaveStatus;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setSelectedItemId: (id: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  quickCreateType: ItemType | null;
  setQuickCreateType: (type: ItemType | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  activeWorkspaceId: null,
  selectedItemId: null,
  saveStatus: "idle",
  commandPaletteOpen: false,
  quickCreateType: null,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setQuickCreateType: (type) => set({ quickCreateType: type }),
}));
