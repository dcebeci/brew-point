import { LogOut, Menu, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'
import { useUiStore } from '@/store/ui-store'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('tr') ? 'en' : 'tr')
  }

  const iconButton =
    'p-1.5 rounded-md text-muted hover:text-fg hover:bg-surface-2 transition-colors'

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="open menu"
          className={iconButton + ' lg:hidden'}
        >
          <Menu size={18} />
        </button>
        <span className="text-sm text-muted truncate">
          {user ? t('navbar.welcome', { email: user.email }) : ''}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="toggle theme"
          title={t('navbar.toggleTheme')}
          className={iconButton}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          onClick={toggleLanguage}
          className="text-sm font-medium text-muted hover:text-fg transition-colors uppercase px-1.5"
        >
          {i18n.language.startsWith('tr') ? 'EN' : 'TR'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors px-1.5"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">{t('navbar.logout')}</span>
        </button>
      </div>
    </header>
  )
}
