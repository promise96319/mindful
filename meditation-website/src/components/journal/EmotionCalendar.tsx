import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MOOD_ICONS } from '../../types/journal'
import type { JournalEntry } from '../../types/journal'

interface EmotionCalendarProps {
  journals: (JournalEntry & { id: string })[]
}

export default function EmotionCalendar({ journals }: EmotionCalendarProps) {
  const { t } = useTranslation('journal')
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const moodMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const j of journals) {
      if (!map.has(j.date)) {
        map.set(j.date, j.mood)
      }
    }
    return map
  }, [journals])

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthNames = t('months', { returnObjects: true, defaultValue: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ] }) as string[]

  const dayLabels = t('dayLabels', { returnObjects: true, defaultValue: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }) as string[]

  return (
    <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-text">
          {t('emotionCalendar', { defaultValue: 'Emotion Calendar' })}
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-background-alt transition-colors">
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-text min-w-[120px] text-center">
            {Array.isArray(monthNames) ? monthNames[month] : ''} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-background-alt transition-colors">
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {(Array.isArray(dayLabels) ? dayLabels : ['S','M','T','W','T','F','S']).map((label, i) => (
          <div key={i} className="text-center text-xs font-medium text-text-secondary py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for alignment */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const mood = moodMap.get(dateStr)
          const isToday = dateStr === new Date().toISOString().split('T')[0]

          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all duration-200 ${
                isToday ? 'ring-2 ring-primary ring-offset-1' : ''
              } ${mood ? 'bg-primary/5' : 'hover:bg-background-alt'}`}
            >
              <span className={`text-[10px] ${mood ? 'text-text' : 'text-text-secondary'}`}>{day}</span>
              {mood && <span className="text-sm leading-none">{MOOD_ICONS[mood - 1]}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
