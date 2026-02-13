import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeRecord } from '../../../hooks/usePracticeStats'

interface PracticeDurationBarChartProps {
  records: PracticeRecord[]
}

type DateRange = 7 | 14 | 30 | 90

export default function PracticeDurationBarChart({ records }: PracticeDurationBarChartProps) {
  const { t, i18n } = useTranslation('common')
  const [dateRange, setDateRange] = useState<DateRange>(30)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const isZh = i18n.language === 'zh-CN'

  const today = new Date().toISOString().split('T')[0]

  // Process data for the selected date range
  const chartData = useMemo(() => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - dateRange + 1)

    // Generate all dates in range
    const dates: string[] = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Aggregate data by date
    const dataMap = new Map<
      string,
      { duration: number; sessionCount: number }
    >()

    records.forEach((record) => {
      if (dates.includes(record.date)) {
        const existing = dataMap.get(record.date) || {
          duration: 0,
          sessionCount: 0,
        }
        dataMap.set(record.date, {
          duration: existing.duration + record.duration,
          sessionCount: existing.sessionCount + 1,
        })
      }
    })

    // Build chart data
    const data = dates.map((date) => {
      const record = dataMap.get(date)
      return {
        date,
        duration: record?.duration || 0,
        sessionCount: record?.sessionCount || 0,
        isToday: date === today,
      }
    })

    const maxDuration = Math.max(...data.map((d) => d.duration), 1)

    return { data, maxDuration }
  }, [records, dateRange, today])

  // Format date for display
  const formatDate = (dateStr: string, short = false) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()

    if (short) {
      return `${month}/${day}`
    }

    if (isZh) {
      const year = date.getFullYear()
      return `${year}年${month}月${day}日`
    } else {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      return `${monthNames[month - 1]} ${day}`
    }
  }

  // Format duration in minutes
  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60)
    return isZh ? `${minutes}分钟` : `${minutes} min`
  }

  // Calculate bar spacing based on date range
  const getBarSpacing = () => {
    if (dateRange === 7) return 'gap-3'
    if (dateRange === 14) return 'gap-2'
    if (dateRange === 30) return 'gap-1.5'
    return 'gap-1'
  }

  // Show every nth label based on date range
  const getLabelInterval = () => {
    if (dateRange === 7) return 1
    if (dateRange === 14) return 2
    if (dateRange === 30) return 5
    return 10
  }

  const dateRanges: DateRange[] = [7, 14, 30, 90]

  return (
    <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">
          {t('practiceDurationChart.title')}
        </h3>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-background-alt rounded-xl p-1">
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                dateRange === range
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {range}
              {t('practiceDurationChart.days')}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="flex items-end" style={{ height: '280px' }}>
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-full py-2 pr-4 text-xs text-text-secondary w-12">
            {[4, 3, 2, 1, 0].map((level) => {
              const value = Math.round((chartData.maxDuration / 4) * level / 60)
              return (
                <div key={level} className="text-right">
                  {value}
                </div>
              )
            })}
          </div>

          {/* Chart area */}
          <div className="flex-1">
            {/* Grid lines */}
            <div className="relative h-full">
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                {[0, 1, 2, 3, 4].map((level) => (
                  <line
                    key={level}
                    x1="0"
                    y1={`${(level / 4) * 100}%`}
                    x2="100%"
                    y2={`${(level / 4) * 100}%`}
                    stroke="var(--color-border)"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}
              </svg>

              {/* Bars */}
              <div className={`relative h-full flex items-end ${getBarSpacing()} pb-2 pt-2`} style={{ zIndex: 1 }}>
                {chartData.data.map((item) => {
                  const heightPercent = chartData.maxDuration > 0
                    ? (item.duration / chartData.maxDuration) * 100
                    : 0
                  const isHovered = hoveredDate === item.date

                  return (
                    <div
                      key={item.date}
                      className="flex-1 flex flex-col items-center gap-1 min-w-0"
                      onMouseEnter={() => setHoveredDate(item.date)}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      {/* Bar */}
                      <div className="w-full relative group" style={{ height: '100%' }}>
                        <div
                          className={`absolute bottom-0 w-full rounded-t-md transition-all duration-300 cursor-pointer ${
                            item.isToday
                              ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                              : 'bg-gradient-to-t from-teal-600 to-teal-400'
                          } ${isHovered ? 'opacity-80 shadow-lg' : 'opacity-90'}`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {/* Tooltip on hover */}
                          {isHovered && item.duration > 0 && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-background border border-border-light rounded-lg shadow-lg whitespace-nowrap z-50">
                              <div className="text-xs font-semibold text-text mb-1">
                                {formatDate(item.date)}
                                {item.isToday && (
                                  <span className="ml-1 text-amber-500">
                                    ({t('practiceDurationChart.today')})
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {formatDuration(item.duration)}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {item.sessionCount}{' '}
                                {t(item.sessionCount === 1 ? 'practiceDurationChart.session' : 'practiceDurationChart.sessions')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex items-center mt-2">
          <div className="w-12"></div>
          <div className={`flex-1 flex items-center ${getBarSpacing()}`}>
            {chartData.data.map((item, idx) => {
              const showLabel = idx % getLabelInterval() === 0
              return (
                <div key={item.date} className="flex-1 min-w-0">
                  {showLabel && (
                    <div className="text-xs text-text-secondary text-center truncate">
                      {formatDate(item.date, true)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-light">
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-t from-teal-600 to-teal-400" />
            <span>{t('practiceDurationChart.practiceTime')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-t from-amber-500 to-amber-400" />
            <span>{t('practiceDurationChart.today')}</span>
          </div>
        </div>

        <div className="text-xs text-text-secondary">
          {t('practiceDurationChart.unit')}
        </div>
      </div>

      {/* Summary Stats */}
      {hoveredDate === null && (
        <div className="mt-4 p-4 bg-background-alt rounded-xl border border-border-light">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">
                {formatDuration(
                  chartData.data.reduce((sum, d) => sum + d.duration, 0)
                )}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {t('practiceDurationChart.totalDuration')}
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">
                {chartData.data.filter((d) => d.duration > 0).length}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {t('practiceDurationChart.practiceDays')}
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">
                {chartData.data.reduce((sum, d) => sum + d.sessionCount, 0)}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {t('practiceDurationChart.totalSessions')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
