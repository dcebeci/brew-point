import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ClipboardList,
  Coffee,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { t } = useTranslation()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/orders', label: t('nav.orders'), icon: ClipboardList },
    { to: '/products', label: t('nav.products'), icon: Coffee },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ]

  return (
    <>
      {/* Mobil drawer arka planı */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'w-60 shrink-0 border-r border-border bg-surface flex flex-col',
          // Mobilde kayan panel, lg ve üstünde sabit sütun.
          'fixed inset-y-0 left-0 z-40 transition-transform duration-200',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <Coffee size={19} className="text-brand" />
            Brew Point
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="close menu"
            className="lg:hidden text-muted hover:text-fg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand text-brand-fg'
                    : 'text-muted hover:bg-surface-2 hover:text-fg',
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-3 border-t border-border">
          <p className="text-[11px] text-muted">{t('nav.demoBadge')}</p>
        </div>
      </aside>
    </>
  )
}
