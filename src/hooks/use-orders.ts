import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrders, updateOrderStatus } from '@/lib/api/orders'
import type { OrderQuery, OrderStatus } from '@/types'

export const orderKeys = {
  all: ['orders'] as const,
  list: (query: OrderQuery) => ['orders', 'list', query] as const,
}

export function useOrders(query: OrderQuery) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => fetchOrders(query),
    // Sayfa değişiminde tabloyu boşaltmak yerine önceki veriyi göster.
    placeholderData: (previous) => previous,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
