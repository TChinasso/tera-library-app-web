import { create } from 'zustand'

interface ThemeState {
  isDarkMode: boolean
  setDarkMode: (is: boolean) => void
}

export const useThemeStore = create<ThemeState>()((set) => ({
  isDarkMode: false,
  setDarkMode: (is) => set((state) => ({ isDarkMode:  is})),
}))