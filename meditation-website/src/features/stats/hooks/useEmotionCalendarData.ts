import { useState, useEffect, useCallback } from 'react'
import { getEmotionCalendarData, type EmotionCalendarDataPoint } from '../../../services/apiService'
import { useStatsStore } from '../../../shared/stores/statsStore'

interface UseEmotionCalendarDataReturn {
  data: EmotionCalendarDataPoint[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEmotionCalendarData(month: string): UseEmotionCalendarDataReturn {
  const { fetchEmotionCalendar } = useStatsStore()
  const [data, setData] = useState<EmotionCalendarDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!month) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchEmotionCalendar(month, () => getEmotionCalendarData(month))
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch emotion calendar data'
      setError(errorMessage)
      console.error('Error fetching emotion calendar data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [month, fetchEmotionCalendar])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
