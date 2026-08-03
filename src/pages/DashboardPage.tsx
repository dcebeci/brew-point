import { useTranslation } from 'react-i18next'
import { mockDashboardData } from '@/lib/mock-data'

export function DashboardPage() {
  const { t } = useTranslation()

  const kpis = [
    t('dashboard.mockDashboardData.todaySales'),
    t('dashboard.mockDashboardData.orderCount'),
    t('dashboard.mockDashboardData.avgBasket'),
    t('dashboard.mockDashboardData.activeProducts'),
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">{t('dashboard.title')}</h1>
      <p className="text-neutral-500 text-sm mb-6">
        {t('dashboard.subtitle')}
      </p>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((label) => (
          <div
            key={label}
            className="bg-white border border-neutral-200 rounded-lg p-4"
          >
            <p className="text-xs text-neutral-500 mb-1">{label}</p>
            <p className="text-xl font-semibold">—</p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white border border-neutral-200 rounded-lg p-4 h-64 flex items-center justify-center text-neutral-400 text-sm">
        {t('dashboard.salesTrendPlaceholder')}
      </div>
    </div>
  )
}
