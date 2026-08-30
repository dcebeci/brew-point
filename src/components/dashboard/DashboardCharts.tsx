import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useFormatters } from '@/hooks/use-formatters'
import { ChartTooltip } from './ChartTooltip'
import type {
  CategoryBreakdownPoint,
  HourlyTrafficPoint,
  SalesTrendPoint,
  TopProductPoint,
} from '@/types'

const AXIS_TICK = { fill: 'var(--color-muted)', fontSize: 11 }
const GRID_STROKE = 'var(--color-chart-grid)'

const CATEGORY_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

export function SalesTrendChart({ data }: { data: SalesTrendPoint[] }) {
  const fmt = useFormatters()

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_STROKE} vertical={false} />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tickFormatter={fmt.date}
        />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={fmt.currency}
        />
        <Tooltip
          cursor={{ stroke: GRID_STROKE }}
          content={
            <ChartTooltip formatValue={fmt.currency} labelFormatter={fmt.date} />
          }
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="url(#salesFill)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function TopProductsChart({ data }: { data: TopProductPoint[] }) {
  const fmt = useFormatters()

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
      >
        <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
        <XAxis type="number" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={96}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-surface-2)' }}
          content={<ChartTooltip formatValue={fmt.number} />}
        />
        <Bar
          dataKey="sold"
          fill="var(--color-chart-2)"
          radius={[0, 4, 4, 0]}
          barSize={18}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function HourlyTrafficChart({ data }: { data: HourlyTrafficPoint[] }) {
  const fmt = useFormatters()

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID_STROKE} vertical={false} />
        <XAxis
          dataKey="hour"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          interval={1}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={48} />
        <Tooltip
          cursor={{ fill: 'var(--color-surface-2)' }}
          content={<ChartTooltip formatValue={fmt.number} />}
        />
        <Bar
          dataKey="orders"
          fill="var(--color-chart-3)"
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CategoryBreakdownChart({
  data,
}: {
  data: CategoryBreakdownPoint[]
}) {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const chartData = data.map((item) => ({
    name: t('products.category.' + item.category),
    value: item.revenue,
  }))

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      {/* Sabit genişlik: flex satırında ResponsiveContainer'ın ezilmemesi için. */}
      <div className="w-[180px] h-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={44}
              outerRadius={78}
              paddingAngle={2}
              stroke="var(--color-surface)"
              isAnimationActive={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatValue={fmt.currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 min-w-0 w-full space-y-1.5">
        {chartData.map((item, index) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex items-center gap-2 text-muted">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                }}
              />
              {item.name}
            </span>
            <span className="font-medium tabular-nums">
              {fmt.currency(item.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
