import { db } from '@/lib/mock-db'
import type { Order, OrderQuery, OrderStatus, Page } from '@/types'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Filtreleme + sayfalama şu an istemcide çalışıyor, ama imza backend'in
 * `Page<Order>` sözleşmesiyle birebir aynı — geçiş tek satırlık olacak.
 */
export async function fetchOrders(query: OrderQuery): Promise<Page<Order>> {
  // TODO: backend hazır olunca →
  // return api.get<Page<Order>>('/orders', { params: query }).then((r) => r.data)
  await delay()

  const search = query.search?.trim().toLowerCase() ?? ''

  const filtered = db.getOrders().filter((order) => {
    if (query.status && query.status !== 'ALL' && order.status !== query.status) {
      return false
    }
    if (query.from && order.createdAt.slice(0, 10) < query.from) return false
    if (query.to && order.createdAt.slice(0, 10) > query.to) return false
    if (search) {
      const haystack = [
        order.orderNumber,
        String(order.tableNumber),
        ...order.items.map((item) => item.productName),
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })

  const start = query.page * query.size

  return {
    content: filtered.slice(start, start + query.size),
    page: query.page,
    size: query.size,
    totalElements: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / query.size)),
  }
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<Order> {
  // TODO: backend hazır olunca →
  // return api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data)
  await delay(250)

  const updated = db.updateOrderStatus(id, status)
  if (!updated) throw new Error('Order not found: ' + id)
  return updated
}
