import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../hooks/useAuth'
import { usePracticeStats } from '../../../hooks/usePracticeStats'
import { getJournals } from '../../../services/apiService'
import TrendCharts from '../components/TrendCharts'
import type { JournalEntry } from '../../../types/journal'

type DateRangeOption = '7d' | '30d' | '90d' | 'year' | 'custom'

export default function StatsPage() {
  const { user } = useAuth()
  const { records } = usePracticeStats()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh-CN'

  const [journals, setJournals] = useState<(JournalEntry & { id: string })[]>([])
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJournals = async () => {
      if (!user) return
      try {
        const data = await getJournals(100)
        setJournals(data)
      } catch (error) {
        console.error('Failed to load journals:', error)
      } finally {
        setLoading(false)
      }
    }

    loadJournals()
  }, [user])

  const { startDate, endDate } = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    if (dateRange === 'custom') {
      return {
        startDate: customStartDate || todayStr,
        endDate: customEndDate || todayStr,
      }
    }

    const daysMap: Record<DateRangeOption, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'year': 365,
      'custom': 30,
    }

    const days = daysMap[dateRange]
    const start = new Date(today)
    start.setDate(start.getDate() - days)

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: todayStr,
    }
  }, [dateRange, customStartDate, customEndDate])

  const handleExport = () => {
    // Filter data by date range
    const filteredRecords = records.filter((r) => r.date >= startDate && r.date <= endDate)
    const filteredJournals = journals.filter((j) => j.date >= startDate && j.date <= endDate)

    // Create CSV content
    const csvContent = [
      'Type,Date,Tool,Duration,Mood,Focus',
      ...filteredRecords.map((r) => `Practice,${r.date},${r.tool},${r.duration},,`),
      ...filteredJournals.map(
        (j) => `Journal,${j.date},${j.toolUsed},${j.duration},${j.mood},${j.focus}`
      ),
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meditation-stats-${startDate}-to-${endDate}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            {isZh ? '统计分析' : 'Statistics'}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            {isZh ? '请登录以查看统计数据' : 'Please log in to view statistics'}
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const dateRangeOptions: { value: DateRangeOption; label: string }[] = [
    { value: '7d', label: isZh ? '最近7天' : 'Last 7 Days' },
    { value: '30d', label: isZh ? '最近30天' : 'Last 30 Days' },
    { value: '90d', label: isZh ? '最近90天' : 'Last 90 Days' },
    { value: 'year', label: isZh ? '最近一年' : 'Last Year' },
    { value: 'custom', label: isZh ? '自定义' : 'Custom' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
          {isZh ? '统计分析' : 'Statistics Analysis'}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {isZh ? '深入了解你的冥想练习数据' : 'Deep insights into your meditation practice'}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-soft)] mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Date Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  dateRange === option.value
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white'
                    : 'bg-[var(--color-background-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg hover:opacity-90 transition-opacity"
          >
            {isZh ? '导出数据' : 'Export Data'}
          </button>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {isZh ? '开始日期' : 'Start Date'}
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {isZh ? '结束日期' : 'End Date'}
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <TrendCharts
        records={records}
        journals={journals}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )
}
