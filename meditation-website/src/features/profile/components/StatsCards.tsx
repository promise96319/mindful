import { useTranslation } from 'react-i18next'
import {
  ClockIcon,
  SparklesIcon,
  TargetIcon,
  HeartIcon,
  ChartBarIcon,
} from '../../../components/icons'

interface StatsCardsProps {
  weeklyDuration: number // seconds
  streak: number
  avgFocus: number // 1-5
  avgMood: number // 1-5
  achievements: number
  totalLikes: number
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  trend?: number // percentage change
  gradient: string
}

function StatCard({ icon, label, value, trend, gradient }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-large)]`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12" />

      <div className="relative">
        {/* Icon */}
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
          <div className="text-white">{icon}</div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>

        {/* Label and Trend */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/80">{label}</p>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend >= 0 ? 'text-green-300' : 'text-red-300'
              }`}
            >
              <svg
                className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StatsCards({
  weeklyDuration,
  streak,
  avgFocus,
  avgMood,
  achievements,
  totalLikes,
}: StatsCardsProps) {
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh-CN'

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}${isZh ? '小时' : 'h'} ${minutes}${isZh ? '分' : 'm'}`
    }
    return `${minutes}${isZh ? '分钟' : 'min'}`
  }

  const stats = [
    {
      icon: <ClockIcon className="w-6 h-6" />,
      label: isZh ? '本周时长' : 'Weekly Duration',
      value: formatDuration(weeklyDuration),
      trend: 12,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      label: isZh ? '连续打卡' : 'Streak',
      value: `${streak}${isZh ? '天' : 'd'}`,
      trend: streak > 0 ? 5 : 0,
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: <TargetIcon className="w-6 h-6" />,
      label: isZh ? '平均专注' : 'Avg Focus',
      value: avgFocus.toFixed(1),
      trend: 8,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      label: isZh ? '平均心情' : 'Avg Mood',
      value: avgMood.toFixed(1),
      trend: avgMood > 3 ? 10 : -5,
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      label: isZh ? '成就达成' : 'Achievements',
      value: achievements.toString(),
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      label: isZh ? '获赞总数' : 'Total Likes',
      value: totalLikes.toString(),
      gradient: 'from-rose-500 to-rose-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="opacity-0 animate-fade-in-up"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'forwards',
          }}
        >
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  )
}
