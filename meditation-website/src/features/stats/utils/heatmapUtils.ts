export interface StreakInfo {
  start: string
  end: string
  length: number
}

/**
 * Calculate color intensity based on value and max value
 */
export function calculateColorIntensity(value: number, maxValue: number): number {
  if (value === 0) return 0
  if (maxValue === 0) return 0
  return Math.min(value / maxValue, 1)
}

/**
 * Get color class based on intensity (0-1) for Tailwind
 */
export function getColorClass(intensity: number, isEmpty: boolean = false): string {
  if (isEmpty || intensity === 0) {
    return 'bg-gray-100 dark:bg-gray-800'
  }

  if (intensity < 0.2) return 'bg-teal-200 dark:bg-teal-900/40'
  if (intensity < 0.4) return 'bg-teal-300 dark:bg-teal-800/60'
  if (intensity < 0.6) return 'bg-teal-400 dark:bg-teal-700'
  if (intensity < 0.8) return 'bg-teal-600 dark:bg-teal-600'
  return 'bg-teal-800 dark:bg-teal-500'
}

/**
 * Get color for gradients (deeper colors for max values)
 */
export function getGradientColor(intensity: number): string {
  if (intensity === 0) return 'rgb(243, 244, 246)' // gray-100
  if (intensity < 0.2) return 'rgb(153, 246, 228)' // teal-200
  if (intensity < 0.4) return 'rgb(94, 234, 212)' // teal-300
  if (intensity < 0.6) return 'rgb(45, 212, 191)' // teal-400
  if (intensity < 0.8) return 'rgb(20, 184, 166)' // teal-600
  if (intensity < 1.0) return 'rgb(15, 118, 110)' // teal-800
  return 'rgb(13, 94, 66)' // teal-900 for max values
}

/**
 * Detect streaks in date records
 */
export function detectStreaks(dates: string[]): StreakInfo[] {
  if (dates.length === 0) return []

  const sortedDates = [...new Set(dates)].sort()
  const streaks: StreakInfo[] = []
  let currentStreak: { start: string; end: string; length: number } | null = null

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i])

    if (!currentStreak) {
      currentStreak = { start: sortedDates[i], end: sortedDates[i], length: 1 }
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dayDiff === 1) {
        // Continue streak
        currentStreak.end = sortedDates[i]
        currentStreak.length++
      } else {
        // Streak broken, save if >= 7 days
        if (currentStreak.length >= 7) {
          streaks.push({ ...currentStreak })
        }
        currentStreak = { start: sortedDates[i], end: sortedDates[i], length: 1 }
      }
    }
  }

  // Don't forget last streak
  if (currentStreak && currentStreak.length >= 7) {
    streaks.push(currentStreak)
  }

  return streaks
}

/**
 * Check if a date is in a streak
 */
export function isInStreak(date: string, streaks: StreakInfo[]): boolean {
  return streaks.some(streak => date >= streak.start && date <= streak.end)
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string, locale: string = 'en'): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Get month name
 */
export function getMonthName(monthIndex: number, locale: string = 'en', short: boolean = true): string {
  const date = new Date(2000, monthIndex, 1)
  return date.toLocaleDateString(locale, { month: short ? 'short' : 'long' })
}

/**
 * Get day of week name
 */
export function getDayName(dayIndex: number, locale: string = 'en', short: boolean = true): string {
  // dayIndex: 0 = Sunday, 1 = Monday, etc.
  const date = new Date(2000, 0, 2 + dayIndex) // Jan 2, 2000 was Sunday
  return date.toLocaleDateString(locale, { weekday: short ? 'short' : 'long' })
}

/**
 * Format duration in seconds to readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Generate heatmap cells for a year
 */
export interface HeatmapCell {
  date: string
  value: number
  weekIndex: number
  dayOfWeek: number
  isEmpty: boolean
}

export function generateYearCells(year: number, dataMap: Map<string, number>): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  const today = new Date()

  // Start from first Sunday of the year or before
  const startDate = new Date(year, 0, 1)
  const firstDay = startDate.getDay()
  startDate.setDate(startDate.getDate() - firstDay)

  // Generate 53 weeks
  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const cellDate = new Date(startDate)
      cellDate.setDate(cellDate.getDate() + week * 7 + day)

      // Skip if not in target year or in the future
      if (cellDate.getFullYear() !== year || cellDate > today) {
        cells.push({
          date: cellDate.toISOString().split('T')[0],
          value: 0,
          weekIndex: week,
          dayOfWeek: day,
          isEmpty: true
        })
        continue
      }

      const dateStr = cellDate.toISOString().split('T')[0]
      const value = dataMap.get(dateStr) || 0

      cells.push({
        date: dateStr,
        value,
        weekIndex: week,
        dayOfWeek: day,
        isEmpty: false
      })
    }
  }

  return cells
}

/**
 * Calculate weekly totals from cells
 */
export function calculateWeeklyTotals(cells: HeatmapCell[]): number[] {
  const weeklyTotals: number[] = []

  for (let week = 0; week < 53; week++) {
    const weekCells = cells.filter(c => c.weekIndex === week && !c.isEmpty)
    const total = weekCells.reduce((sum, c) => sum + c.value, 0)
    weeklyTotals.push(total)
  }

  return weeklyTotals
}
