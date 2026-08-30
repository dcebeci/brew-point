import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/Toaster'
import { useApplyTheme } from '@/hooks/use-theme'

/*
  Panel sayfaları route bazında lazy yükleniyor — özellikle Recharts'ı içeren
  dashboard chunk'ı giriş ekranının paketini şişirmesin diye.
*/
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const OrdersPage = lazy(() =>
  import('@/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })),
)
const ProductsPage = lazy(() =>
  import('@/pages/ProductsPage').then((m) => ({ default: m.ProductsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function App() {
  useApplyTheme()

  return (
    <>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App
