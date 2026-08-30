import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useFormatters } from '@/hooks/use-formatters'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Bir önceki güne göre yüzde değişim; verilmezse trend satırı gizlenir. */
  delta?: number
  deltaLabel?: string
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
}: KpiCardProps) {
  const fmt = useFormatters()
  const isUp = (delta ?? 0) >= 0

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted">{label}</p>
        <span className="text-brand bg-brand-soft rounded-md p-1.5">
          <Icon size={15} />
        </span>
      </div>
      <p className="text-2xl font-semibold mt-2 tabular-nums">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            'text-xs mt-1.5 flex items-center gap-1',
            isUp
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400',
          )}
        >
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span className="tabular-nums">{fmt.percent(delta)}</span>
          {deltaLabel && <span className="text-muted">{deltaLabel}</span>}
        </p>
      )}
    </Card>
  )
}

export function KpiCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-28 mt-3" />
      <Skeleton className="h-3 w-24 mt-3" />
    </Card>
  )
}
