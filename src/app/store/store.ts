import { create } from 'zustand';

type Store = {
  isSidebarExpanded: boolean;
  toggleSidebarExpansion: () => void;
};

export const useStore = create<Store>((set) => ({
  isSidebarExpanded: false,
  toggleSidebarExpansion: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));
