import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface UiState {
  theme: Theme
  /** Mobilde sidebar drawer'ı açık mı. */
  sidebarOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'brew-point-ui',
      // Drawer durumu kalıcı olmamalı; sadece tema saklanır.
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
