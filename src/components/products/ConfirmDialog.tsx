import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  isPending?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  isPending,
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isPending}>
            {t('common.delete')}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted">{message}</p>
    </Modal>
  )
}
