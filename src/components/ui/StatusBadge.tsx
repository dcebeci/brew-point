import { useTranslation } from 'react-i18next'
import type { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING:
    'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  PREPARING:
    'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  COMPLETED:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        STATUS_CLASSES[status],
      )}
    >
      {t('orders.status.' + status)}
    </span>
  )
}
