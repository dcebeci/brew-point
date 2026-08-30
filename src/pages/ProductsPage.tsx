import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/hooks/use-products'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useFormatters } from '@/hooks/use-formatters'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductFormModal } from '@/components/products/ProductFormModal'
import { ConfirmDialog } from '@/components/products/ConfirmDialog'
import { toast } from '@/store/toast-store'
import { LOW_STOCK_THRESHOLD, PRODUCT_CATEGORIES } from '@/types'
import type { Product, ProductCategory, ProductPayload } from '@/types'
import { cn } from '@/lib/utils'

export function ProductsPage() {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'ALL'>('ALL')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const debouncedSearch = useDebouncedValue(search)

  const { data, isPending, isError, refetch } = useProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const filtered = useMemo(() => {
    const needle = debouncedSearch.trim().toLowerCase()
    return (data ?? []).filter((product) => {
      if (category !== 'ALL' && product.category !== category) return false
      if (needle && !product.name.toLowerCase().includes(needle)) return false
      return true
    })
  }, [data, category, debouncedSearch])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setFormOpen(true)
  }

  const handleSubmit = (payload: ProductPayload) => {
    const options = {
      onSuccess: () => {
        toast.success(
          editing ? t('products.toast.updated') : t('products.toast.created'),
        )
        setFormOpen(false)
        setEditing(null)
      },
      onError: () => toast.error(t('common.actionFailed')),
    }

    if (editing) {
      updateProduct.mutate({ id: editing.id, payload }, options)
    } else {
      createProduct.mutate(payload, options)
    }
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteProduct.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(t('products.toast.deleted'))
        setDeleting(null)
      },
      onError: () => toast.error(t('common.actionFailed')),
    })
  }

  return (
    <div>
      <PageHeader
        title={t('products.title')}
        subtitle={t('products.subtitle')}
        action={
          <Button onClick={openCreate}>
            <Plus size={15} />
            {t('products.new')}
          </Button>
        }
      />

      <Card className="p-4 mb-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <Field
            label={t('products.filters.search')}
            className="sm:col-span-2"
          >
            <div className="relative">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('products.filters.searchPlaceholder')}
                className="pl-8"
              />
            </div>
          </Field>
          <Field label={t('products.filters.category')}>
            <Select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ProductCategory | 'ALL')
              }
            >
              <option value="ALL">{t('products.filters.allCategories')}</option>
              {PRODUCT_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {t('products.category.' + item)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted mb-3">{t('common.loadError')}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        ) : isPending ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState message={t('products.empty')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="font-medium px-4 py-2.5">
                    {t('products.table.name')}
                  </th>
                  <th className="font-medium px-4 py-2.5">
                    {t('products.table.category')}
                  </th>
                  <th className="font-medium px-4 py-2.5 text-right">
                    {t('products.table.price')}
                  </th>
                  <th className="font-medium px-4 py-2.5">
                    {t('products.table.stock')}
                  </th>
                  <th className="font-medium px-4 py-2.5">
                    {t('products.table.state')}
                  </th>
                  <th className="font-medium px-4 py-2.5 text-right">
                    {t('products.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-medium">{product.name}</td>
                    <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                      {t('products.category.' + product.category)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                      {fmt.currency(product.price)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="tabular-nums">{product.stock}</span>
                      {product.stock <= LOW_STOCK_THRESHOLD && (
                        <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                          {t('products.lowStock')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          product.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'bg-surface-2 text-muted',
                        )}
                      >
                        {product.active
                          ? t('products.active')
                          : t('products.passive')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={t('common.edit')}
                          onClick={() => openEdit(product)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={t('common.delete')}
                          onClick={() => setDeleting(product)}
                          className="hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ProductFormModal
        open={formOpen}
        product={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending || updateProduct.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        title={t('products.deleteTitle')}
        message={t('products.deleteMessage', { name: deleting?.name ?? '' })}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        isPending={deleteProduct.isPending}
      />
    </div>
  )
}
