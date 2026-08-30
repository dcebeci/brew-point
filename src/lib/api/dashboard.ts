import { db } from '@/lib/mock-db'
import type {
  CategoryBreakdownPoint,
  DashboardSummary,
  HourlyTrafficPoint,
  Order,
  SalesTrendPoint,
  TopProductPoint,
} from '@/types'

/** Sahte ağ gecikmesi — loading state'lerini gerçekçi göstermek için. */
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

const isRevenue = (order: Order) => order.status !== 'CANCELLED'

const toDayKey = (iso: string) => iso.slice(0, 10)

function percentDelta(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

export async function fetchDashboardSummary(
  days = 30,
): Promise<DashboardSummary> {
  // TODO: backend hazır olunca →
  // return api.get<DashboardSummary>('/analytics/summary', { params: { days } }).then((r) => r.data)
  await delay()

  const orders = db.getOrders()
  const products = db.getProducts()

  const todayKey = toDayKey(new Date().toISOString())
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = toDayKey(yesterday.toISOString())

  const revenueOrders = orders.filter(isRevenue)
  const todayOrders = revenueOrders.filter(
    (order) => toDayKey(order.createdAt) === todayKey,
  )
  const yesterdayOrders = revenueOrders.filter(
    (order) => toDayKey(order.createdAt) === yesterdayKey,
  )

  const sum = (list: Order[]) =>
    list.reduce((total, order) => total + order.totalPrice, 0)

  const todaySales = sum(todayOrders)
  const yesterdaySales = sum(yesterdayOrders)
  const avgBasket = todayOrders.length ? todaySales / todayOrders.length : 0
  const yesterdayAvgBasket = yesterdayOrders.length
    ? yesterdaySales / yesterdayOrders.length
    : 0

  // Satış trendi — son `days` gün; sipariş olmayan günler 0 ile doldurulur.
  const trendMap = new Map<string, SalesTrendPoint>()
  for (let offset = days - 1; offset >= 0; offset--) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - offset)
    const key = toDayKey(day.toISOString())
    trendMap.set(key, { date: key, sales: 0, orders: 0 })
  }
  for (const order of revenueOrders) {
    const point = trendMap.get(toDayKey(order.createdAt))
    if (!point) continue
    point.sales += order.totalPrice
    point.orders += 1
  }

  // En çok satan ürünler
  const productTotals = new Map<string, TopProductPoint>()
  for (const order of revenueOrders) {
    for (const item of order.items) {
      const entry = productTotals.get(item.productName) ?? {
        name: item.productName,
        sold: 0,
        revenue: 0,
      }
      entry.sold += item.quantity
      entry.revenue += item.quantity * item.unitPrice
      productTotals.set(item.productName, entry)
    }
  }
  const topProducts = [...productTotals.values()]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)

  // Saatlik yoğunluk (08:00 - 21:00)
  const hourlyTraffic: HourlyTrafficPoint[] = Array.from(
    { length: 14 },
    (_, index) => ({
      hour: String(index + 8).padStart(2, '0') + ':00',
      orders: 0,
    }),
  )
  for (const order of revenueOrders) {
    const hour = new Date(order.createdAt).getHours()
    const slot = hourlyTraffic[hour - 8]
    if (slot) slot.orders += 1
  }

  // Kategori bazlı ciro
  const categoryById = new Map(products.map((p) => [p.id, p.category]))
  const categoryTotals = new Map<string, CategoryBreakdownPoint>()
  for (const order of revenueOrders) {
    for (const item of order.items) {
      const category = categoryById.get(item.productId)
      if (!category) continue
      const entry = categoryTotals.get(category) ?? { category, revenue: 0 }
      entry.revenue += item.quantity * item.unitPrice
      categoryTotals.set(category, entry)
    }
  }

  return {
    kpis: {
      todaySales,
      orderCount: todayOrders.length,
      avgBasket,
      activeProducts: products.filter((product) => product.active).length,
      todaySalesDelta: percentDelta(todaySales, yesterdaySales),
      orderCountDelta: percentDelta(todayOrders.length, yesterdayOrders.length),
      avgBasketDelta: percentDelta(avgBasket, yesterdayAvgBasket),
    },
    salesTrend: [...trendMap.values()],
    topProducts,
    hourlyTraffic,
    categoryBreakdown: [...categoryTotals.values()].sort(
      (a, b) => b.revenue - a.revenue,
    ),
  }
}
