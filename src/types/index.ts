export type UserRole = 'ADMIN' | 'STAFF'

export const ORDER_STATUSES = [
  'PENDING',
  'PREPARING',
  'COMPLETED',
  'CANCELLED',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const PRODUCT_CATEGORIES = [
  'COFFEE',
  'COLD_DRINK',
  'TEA',
  'DESSERT',
  'FOOD',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  orderNumber: string
  tableNumber: number
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  createdAt: string
}

export interface Product {
  id: number
  name: string
  category: ProductCategory
  price: number
  stock: number
  active: boolean
}

/** Spring Boot `Page<T>` yanıtıyla aynı şekil — backend bağlanınca tip değişmeyecek. */
export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface OrderQuery {
  page: number
  size: number
  status?: OrderStatus | 'ALL'
  search?: string
  from?: string
  to?: string
}

export interface DashboardKpis {
  todaySales: number
  orderCount: number
  avgBasket: number
  activeProducts: number
  /** Bir önceki döneme göre yüzde değişim. */
  todaySalesDelta: number
  orderCountDelta: number
  avgBasketDelta: number
}

export interface SalesTrendPoint {
  date: string
  sales: number
  orders: number
}

export interface TopProductPoint {
  name: string
  sold: number
  revenue: number
}

export interface HourlyTrafficPoint {
  hour: string
  orders: number
}

export interface CategoryBreakdownPoint {
  category: ProductCategory
  revenue: number
}

export interface DashboardSummary {
  kpis: DashboardKpis
  salesTrend: SalesTrendPoint[]
  topProducts: TopProductPoint[]
  hourlyTraffic: HourlyTrafficPoint[]
  categoryBreakdown: CategoryBreakdownPoint[]
}

export interface ProductPayload {
  name: string
  category: ProductCategory
  price: number
  stock: number
  active: boolean
}

/** Bu eşiğin altındaki stok "düşük stok" rozetiyle işaretlenir. */
export const LOW_STOCK_THRESHOLD = 15
