import { useState, useEffect, useCallback } from 'react'
import { getHeatmapData, type HeatmapDataPoint } from '../../../services/apiService'
import { useStatsStore } from '../../../shared/stores/statsStore'

interface UseHeatmapDataReturn {
  data: HeatmapDataPoint[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useHeatmapData(
  year: number,
  viewMode: 'all' | 'tool' = 'all',
  tool?: string,
): UseHeatmapDataReturn {
  const { fetchHeatmap } = useStatsStore()
  const [data, setData] = useState<HeatmapDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchHeatmap(year, viewMode, () => getHeatmapData(year, viewMode, tool))
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch heatmap data'
      setError(errorMessage)
      console.error('Error fetching heatmap data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [year, viewMode, tool, fetchHeatmap])

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
