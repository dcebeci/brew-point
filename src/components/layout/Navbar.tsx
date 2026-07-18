import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')
  }

  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
      <span className="text-sm text-neutral-500">
        {user ? t('navbar.welcome', { email: user.email }) : ''}
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors uppercase"
        >
          {i18n.language === 'tr' ? 'EN' : 'TR'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <LogOut size={15} />
          {t('navbar.logout')}
        </button>
      </div>
    </header>
  )
}
