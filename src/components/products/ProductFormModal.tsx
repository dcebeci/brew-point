import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Field'
import { PRODUCT_CATEGORIES } from '@/types'
import type { Product, ProductPayload } from '@/types'

interface ProductFormModalProps {
  open: boolean
  /** null ise yeni ürün, doluysa düzenleme. */
  product: Product | null
  onClose: () => void
  onSubmit: (payload: ProductPayload) => void
  isSubmitting: boolean
}

export function ProductFormModal({
  open,
  product,
  onClose,
  onSubmit,
  isSubmitting,
}: ProductFormModalProps) {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t('products.form.nameRequired')),
        category: z.enum(PRODUCT_CATEGORIES),
        price: z
          .number({ error: t('products.form.priceRequired') })
          .min(1, t('products.form.priceRequired')),
        stock: z
          .number({ error: t('products.form.stockRequired') })
          .int(t('products.form.stockRequired'))
          .min(0, t('products.form.stockRequired')),
        active: z.boolean(),
      }),
    [t],
  )

  type ProductForm = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      category: 'COFFEE',
      price: 0,
      stock: 0,
      active: true,
    },
  })

  // Modal her açıldığında formu seçili ürüne göre doldur/sıfırla.
  useEffect(() => {
    if (!open) return
    reset(
      product
        ? {
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            active: product.active,
          }
        : {
            name: '',
            category: 'COFFEE',
            price: 0,
            stock: 0,
            active: true,
          },
    )
  }, [open, product, reset])

  const formId = 'product-form'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? t('products.form.editTitle') : t('products.form.newTitle')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit((values) => onSubmit(values))}
        className="space-y-4"
      >
        <Field label={t('products.form.name')} error={errors.name?.message}>
          <Input
            {...register('name')}
            placeholder={t('products.form.namePlaceholder')}
          />
        </Field>

        <Field
          label={t('products.form.category')}
          error={errors.category?.message}
        >
          <Select {...register('category')}>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t('products.category.' + category)}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('products.form.price')} error={errors.price?.message}>
            <Input
              type="number"
              min={0}
              step={1}
              {...register('price', { valueAsNumber: true })}
            />
          </Field>
          <Field label={t('products.form.stock')} error={errors.stock?.message}>
            <Input
              type="number"
              min={0}
              step={1}
              {...register('stock', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register('active')}
            className="w-4 h-4 accent-[var(--color-brand)]"
          />
          {t('products.form.active')}
        </label>
      </form>
    </Modal>
  )
}
