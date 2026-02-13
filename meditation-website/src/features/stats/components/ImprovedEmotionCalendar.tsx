import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { MOOD_ICONS } from '../../../types/journal'
import type { JournalEntry } from '../../../types/journal'
import { getMonthName, getDayName } from '../utils/heatmapUtils'

interface ImprovedEmotionCalendarProps {
  journals: (JournalEntry & { id: string })[]
}

interface DayData {
  date: string
  moods: number[]
  journalIds: string[]
  sessionCount: number
}

export default function ImprovedEmotionCalendar({ journals }: ImprovedEmotionCalendarProps) {
  const { t, i18n } = useTranslation('journal')
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { daysData, firstDayOfWeek, daysInMonth } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()

    // Build a map of date -> day data
    const dateMap = new Map<string, DayData>()

    for (const journal of journals) {
      const journalDate = new Date(journal.date)
      if (journalDate.getFullYear() !== year || journalDate.getMonth() !== month) {
        continue
      }

      const dateStr = journal.date
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          moods: [],
          journalIds: [],
          sessionCount: 0
        })
      }

      const dayData = dateMap.get(dateStr)!
      dayData.moods.push(journal.mood)
      dayData.journalIds.push(journal.id)
      dayData.sessionCount++
    }

    return { daysData: dateMap, firstDayOfWeek, daysInMonth }
  }, [journals, year, month])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayData = daysData.get(dateStr)

    if (dayData) {
      setSelectedDay(dayData)
    }
  }

  const handleJournalClick = (journalId: string) => {
    navigate(`/journal/${journalId}`)
  }

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const dayLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => getDayName(i, i18n.language, true))
  }, [i18n.language])

  return (
    <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text">
          {t('emotionCalendar', { defaultValue: 'Emotion Calendar' })}
        </h3>

        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-background-alt transition-all duration-200 hover:scale-110"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center min-w-[140px]">
            <div className="text-sm font-semibold text-text">
              {getMonthName(month, i18n.language, false)}
            </div>
            <div className="text-xs text-text-secondary">{year}</div>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-background-alt transition-all duration-200 hover:scale-110"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayLabels.map((label, i) => (
          <div key={i} className="text-center text-xs font-semibold text-text-secondary py-2">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {/* Empty cells for alignment */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayData = daysData.get(dateStr)
          const isToday = dateStr === todayStr
          const isSelected = selectedDay?.date === dateStr
          const hasSessions = dayData && dayData.sessionCount > 0

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 relative group ${
                isToday
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                  : ''
              } ${
                isSelected
                  ? 'bg-primary/20 scale-95'
                  : hasSessions
                  ? 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:scale-105'
                  : 'hover:bg-background-alt hover:scale-105'
              }`}
            >
              {/* Day number */}
              <span
                className={`text-xs font-medium mb-1 ${
                  hasSessions ? 'text-text' : 'text-text-secondary'
                }`}
              >
                {day}
              </span>

              {/* Mood icons */}
              {dayData && dayData.moods.length > 0 && (
                <div className="flex items-center justify-center gap-0.5 flex-wrap">
                  {dayData.moods.slice(0, 3).map((mood, idx) => (
                    <span key={idx} className="text-base leading-none">
                      {MOOD_ICONS[mood - 1]}
                    </span>
                  ))}
                  {dayData.moods.length > 3 && (
                    <span className="text-[8px] text-text-secondary">
                      +{dayData.moods.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Session count indicator */}
              {dayData && dayData.sessionCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {dayData.sessionCount}
                </div>
              )}

              {/* Today indicator */}
              {isToday && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="border-t border-border-light pt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text mb-1">
              {new Date(selectedDay.date).toLocaleDateString(i18n.language, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
            <p className="text-xs text-text-secondary">
              {selectedDay.sessionCount} {selectedDay.sessionCount === 1 ? 'session' : 'sessions'}
            </p>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedDay.journalIds.map((journalId, idx) => {
              const journal = journals.find(j => j.id === journalId)
              if (!journal) return null

              return (
                <button
                  key={journalId}
                  onClick={() => handleJournalClick(journalId)}
                  className="w-full p-3 rounded-xl bg-background-alt hover:bg-primary/10 border border-border-light hover:border-primary/30 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{MOOD_ICONS[journal.mood - 1]}</span>
                      <div>
                        <div className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                          {journal.toolUsed}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {Math.floor(journal.duration / 60)} min
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {journal.freeText && (
                    <p className="text-xs text-text-secondary mt-2 line-clamp-2">
                      {journal.freeText}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setSelectedDay(null)}
            className="mt-4 w-full py-2 text-xs font-medium text-text-secondary hover:text-text transition-colors"
          >
            {t('close', { defaultValue: 'Close' })}
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-border-light pt-4 mt-4">
        <div className="flex items-center justify-center gap-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-teal-50 dark:bg-teal-900/20 border border-border-light" />
            <span>{t('hasPractice', { defaultValue: 'Has practice' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded ring-2 ring-primary ring-offset-2" />
            <span>{t('today', { defaultValue: 'Today' })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
