import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const CONTROL_CLASSES =
  'w-full h-9 rounded-md border border-border bg-surface px-3 text-sm text-fg ' +
  'placeholder:text-muted transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

interface FieldProps {
  label?: string
  error?: string
  children: ReactNode
  className?: string
}

export function Field({ label, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-fg mb-1">{label}</label>
      )}
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(CONTROL_CLASSES, className)} {...props} />
})

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <select ref={ref} className={cn(CONTROL_CLASSES, className)} {...props} />
  )
})
