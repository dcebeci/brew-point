import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, ClipboardList, Coffee, Settings } from 'lucide-react'

export function Sidebar() {
  const { t } = useTranslation()

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/orders', label: t('nav.orders'), icon: ClipboardList },
    { to: '/products', label: t('nav.products'), icon: Coffee },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ]

  return (
    <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-neutral-200">
        <span className="font-semibold text-lg tracking-tight">
          ☕ Brew Point
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
