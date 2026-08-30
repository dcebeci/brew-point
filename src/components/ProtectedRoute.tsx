import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Girişten sonra kullanıcıyı gitmek istediği sayfaya döndürebilmek için sakla.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}

/** Girişli kullanıcı /login'i görmesin. */
export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
