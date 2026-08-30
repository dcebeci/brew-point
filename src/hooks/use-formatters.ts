import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
} from '@/lib/format'

/** Aktif i18n diline bağlanmış formatlayıcılar. */
export function useFormatters() {
  const { i18n } = useTranslation()
  const language = i18n.language

  return useMemo(
    () => ({
      currency: (value: number) => formatCurrency(value, language),
      number: (value: number) => formatNumber(value, language),
      percent: (value: number) => formatPercent(value, language),
      date: (iso: string) => formatDate(iso, language),
      dateTime: (iso: string) => formatDateTime(iso, language),
    }),
    [language],
  )
}
