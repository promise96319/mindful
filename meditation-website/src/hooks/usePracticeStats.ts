import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useAuth } from './useAuth'
import { addPracticeRecord, getPracticeRecords } from '../services/firestoreService'

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
  const { user } = useAuth()
  const [localRecords, setLocalRecords] = useLocalStorage<PracticeRecord[]>('practiceHistory', [])
  const [cloudRecords, setCloudRecords] = useState<PracticeRecord[]>([])
  const [cloudLoaded, setCloudLoaded] = useState(false)

  // Load cloud records when user is logged in
  useEffect(() => {
    if (!user) {
      setCloudRecords([])
      setCloudLoaded(false)
      return
    }
    getPracticeRecords(user.uid).then((records) => {
      setCloudRecords(records.map((r) => ({ date: r.date, tool: r.tool, duration: r.duration })))
      setCloudLoaded(true)
    }).catch(() => setCloudLoaded(true))
  }, [user])

  const records = user && cloudLoaded ? cloudRecords : localRecords

  const addRecord = useCallback(async (tool: string, duration: number) => {
    const newRecord: PracticeRecord = {
      date: new Date().toISOString().split('T')[0],
      tool,
      duration,
    }

    if (user) {
      await addPracticeRecord(user.uid, tool, duration)
      // Refresh cloud records
      const updated = await getPracticeRecords(user.uid)
      setCloudRecords(updated.map((r) => ({ date: r.date, tool: r.tool, duration: r.duration })))
    } else {
      setLocalRecords((prev) => [...prev, newRecord])
    }
  }, [user, setLocalRecords])

  const getStats = useCallback((): PracticeStats => {
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
    const checkDate = new Date()

    for (const date of uniqueDates) {
      const expectedDate = checkDate.toISOString().split('T')[0]
      if (date === expectedDate) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (date < expectedDate) {
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
  }, [records])

  const getRecentRecords = useCallback((limit = 10): PracticeRecord[] => {
    return [...records].reverse().slice(0, limit)
  }, [records])

  const clearRecords = useCallback(() => {
    setLocalRecords([])
  }, [setLocalRecords])

  return {
    records,
    addRecord,
    getStats,
    getRecentRecords,
    clearRecords,
  }
}

export default usePracticeStats
