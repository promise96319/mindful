import { create } from 'zustand'

export interface HeatmapData {
  date: string
  value: number
  tool?: string
}

export interface EmotionCalendarData {
  date: string
  mood: number
  focus: number
}

interface CachedData<T> {
  data: T
  timestamp: number
}

interface StatsState {
  heatmapCache: Map<string, CachedData<HeatmapData[]>>
  emotionCalendarCache: Map<string, CachedData<EmotionCalendarData[]>>
  cacheTimeout: number // milliseconds

  fetchHeatmap: (
    year: number,
    viewMode: 'all' | 'tool',
    fetcher: () => Promise<HeatmapData[]>,
  ) => Promise<HeatmapData[]>

  fetchEmotionCalendar: (
    month: string,
    fetcher: () => Promise<EmotionCalendarData[]>,
  ) => Promise<EmotionCalendarData[]>

  clearCache: () => void
  clearHeatmapCache: () => void
  clearEmotionCalendarCache: () => void
}

const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export const useStatsStore = create<StatsState>((set, get) => ({
  heatmapCache: new Map(),
  emotionCalendarCache: new Map(),
  cacheTimeout: DEFAULT_CACHE_TIMEOUT,

  fetchHeatmap: async (
    year: number,
    viewMode: 'all' | 'tool',
    fetcher: () => Promise<HeatmapData[]>,
  ) => {
    const cacheKey = `${year}-${viewMode}`
    const cached = get().heatmapCache.get(cacheKey)
    const now = Date.now()

    // Return cached data if it's still valid
    if (cached && now - cached.timestamp < get().cacheTimeout) {
      return cached.data
    }

    // Fetch new data
    const data = await fetcher()

    // Update cache
    set((state) => {
      const newCache = new Map(state.heatmapCache)
      newCache.set(cacheKey, { data, timestamp: now })
      return { heatmapCache: newCache }
    })

    return data
  },

  fetchEmotionCalendar: async (
    month: string,
    fetcher: () => Promise<EmotionCalendarData[]>,
  ) => {
    const cacheKey = month
    const cached = get().emotionCalendarCache.get(cacheKey)
    const now = Date.now()

    // Return cached data if it's still valid
    if (cached && now - cached.timestamp < get().cacheTimeout) {
      return cached.data
    }

    // Fetch new data
    const data = await fetcher()

    // Update cache
    set((state) => {
      const newCache = new Map(state.emotionCalendarCache)
      newCache.set(cacheKey, { data, timestamp: now })
      return { emotionCalendarCache: newCache }
    })

    return data
  },

  clearCache: () => {
    set({
      heatmapCache: new Map(),
      emotionCalendarCache: new Map(),
    })
  },

  clearHeatmapCache: () => {
    set({ heatmapCache: new Map() })
  },

  clearEmotionCalendarCache: () => {
    set({ emotionCalendarCache: new Map() })
  },
}))
