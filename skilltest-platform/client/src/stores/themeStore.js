import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const newTheme = !get().isDark
        set({ isDark: newTheme })
        if (typeof window !== 'undefined') {
          if (newTheme) {
            document.documentElement.classList.add('dark')
            localStorage.theme = 'dark'
          } else {
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
          }
        }
      },
      setTheme: (theme) => {
        set({ isDark: theme === 'dark' })
        if (typeof window !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            localStorage.theme = 'dark'
          } else {
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
          }
        }
      },
      initTheme: () => {
        if (typeof window !== 'undefined') {
          if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            set({ isDark: true })
          } else {
            document.documentElement.classList.remove('dark')
            set({ isDark: false })
          }
        }
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)

