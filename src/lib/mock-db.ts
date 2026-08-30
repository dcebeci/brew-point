import type { Order, OrderItem, Product, ProductCategory } from '@/types'

/**
 * Backend hazır olana kadar kullanılan bellek içi sahte veritabanı.
 * Deterministik bir PRNG kullanıyoruz ki her yenilemede grafikler zıplamasın;
 * tarihler ise "bugün"e göre üretiliyor, böylece panel hep güncel görünüyor.
 */
function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const random = createRandom(20260830)

const pick = <T,>(items: readonly T[]): T =>
  items[Math.floor(random() * items.length)]

const between = (min: number, max: number) =>
  Math.floor(random() * (max - min + 1)) + min

const CATALOG: Array<{
  name: string
  category: ProductCategory
  price: number
}> = [
  { name: 'Espresso', category: 'COFFEE', price: 55 },
  { name: 'Americano', category: 'COFFEE', price: 65 },
  { name: 'Latte', category: 'COFFEE', price: 85 },
  { name: 'Cappuccino', category: 'COFFEE', price: 85 },
  { name: 'Flat White', category: 'COFFEE', price: 90 },
  { name: 'Filtre Kahve', category: 'COFFEE', price: 70 },
  { name: 'Iced Latte', category: 'COLD_DRINK', price: 95 },
  { name: 'Cold Brew', category: 'COLD_DRINK', price: 100 },
  { name: 'Limonata', category: 'COLD_DRINK', price: 75 },
  { name: 'Earl Grey', category: 'TEA', price: 45 },
  { name: 'Yeşil Çay', category: 'TEA', price: 45 },
  { name: 'Cheesecake', category: 'DESSERT', price: 130 },
  { name: 'Brownie', category: 'DESSERT', price: 110 },
  { name: 'San Sebastian', category: 'DESSERT', price: 145 },
  { name: 'Avokadolu Tost', category: 'FOOD', price: 165 },
  { name: 'Kruvasan', category: 'FOOD', price: 95 },
]

let products: Product[] = CATALOG.map((item, index) => ({
  id: index + 1,
  name: item.name,
  category: item.category,
  price: item.price,
  stock: between(4, 120),
  active: true,
}))

/** Gün içi yoğunluk eğrisi: sabah ve öğleden sonra iki tepe. */
const HOUR_WEIGHTS: Record<number, number> = {
  8: 3, 9: 6, 10: 8, 11: 7, 12: 9, 13: 10,
  14: 8, 15: 9, 16: 10, 17: 8, 18: 6, 19: 4, 20: 2,
}

const HOUR_POOL = Object.entries(HOUR_WEIGHTS).flatMap(([hour, weight]) =>
  Array.from({ length: weight }, () => Number(hour)),
)

function buildOrders(): Order[] {
  const result: Order[] = []
  let orderId = 1
  let itemId = 1

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - dayOffset)

    const isWeekend = day.getDay() === 0 || day.getDay() === 6
    const orderCount = between(isWeekend ? 18 : 10, isWeekend ? 30 : 22)

    for (let i = 0; i < orderCount; i++) {
      const createdAt = new Date(day)
      createdAt.setHours(pick(HOUR_POOL), between(0, 59), between(0, 59), 0)

      // Bugünün gelecekteki saatleri için sipariş üretme.
      if (createdAt.getTime() > Date.now()) continue

      const items: OrderItem[] = Array.from(
        { length: between(1, 4) },
        (): OrderItem => {
          const product = pick(products)
          return {
            id: itemId++,
            productId: product.id,
            productName: product.name,
            quantity: between(1, 3),
            unitPrice: product.price,
          }
        },
      )

      const totalPrice = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      )

      // Geçmiş günler kapanmış sayılır; bugünün siparişleri akışta olabilir.
      const status = dayOffset === 0
        ? pick(['PENDING', 'PREPARING', 'COMPLETED', 'COMPLETED', 'CANCELLED'] as const)
        : pick(['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED'] as const)

      result.push({
        id: orderId,
        orderNumber: `BP-${String(orderId).padStart(4, '0')}`,
        tableNumber: between(1, 18),
        status,
        items,
        totalPrice,
        createdAt: createdAt.toISOString(),
      })
      orderId++
    }
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

let orders: Order[] = buildOrders()

export const db = {
  getOrders: () => orders,
  getProducts: () => products,

  updateOrderStatus(id: number, status: Order['status']) {
    orders = orders.map((order) =>
      order.id === id ? { ...order, status } : order,
    )
    return orders.find((order) => order.id === id)
  },

  createProduct(payload: Omit<Product, 'id'>) {
    const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const created: Product = { ...payload, id: nextId }
    products = [created, ...products]
    return created
  },

  updateProduct(id: number, payload: Omit<Product, 'id'>) {
    products = products.map((product) =>
      product.id === id ? { ...payload, id } : product,
    )
    return products.find((product) => product.id === id)
  },

  deleteProduct(id: number) {
    products = products.filter((product) => product.id !== id)
  },
}
