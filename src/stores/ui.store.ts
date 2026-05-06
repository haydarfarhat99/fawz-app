import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'ar';
export type DataSource = 'real' | 'mock';

interface UIState {
  language: Lang;
  sidebarCollapsed: boolean;
  dataSource: DataSource;
  mobileSidebarOpen: boolean;
  setLanguage: (lang: Lang) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDataSource: (source: DataSource) => void;
  toggleDataSource: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: 'en',
      sidebarCollapsed: false,
      dataSource: 'real',
      mobileSidebarOpen: false,
      setLanguage: (language) => {
        set({ language });
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      },
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setDataSource: (dataSource) => set({ dataSource }),
      toggleDataSource: () =>
        set((s) => ({ dataSource: s.dataSource === 'real' ? 'mock' : 'real' })),
      openMobileSidebar: () => set({ mobileSidebarOpen: true }),
      closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
    }),
    {
      name: 'fawz.ui',
      partialize: (state) => ({
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        dataSource: state.dataSource,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.lang = state.language;
          document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
        }
      },
    },
  ),
);

export function getDataSource(): DataSource {
  return useUIStore.getState().dataSource;
}
