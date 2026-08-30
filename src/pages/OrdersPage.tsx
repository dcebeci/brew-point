import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateCcw, Search } from 'lucide-react'
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-orders'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useFormatters } from '@/hooks/use-formatters'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { Pagination } from '@/components/ui/Pagination'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { OrderDetailModal } from '@/components/orders/OrderDetailModal'
import { toast } from '@/store/toast-store'
import { ORDER_STATUSES } from '@/types'
import type { OrderStatus } from '@/types'

const PAGE_SIZE = 10

export function OrdersPage() {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const debouncedSearch = useDebouncedValue(search)

  // Filtre değişince ilk sayfaya dön.
  useEffect(() => {
    setPage(0)
  }, [status, debouncedSearch, from, to])

  const query = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      status,
      search: debouncedSearch,
      from: from || undefined,
      to: to || undefined,
    }),
    [page, status, debouncedSearch, from, to],
  )

  const { data, isPending, isError, isFetching, refetch } = useOrders(query)
  const updateStatus = useUpdateOrderStatus()

  const selectedOrder =
    data?.content.find((order) => order.id === selectedId) ?? null

  const hasFilters =
    status !== 'ALL' || search !== '' || from !== '' || to !== ''

  const resetFilters = () => {
    setStatus('ALL')
    setSearch('')
    setFrom('')
    setTo('')
  }

  const handleStatusChange = (id: number, next: OrderStatus) => {
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success(t('orders.toast.statusUpdated')),
        onError: () => toast.error(t('common.actionFailed')),
      },
    )
  }

  return (
    <div>
      <PageHeader title={t('orders.title')} subtitle={t('orders.subtitle')} />

      <Card className="p-4 mb-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
          <Field label={t('orders.filters.search')} className="xl:col-span-2">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('orders.filters.searchPlaceholder')}
                className="pl-8"
              />
            </div>
          </Field>
          <Field label={t('orders.filters.status')}>
            <Select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as OrderStatus | 'ALL')
              }
            >
              <option value="ALL">{t('orders.filters.allStatuses')}</option>
              {ORDER_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {t('orders.status.' + item)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t('orders.filters.from')}>
            <Input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => setFrom(event.target.value)}
            />
          </Field>
          <Field label={t('orders.filters.to')}>
            <Input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => setTo(event.target.value)}
            />
          </Field>
        </div>
        {hasFilters && (
          <div className="mt-3">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw size={13} />
              {t('common.clearFilters')}
            </Button>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        {isError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted mb-3">{t('common.loadError')}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : isPending ? (
          <TableSkeleton />
        ) : data.content.length === 0 ? (
          <EmptyState message={t('orders.empty')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="font-medium px-4 py-2.5">
                      {t('orders.table.orderNumber')}
                    </th>
                    <th className="font-medium px-4 py-2.5">
                      {t('orders.table.table')}
                    </th>
                    <th className="font-medium px-4 py-2.5">
                      {t('orders.table.items')}
                    </th>
                    <th className="font-medium px-4 py-2.5">
                      {t('orders.table.date')}
                    </th>
                    <th className="font-medium px-4 py-2.5">
                      {t('orders.table.status')}
                    </th>
                    <th className="font-medium px-4 py-2.5 text-right">
                      {t('orders.table.total')}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={
                    isFetching ? 'opacity-60 transition-opacity' : undefined
                  }
                >
                  {data.content.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedId(order.id)}
                      className="border-b border-border last:border-0 hover:bg-surface-2 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                        {t('orders.tableNumber', { number: order.tableNumber })}
                      </td>
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                        {t('orders.itemCount', { count: order.items.length })}
                      </td>
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                        {fmt.dateTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                        {fmt.currency(order.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedId(null)}
        onStatusChange={(next) =>
          selectedOrder && handleStatusChange(selectedOrder.id, next)
        }
        isUpdating={updateStatus.isPending}
      />
    </div>
  )
}
