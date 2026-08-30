import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-2', className)}
      style={style}
    />
  )
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  )
}
