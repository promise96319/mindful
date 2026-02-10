import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeRecord } from '../../hooks/usePracticeStats'

interface PracticeHeatmapProps {
  records: PracticeRecord[]
}

export default function PracticeHeatmap({ records }: PracticeHeatmapProps) {
  const { t } = useTranslation('journal')

  const { cells, maxDuration } = useMemo(() => {
    // Build a map of date -> total duration
    const dateMap = new Map<string, number>()
    for (const r of records) {
      dateMap.set(r.date, (dateMap.get(r.date) || 0) + r.duration)
    }

    // Generate 52 weeks x 7 days grid
    const today = new Date()
    const cells: { date: string; duration: number; dayOfWeek: number; weekIndex: number }[] = []

    // Start from 52 weeks ago, aligned to Sunday
    const start = new Date(today)
    start.setDate(start.getDate() - 363 - start.getDay())

    let maxDuration = 0
    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(start)
        d.setDate(d.getDate() + week * 7 + day)
        if (d > today) continue
        const dateStr = d.toISOString().split('T')[0]
        const dur = dateMap.get(dateStr) || 0
        if (dur > maxDuration) maxDuration = dur
        cells.push({ date: dateStr, duration: dur, dayOfWeek: day, weekIndex: week })
      }
    }

    return { cells, maxDuration }
  }, [records])

  const getColor = (duration: number): string => {
    if (duration === 0) return 'var(--color-background-alt, #ebedf0)'
    const intensity = Math.min(duration / Math.max(maxDuration, 600), 1)
    if (intensity < 0.25) return 'var(--color-primary-light, #9be9a8)'
    if (intensity < 0.5) return 'var(--color-primary, #40c463)'
    if (intensity < 0.75) return 'var(--color-primary-dark, #30a14e)'
    return 'var(--color-secondary, #216e39)'
  }

  const cellSize = 12
  const gap = 2
  const labelWidth = 28

  return (
    <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
      <h3 className="text-base font-semibold text-text mb-4">
        {t('heatmap', { defaultValue: 'Practice Heatmap' })}
      </h3>
      <div className="overflow-x-auto">
        <svg
          width={labelWidth + 53 * (cellSize + gap)}
          height={7 * (cellSize + gap) + 20}
          className="block"
        >
          {/* Day labels */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => (
            i % 2 === 1 && (
              <text
                key={i}
                x={labelWidth - 6}
                y={i * (cellSize + gap) + cellSize}
                textAnchor="end"
                className="text-[10px] fill-text-secondary"
              >
                {label}
              </text>
            )
          ))}
          {/* Cells */}
          {cells.map((cell, i) => (
            <rect
              key={i}
              x={labelWidth + cell.weekIndex * (cellSize + gap)}
              y={cell.dayOfWeek * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={getColor(cell.duration)}
              className="transition-colors duration-200"
            >
              <title>{`${cell.date}: ${Math.round(cell.duration / 60)}min`}</title>
            </rect>
          ))}
        </svg>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
        <span>{t('less', { defaultValue: 'Less' })}</span>
        {[0, 0.25, 0.5, 0.75, 1].map((level) => (
          <div
            key={level}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getColor(level * Math.max(maxDuration, 600)) }}
          />
        ))}
        <span>{t('more', { defaultValue: 'More' })}</span>
      </div>
    </div>
  )
}
