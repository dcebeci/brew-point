import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Coffee, Settings } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Siparişler', icon: ClipboardList },
  { to: '/products', label: 'Menü', icon: Coffee },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
]

export function Sidebar() {
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
