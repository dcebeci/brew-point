import { useQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '@/lib/api/dashboard'

export const dashboardKeys = {
  summary: (days: number) => ['dashboard', 'summary', days] as const,
}

export function useDashboardSummary(days = 30) {
  return useQuery({
    queryKey: dashboardKeys.summary(days),
    queryFn: () => fetchDashboardSummary(days),
    staleTime: 60_000,
  })
}
