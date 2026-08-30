import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '@/lib/api/products'
import type { ProductPayload } from '@/types'

export const productKeys = {
  all: ['products'] as const,
  list: () => ['products', 'list'] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: fetchProducts,
  })
}

function useInvalidateProducts() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: invalidate,
  })
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: invalidate,
  })
}
