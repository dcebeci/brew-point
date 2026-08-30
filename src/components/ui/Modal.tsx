import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    // Modal açıkken arka planın kaymasını engelle.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-xl shadow-xl animate-fade-in"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {description && (
              <p className="text-xs text-muted mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-muted hover:text-fg transition-colors -mr-1 -mt-1 p-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-5 py-3 border-t border-border bg-surface-2 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
