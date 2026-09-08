import { create } from "zustand";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  createSheetOpen: boolean;
  selectedItemTitle: string | null;
  saveStatus: SaveStatus;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setCreateSheetOpen: (open: boolean) => void;
  setSelectedItemTitle: (title: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  createSheetOpen: false,
  selectedItemTitle: null,
  saveStatus: "idle",
  commandPaletteOpen: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setCreateSheetOpen: (open) => set({ createSheetOpen: open }),
  setSelectedItemTitle: (title) => set({ selectedItemTitle: title }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
