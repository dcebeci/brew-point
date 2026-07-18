import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
      <span className="text-sm text-neutral-500">
        Hoş geldin{user ? `, ${user.email}` : ''}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <LogOut size={15} />
        Çıkış yap
      </button>
    </header>
  )
}
