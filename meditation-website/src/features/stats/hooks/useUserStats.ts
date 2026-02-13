import { useState, useEffect, useCallback } from 'react'
import { getUserStatistics, type UserStatistics } from '../../../services/apiService'

interface UseUserStatsReturn {
  stats: UserStatistics | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserStats(userId?: string): UseUserStatsReturn {
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getUserStatistics(userId)
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user statistics'
      setError(errorMessage)
      console.error('Error fetching user statistics:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}
