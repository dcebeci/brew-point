import { Inbox } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-muted">
      <Inbox size={28} strokeWidth={1.5} />
      <p className="text-sm">{message}</p>
    </div>
  )
}
