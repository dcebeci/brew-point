export type ClassValue = string | false | null | undefined

/** Koşullu Tailwind class'larını birleştirir (clsx'in ihtiyaç duyulan kadarı). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
