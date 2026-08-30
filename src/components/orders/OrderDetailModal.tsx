import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Field'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useFormatters } from '@/hooks/use-formatters'
import { ORDER_STATUSES } from '@/types'
import type { Order, OrderStatus } from '@/types'

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
  onStatusChange: (status: OrderStatus) => void
  isUpdating: boolean
}

export function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  isUpdating,
}: OrderDetailModalProps) {
  const { t } = useTranslation()
  const fmt = useFormatters()

  if (!order) return null

  return (
    <Modal
      open
      onClose={onClose}
      title={t('orders.detail.title', { orderNumber: order.orderNumber })}
      description={fmt.dateTime(order.createdAt)}
      footer={<Button variant="secondary" onClick={onClose}>{t('common.close')}</Button>}
    >
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs text-muted mb-1">{t('orders.table.table')}</p>
          <p className="text-sm font-medium">
            {t('orders.tableNumber', { number: order.tableNumber })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">{t('orders.table.status')}</p>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted mb-2">{t('orders.detail.items')}</p>
      <ul className="border border-border rounded-lg divide-y divide-border mb-5">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted tabular-nums shrink-0">
                {item.quantity}x
              </span>
              <span className="truncate">{item.productName}</span>
            </span>
            <span className="tabular-nums shrink-0">
              {fmt.currency(item.quantity * item.unitPrice)}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold bg-surface-2">
          <span>{t('orders.detail.total')}</span>
          <span className="tabular-nums">{fmt.currency(order.totalPrice)}</span>
        </li>
      </ul>

      <label className="block text-sm font-medium mb-1">
        {t('orders.detail.updateStatus')}
      </label>
      <Select
        value={order.status}
        disabled={isUpdating}
        onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {t('orders.status.' + status)}
          </option>
        ))}
      </Select>
    </Modal>
  )
}
