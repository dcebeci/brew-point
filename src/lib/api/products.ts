import { db } from '@/lib/mock-db'
import type { Product, ProductPayload } from '@/types'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchProducts(): Promise<Product[]> {
  // TODO: backend hazır olunca →
  // return api.get<Product[]>('/products').then((r) => r.data)
  await delay()
  return db.getProducts()
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  // TODO: return api.post<Product>('/products', payload).then((r) => r.data)
  await delay(250)
  return db.createProduct(payload)
}

export async function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<Product> {
  // TODO: return api.put<Product>(`/products/${id}`, payload).then((r) => r.data)
  await delay(250)
  const updated = db.updateProduct(id, payload)
  if (!updated) throw new Error('Product not found: ' + id)
  return updated
}

export async function deleteProduct(id: number): Promise<void> {
  // TODO: return api.delete(`/products/${id}`).then(() => undefined)
  await delay(250)
  db.deleteProduct(id)
}
