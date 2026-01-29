import { useLocalStorage } from './useLocalStorage'

export interface PracticeRecord {
  date: string
  tool: string
  duration: number // seconds
}

export interface PracticeStats {
  todayTotal: number
  weekTotal: number
  monthTotal: number
  streak: number
  totalSessions: number
}

export function usePracticeStats() {
  const [records, setRecords] = useLocalStorage<PracticeRecord[]>('practiceHistory', [])

  const addRecord = (tool: string, duration: number) => {
    const newRecord: PracticeRecord = {
      date: new Date().toISOString().split('T')[0],
      tool,
      duration,
    }
    setRecords((prev) => [...prev, newRecord])
  }

  const getStats = (): PracticeStats => {
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const todayTotal = records
      .filter((r) => r.date === today)
      .reduce((sum, r) => sum + r.duration, 0)

    const weekTotal = records
      .filter((r) => r.date >= weekAgo)
      .reduce((sum, r) => sum + r.duration, 0)

    const monthTotal = records
      .filter((r) => r.date >= monthAgo)
      .reduce((sum, r) => sum + r.duration, 0)

    // Calculate streak
    const uniqueDates = [...new Set(records.map((r) => r.date))].sort().reverse()
    let streak = 0
    let checkDate = new Date()

    for (const date of uniqueDates) {
      const expectedDate = checkDate.toISOString().split('T')[0]
      if (date === expectedDate) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (date < expectedDate) {
        // Check if it was yesterday (for ongoing streaks)
        checkDate.setDate(checkDate.getDate() - 1)
        if (date === checkDate.toISOString().split('T')[0]) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    return {
      todayTotal,
      weekTotal,
      monthTotal,
      streak,
      totalSessions: records.length,
    }
  }

  const getRecentRecords = (limit = 10): PracticeRecord[] => {
    return [...records].reverse().slice(0, limit)
  }

  const clearRecords = () => {
    setRecords([])
  }

  return {
    records,
    addRecord,
    getStats,
    getRecentRecords,
    clearRecords,
  }
}

export default usePracticeStats
