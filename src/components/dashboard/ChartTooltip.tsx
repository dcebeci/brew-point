interface TooltipEntry {
  name?: string | number
  value?: string | number
  color?: string
  dataKey?: string | number
}

interface ChartTooltipProps {
  active?: boolean
  label?: string | number
  payload?: TooltipEntry[]
  /** Değerleri biçimlendirmek için (ör. para birimi). */
  formatValue?: (value: number) => string
  labelFormatter?: (label: string) => string
}

export function ChartTooltip({
  active,
  label,
  payload,
  formatValue,
  labelFormatter,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const heading = typeof label === 'string' && labelFormatter
    ? labelFormatter(label)
    : label

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg px-3 py-2">
      {heading !== undefined && (
        <p className="text-xs font-medium mb-1">{heading}</p>
      )}
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-muted flex items-center gap-1.5">
          {entry.color && (
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
          )}
          <span className="text-fg font-medium">
            {formatValue ? formatValue(Number(entry.value)) : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}
