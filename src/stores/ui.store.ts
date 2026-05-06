import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'ar';

interface UIState {
  language: Lang;
  sidebarCollapsed: boolean;
  setLanguage: (lang: Lang) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: 'en',
      sidebarCollapsed: false,
      setLanguage: (language) => {
        set({ language });
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    {
      name: 'fawz.ui',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.lang = state.language;
          document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
        }
      },
    },
  ),
);
