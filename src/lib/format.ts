const LOCALES: Record<string, string> = {
  tr: 'tr-TR',
  en: 'en-US',
}

export const resolveLocale = (language: string) =>
  LOCALES[language.split('-')[0]] ?? LOCALES.en

export function formatCurrency(value: number, language: string) {
  return new Intl.NumberFormat(resolveLocale(language), {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, language: string) {
  return new Intl.NumberFormat(resolveLocale(language)).format(value)
}

export function formatPercent(value: number, language: string) {
  return new Intl.NumberFormat(resolveLocale(language), {
    style: 'percent',
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  }).format(value / 100)
}

export function formatDate(iso: string, language: string) {
  return new Intl.DateTimeFormat(resolveLocale(language), {
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string, language: string) {
  return new Intl.DateTimeFormat(resolveLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** `<input type="date">` için yerel gün anahtarı (YYYY-MM-DD). */
export function toDateInputValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}
