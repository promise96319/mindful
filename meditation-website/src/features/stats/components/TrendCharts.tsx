import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeRecord } from '../../../hooks/usePracticeStats'
import type { JournalEntry } from '../../../types/journal'

interface TrendChartsProps {
  records: PracticeRecord[]
  journals: (JournalEntry & { id: string })[]
  startDate: string
  endDate: string
}

export default function TrendCharts({ records, journals, startDate, endDate }: TrendChartsProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh-CN'

  // Filter records by date range
  const filteredRecords = useMemo(
    () => records.filter((r) => r.date >= startDate && r.date <= endDate),
    [records, startDate, endDate]
  )

  const filteredJournals = useMemo(
    () => journals.filter((j) => j.date >= startDate && j.date <= endDate),
    [journals, startDate, endDate]
  )

  // Duration trend data
  const durationTrend = useMemo(() => {
    const dailyDuration = new Map<string, number>()
    filteredRecords.forEach((r) => {
      dailyDuration.set(r.date, (dailyDuration.get(r.date) || 0) + r.duration)
    })

    const dates = Array.from(dailyDuration.keys()).sort()
    return dates.map((date) => ({
      date,
      duration: dailyDuration.get(date) || 0,
    }))
  }, [filteredRecords])

  // Mood trend data
  const moodTrend = useMemo(() => {
    const dailyMood = new Map<string, { total: number; count: number }>()
    filteredJournals.forEach((j) => {
      const current = dailyMood.get(j.date) || { total: 0, count: 0 }
      dailyMood.set(j.date, {
        total: current.total + j.mood,
        count: current.count + 1,
      })
    })

    const dates = Array.from(dailyMood.keys()).sort()
    return dates.map((date) => {
      const data = dailyMood.get(date)!
      return {
        date,
        mood: data.total / data.count,
      }
    })
  }, [filteredJournals])

  // Tool distribution data
  const toolDistribution = useMemo(() => {
    const toolCounts = new Map<string, number>()
    filteredRecords.forEach((r) => {
      toolCounts.set(r.tool, (toolCounts.get(r.tool) || 0) + 1)
    })

    return Array.from(toolCounts.entries())
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
  }, [filteredRecords])

  // Focus area data
  const focusTrend = useMemo(() => {
    const dailyFocus = new Map<string, { total: number; count: number }>()
    filteredJournals.forEach((j) => {
      const current = dailyFocus.get(j.date) || { total: 0, count: 0 }
      dailyFocus.set(j.date, {
        total: current.total + j.focus,
        count: current.count + 1,
      })
    })

    const dates = Array.from(dailyFocus.keys()).sort()
    return dates.map((date) => {
      const data = dailyFocus.get(date)!
      return {
        date,
        focus: data.total / data.count,
      }
    })
  }, [filteredJournals])

  const maxDuration = Math.max(...durationTrend.map((d) => d.duration), 1)

  // Colors for charts
  const colors = [
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
  ]

  return (
    <div className="space-y-8">
      {/* Duration Trend Chart */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-soft)]">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
          {isZh ? '练习时长趋势' : 'Duration Trend'}
        </h3>
        <div className="h-64 flex items-end gap-2">
          {durationTrend.length > 0 ? (
            durationTrend.map((data, idx) => {
              const height = (data.duration / maxDuration) * 100
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-secondary)] rounded-t-lg transition-all duration-300 hover:opacity-80 relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--color-background)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.round(data.duration / 60)}min
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-[var(--color-text-secondary)]">
                {isZh ? '暂无数据' : 'No data available'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mood Trend Chart */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-soft)]">
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
          {isZh ? '心情趋势' : 'Mood Trend'}
        </h3>
        <div className="h-64 relative">
          {moodTrend.length > 0 ? (
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map((level) => (
                <line
                  key={level}
                  x1="0"
                  y1={`${100 - (level / 5) * 100}%`}
                  x2="100%"
                  y2={`${100 - (level / 5) * 100}%`}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}
              {/* Area path */}
              <path
                d={`M 0,${100 - (moodTrend[0].mood / 5) * 100}% ${moodTrend
                  .map(
                    (d, i) =>
                      `L ${(i / (moodTrend.length - 1)) * 100}%,${100 - (d.mood / 5) * 100}%`
                  )
                  .join(' ')} L 100%,100% L 0,100% Z`}
                fill="url(#moodGradient)"
              />
              {/* Line path */}
              <path
                d={`M 0,${100 - (moodTrend[0].mood / 5) * 100}% ${moodTrend
                  .map(
                    (d, i) =>
                      `L ${(i / (moodTrend.length - 1)) * 100}%,${100 - (d.mood / 5) * 100}%`
                  )
                  .join(' ')}`}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Data points */}
              {moodTrend.map((d, i) => (
                <circle
                  key={i}
                  cx={`${(i / (moodTrend.length - 1)) * 100}%`}
                  cy={`${100 - (d.mood / 5) * 100}%`}
                  r="4"
                  fill="var(--color-primary)"
                  className="cursor-pointer hover:r-6 transition-all"
                />
              ))}
            </svg>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-[var(--color-text-secondary)]">
                {isZh ? '暂无数据' : 'No data available'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tool Distribution Pie Chart */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
            {isZh ? '工具使用分布' : 'Tool Distribution'}
          </h3>
          <div className="flex items-center justify-center">
            {toolDistribution.length > 0 ? (
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                  {(() => {
                    const total = toolDistribution.reduce((sum, t) => sum + t.count, 0)
                    let currentAngle = 0
                    return toolDistribution.map((tool, idx) => {
                      const percentage = (tool.count / total) * 100
                      const angle = (percentage / 100) * 360
                      const startAngle = currentAngle
                      currentAngle += angle

                      const radius = 80
                      const centerX = 96
                      const centerY = 96

                      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
                      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
                      const x2 =
                        centerX + radius * Math.cos(((startAngle + angle) * Math.PI) / 180)
                      const y2 =
                        centerY + radius * Math.sin(((startAngle + angle) * Math.PI) / 180)

                      const largeArc = angle > 180 ? 1 : 0

                      return (
                        <path
                          key={idx}
                          d={`M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
                          fill={colors[idx % colors.length]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      )
                    })
                  })()}
                </svg>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <p className="text-[var(--color-text-secondary)] text-sm text-center">
                  {isZh ? '暂无数据' : 'No data'}
                </p>
              </div>
            )}
          </div>
          {toolDistribution.length > 0 && (
            <div className="mt-6 space-y-2">
              {toolDistribution.slice(0, 6).map((tool, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="text-sm text-[var(--color-text)] flex-1">{tool.tool}</span>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {tool.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Focus Area Chart */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
            {isZh ? '专注度趋势' : 'Focus Trend'}
          </h3>
          <div className="h-48 flex items-end justify-around gap-1">
            {focusTrend.length > 0 ? (
              focusTrend.map((data, idx) => {
                const height = (data.focus / 5) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:opacity-80 relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--color-background)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.focus.toFixed(1)}
                      </div>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {new Date(data.date).getDate()}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[var(--color-text-secondary)]">
                  {isZh ? '暂无数据' : 'No data available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
