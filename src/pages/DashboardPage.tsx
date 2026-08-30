import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Coffee, Receipt, ShoppingBag, Wallet } from 'lucide-react'
import { useDashboardSummary } from '@/hooks/use-dashboard'
import { useFormatters } from '@/hooks/use-formatters'
import { KpiCard, KpiCardSkeleton } from '@/components/dashboard/KpiCard'
import {
  CategoryBreakdownChart,
  HourlyTrafficChart,
  SalesTrendChart,
  TopProductsChart,
} from '@/components/dashboard/DashboardCharts'
import { Card, CardHeader } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton'

function ChartCard({
  title,
  description,
  loading,
  height,
  children,
}: {
  title: string
  description?: string
  loading: boolean
  height: number
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <div className="px-4 pb-4">
        {loading ? (
          <Skeleton style={{ height }} className="w-full" />
        ) : (
          children
        )}
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { t } = useTranslation()
  const fmt = useFormatters()
  const { data, isPending, isError, refetch } = useDashboardSummary(30)

  const deltaLabel = t('dashboard.vsYesterday')

  return (
    <div>
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      {isError ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted mb-3">{t('common.loadError')}</p>
          <button
            onClick={() => refetch()}
            className="text-sm font-medium text-brand hover:underline"
          >
            {t('common.retry')}
          </button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {isPending || !data ? (
              Array.from({ length: 4 }, (_, index) => (
                <KpiCardSkeleton key={index} />
              ))
            ) : (
              <>
                <KpiCard
                  label={t('dashboard.kpi.todaySales')}
                  value={fmt.currency(data.kpis.todaySales)}
                  icon={Wallet}
                  delta={data.kpis.todaySalesDelta}
                  deltaLabel={deltaLabel}
                />
                <KpiCard
                  label={t('dashboard.kpi.orderCount')}
                  value={fmt.number(data.kpis.orderCount)}
                  icon={Receipt}
                  delta={data.kpis.orderCountDelta}
                  deltaLabel={deltaLabel}
                />
                <KpiCard
                  label={t('dashboard.kpi.avgBasket')}
                  value={fmt.currency(data.kpis.avgBasket)}
                  icon={ShoppingBag}
                  delta={data.kpis.avgBasketDelta}
                  deltaLabel={deltaLabel}
                />
                <KpiCard
                  label={t('dashboard.kpi.activeProducts')}
                  value={fmt.number(data.kpis.activeProducts)}
                  icon={Coffee}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 mt-4 grid-cols-1 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ChartCard
                title={t('dashboard.charts.salesTrend')}
                description={t('dashboard.charts.salesTrendHint')}
                loading={isPending || !data}
                height={260}
              >
                {data && <SalesTrendChart data={data.salesTrend} />}
              </ChartCard>
            </div>
            <ChartCard
              title={t('dashboard.charts.topProducts')}
              description={t('dashboard.charts.topProductsHint')}
              loading={isPending || !data}
              height={260}
            >
              {data && <TopProductsChart data={data.topProducts} />}
            </ChartCard>
          </div>

          <div className="grid gap-4 mt-4 grid-cols-1 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ChartCard
                title={t('dashboard.charts.hourlyTraffic')}
                description={t('dashboard.charts.hourlyTrafficHint')}
                loading={isPending || !data}
                height={220}
              >
                {data && <HourlyTrafficChart data={data.hourlyTraffic} />}
              </ChartCard>
            </div>
            <ChartCard
              title={t('dashboard.charts.categoryBreakdown')}
              description={t('dashboard.charts.categoryBreakdownHint')}
              loading={isPending || !data}
              height={220}
            >
              {data && <CategoryBreakdownChart data={data.categoryBreakdown} />}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}
