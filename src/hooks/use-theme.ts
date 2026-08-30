import { useEffect } from 'react'
import { useUiStore } from '@/store/ui-store'

/** Seçili temayı <html> üzerindeki `dark` class'ına yansıtır. */
export function useApplyTheme() {
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
}
