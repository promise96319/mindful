import { usePracticeStats } from '../hooks/usePracticeStats'
import { useTranslation } from 'react-i18next'

export default function StatsCard() {
  const { getStats } = usePracticeStats()
  const { i18n } = useTranslation()
  const stats = getStats()

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    return `${hours}h ${remainMins}m`
  }

  const labels = {
    'zh-CN': {
      today: '今日',
      week: '本周',
      month: '本月',
      streak: '连续天数',
      noData: '开始你的第一次练习',
    },
    en: {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      streak: 'Streak',
      noData: 'Start your first practice',
    },
  }

  const t = labels[i18n.language as keyof typeof labels] || labels.en

  if (stats.totalSessions === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border-light shadow-soft animate-fade-in-up">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light/30 to-secondary-light/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-text-secondary text-center">{t.noData}</p>
        </div>
      </div>
    )
  }

  const statItems = [
    { value: formatDuration(stats.todayTotal), label: t.today, color: 'primary' },
    { value: formatDuration(stats.weekTotal), label: t.week, color: 'primary' },
    { value: formatDuration(stats.monthTotal), label: t.month, color: 'primary' },
    { value: stats.streak.toString(), label: t.streak, color: 'secondary' },
  ]

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border-light shadow-soft animate-fade-in-up">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <div
            key={item.label}
            className={`text-center opacity-0 animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="relative inline-block">
              <p className={`text-2xl md:text-3xl font-semibold ${
                item.color === 'secondary' ? 'text-secondary' : 'text-primary'
              }`}>
                {item.value}
              </p>
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${
                item.color === 'secondary' ? 'bg-secondary/30' : 'bg-primary/30'
              }`} />
            </div>
            <p className="text-sm text-text-secondary mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
