import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border">
      <p className="text-xs text-muted">
        {t('common.pageInfo', {
          page: page + 1,
          totalPages,
          total: totalElements,
        })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={14} />
          {t('common.previous')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          {t('common.next')}
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
