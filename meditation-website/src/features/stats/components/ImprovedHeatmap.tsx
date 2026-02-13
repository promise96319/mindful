import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeRecord } from '../../../hooks/usePracticeStats'
import {
  generateYearCells,
  calculateWeeklyTotals,
  calculateColorIntensity,
  getColorClass,
  detectStreaks,
  isInStreak,
  formatDate,
  formatDuration,
  getMonthName
} from '../utils/heatmapUtils'

interface ImprovedHeatmapProps {
  records: PracticeRecord[]
}

type ViewMode = 'duration' | 'sessions' | 'mood'

export default function ImprovedHeatmap({ records }: ImprovedHeatmapProps) {
  const { t, i18n } = useTranslation('journal')
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [viewMode, setViewMode] = useState<ViewMode>('duration')
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const { cells, maxValue, streaks, weeklyTotals } = useMemo(() => {
    // Build data map based on view mode
    const dataMap = new Map<string, number>()

    if (viewMode === 'sessions') {
      // Count sessions per day
      for (const record of records) {
        const date = record.date
        dataMap.set(date, (dataMap.get(date) || 0) + 1)
      }
    } else {
      // Duration mode
      for (const record of records) {
        const date = record.date
        dataMap.set(date, (dataMap.get(date) || 0) + record.duration)
      }
    }

    const cells = generateYearCells(selectedYear, dataMap)
    const maxValue = Math.max(...Array.from(dataMap.values()), 1)

    // Detect streaks
    const datesWithData = Array.from(dataMap.keys()).filter(date => {
      const d = new Date(date)
      return d.getFullYear() === selectedYear
    })
    const streaks = detectStreaks(datesWithData)

    // Calculate weekly totals
    const weeklyTotals = calculateWeeklyTotals(cells)

    return { cells, maxValue, streaks, weeklyTotals }
  }, [records, selectedYear, viewMode])

  const cellSize = 14
  const gap = 3
  const labelWidth = 32
  const weeklyBarHeight = 40
  const monthLabelHeight = 24

  const getTooltipContent = (dateStr: string) => {
    const dayRecords = records.filter(r => r.date === dateStr)
    if (dayRecords.length === 0) {
      return { title: formatDate(dateStr, i18n.language), stats: 'No practice' }
    }

    const totalDuration = dayRecords.reduce((sum, r) => sum + r.duration, 0)
    const sessionCount = dayRecords.length

    return {
      title: formatDate(dateStr, i18n.language),
      stats:
        viewMode === 'duration'
          ? `${formatDuration(totalDuration)} (${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'})`
          : `${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'} (${formatDuration(totalDuration)})`
    }
  }

  const handlePrevYear = () => setSelectedYear(y => y - 1)
  const handleNextYear = () => setSelectedYear(y => Math.min(y + 1, currentYear))

  // Calculate month positions
  const monthPositions = useMemo(() => {
    const positions: Array<{ month: number; x: number; width: number }> = []
    let currentMonth = -1
    let monthStartWeek = 0

    cells.forEach(cell => {
      if (cell.isEmpty) return
      const date = new Date(cell.date)
      const month = date.getMonth()

      if (month !== currentMonth) {
        if (currentMonth !== -1) {
          // Close previous month
          positions.push({
            month: currentMonth,
            x: labelWidth + monthStartWeek * (cellSize + gap),
            width: (cell.weekIndex - monthStartWeek) * (cellSize + gap)
          })
        }
        currentMonth = month
        monthStartWeek = cell.weekIndex
      }
    })

    // Add last month
    if (currentMonth !== -1) {
      const lastWeek = Math.max(...cells.map(c => c.weekIndex))
      positions.push({
        month: currentMonth,
        x: labelWidth + monthStartWeek * (cellSize + gap),
        width: (lastWeek - monthStartWeek + 1) * (cellSize + gap)
      })
    }

    return positions
  }, [cells])

  const maxWeeklyTotal = Math.max(...weeklyTotals, 1)

  return (
    <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">
          {t('heatmap', { defaultValue: 'Practice Heatmap' })}
        </h3>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-background-alt rounded-xl p-1">
          <button
            onClick={() => setViewMode('duration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              viewMode === 'duration'
                ? 'bg-card text-primary shadow-sm'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t('duration', { defaultValue: 'Duration' })}
          </button>
          <button
            onClick={() => setViewMode('sessions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              viewMode === 'sessions'
                ? 'bg-card text-primary shadow-sm'
                : 'text-text-secondary hover:text-text'
            }`}
          >
            {t('sessions', { defaultValue: 'Sessions' })}
          </button>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrevYear}
          className="p-2 rounded-lg hover:bg-background-alt transition-colors"
          aria-label="Previous year"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-lg font-semibold text-text min-w-[80px] text-center">
          {selectedYear}
        </span>

        <button
          onClick={handleNextYear}
          disabled={selectedYear >= currentYear}
          className="p-2 rounded-lg hover:bg-background-alt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next year"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="relative mb-2" style={{ height: monthLabelHeight }}>
            {monthPositions.map((pos, idx) => (
              <div
                key={idx}
                className="absolute text-xs font-medium text-text-secondary"
                style={{
                  left: pos.x,
                  width: pos.width,
                  top: 0
                }}
              >
                {getMonthName(pos.month, i18n.language)}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="relative">
            <svg
              width={labelWidth + 53 * (cellSize + gap)}
              height={7 * (cellSize + gap) + gap}
            >
              {/* Day labels */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, i) => (
                i % 2 === 1 && (
                  <text
                    key={i}
                    x={labelWidth - 8}
                    y={i * (cellSize + gap) + cellSize - 2}
                    className="text-[10px] fill-text-secondary"
                    textAnchor="end"
                  >
                    {label[0]}
                  </text>
                )
              ))}

              {/* Cells */}
              {cells.map((cell, i) => {
                const intensity = calculateColorIntensity(cell.value, maxValue)
                const colorClass = getColorClass(intensity, cell.isEmpty)
                const hasStreak = !cell.isEmpty && isInStreak(cell.date, streaks)
                const isHovered = hoveredCell === cell.date
                const isSelected = selectedCell === cell.date

                return (
                  <g key={i}>
                    <rect
                      x={labelWidth + cell.weekIndex * (cellSize + gap)}
                      y={cell.dayOfWeek * (cellSize + gap)}
                      width={cellSize}
                      height={cellSize}
                      rx={3}
                      className={`${colorClass} transition-all duration-200 cursor-pointer ${
                        isHovered || isSelected ? 'opacity-80 stroke-primary stroke-2' : 'stroke-border-light stroke-1'
                      }`}
                      onMouseEnter={() => !cell.isEmpty && setHoveredCell(cell.date)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => !cell.isEmpty && setSelectedCell(cell.date === selectedCell ? null : cell.date)}
                    />

                    {/* Fire emoji for streak days */}
                    {hasStreak && (
                      <text
                        x={labelWidth + cell.weekIndex * (cellSize + gap) + cellSize / 2}
                        y={cell.dayOfWeek * (cellSize + gap) + cellSize / 2 + 1}
                        className="text-[8px] pointer-events-none"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        🔥
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Weekly Totals Bar Chart */}
          <div className="mt-4 relative" style={{ height: weeklyBarHeight }}>
            <svg
              width={labelWidth + 53 * (cellSize + gap)}
              height={weeklyBarHeight}
            >
              {weeklyTotals.map((total, weekIndex) => {
                const barHeight = (total / maxWeeklyTotal) * (weeklyBarHeight - 10)
                return (
                  <rect
                    key={weekIndex}
                    x={labelWidth + weekIndex * (cellSize + gap)}
                    y={weeklyBarHeight - barHeight}
                    width={cellSize}
                    height={barHeight}
                    rx={2}
                    className="fill-primary/30 hover:fill-primary/50 transition-colors"
                  />
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Tooltip / Selected Cell Info */}
      {(hoveredCell || selectedCell) && (
        <div className="mt-6 p-4 bg-background-alt rounded-xl border border-border-light">
          {(() => {
            const dateStr = selectedCell || hoveredCell || ''
            const tooltip = getTooltipContent(dateStr)
            return (
              <div>
                <div className="text-sm font-semibold text-text mb-1">{tooltip.title}</div>
                <div className="text-sm text-text-secondary">{tooltip.stats}</div>
                {isInStreak(dateStr, streaks) && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                    <span>🔥</span>
                    <span className="font-medium">Part of a streak!</span>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-light">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>{t('less', { defaultValue: 'Less' })}</span>
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((level) => (
            <div
              key={level}
              className={`w-4 h-4 rounded ${getColorClass(level)}`}
            />
          ))}
          <span>{t('more', { defaultValue: 'More' })}</span>
        </div>

        {streaks.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span>🔥</span>
            <span>{streaks.length} {streaks.length === 1 ? 'streak' : 'streaks'} (7+ days)</span>
          </div>
        )}
      </div>
    </div>
  )
}
