import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore } from '@/store/toast-store'
import type { ToastVariant } from '@/store/toast-store'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const ICON_CLASSES: Record<ToastVariant, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[min(22rem,calc(100vw-2rem))]">
      {toasts.map((item) => {
        const Icon = ICONS[item.variant]
        return (
          <div
            key={item.id}
            role="status"
            className="flex items-start gap-2.5 bg-surface border border-border rounded-lg shadow-lg px-3.5 py-3 animate-fade-in"
          >
            <Icon size={17} className={ICON_CLASSES[item.variant] + ' shrink-0 mt-px'} />
            <p className="text-sm flex-1">{item.message}</p>
            <button
              onClick={() => dismiss(item.id)}
              aria-label="dismiss"
              className="text-muted hover:text-fg transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
