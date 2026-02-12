import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { usePracticeStats } from '../hooks/usePracticeStats'
import { getUserData } from '../services/apiService'
import { getLevel, getLevelProgress, getNextLevel, formatDuration } from '../utils/levelSystem'

export default function Profile() {
  const { t, i18n } = useTranslation('profile')
  const { user, signOut } = useAuth()
  const { getStats, records } = usePracticeStats()
  const [totalSeconds, setTotalSeconds] = useState(0)
  const stats = getStats()
  const isZh = i18n.language === 'zh-CN'

  useEffect(() => {
    if (user) {
      getUserData().then((data) => {
        if (data?.totalPracticeSeconds) {
          setTotalSeconds(data.totalPracticeSeconds)
        }
      }).catch(() => {
        // fallback to local calculation
        const total = records.reduce((sum, r) => sum + r.duration, 0)
        setTotalSeconds(total)
      })
    } else {
      const total = records.reduce((sum, r) => sum + r.duration, 0)
      setTotalSeconds(total)
    }
  }, [user, records])

  const level = getLevel(totalSeconds)
  const progress = getLevelProgress(totalSeconds)
  const nextLevel = getNextLevel(totalSeconds)

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">
          {t('title', { defaultValue: 'Profile' })}
        </h1>
        <p className="text-text-secondary text-lg">
          {t('loginRequired', { defaultValue: 'Please log in to view your profile' })}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* User Card */}
      <div className="bg-card rounded-3xl border border-border-light p-8 shadow-soft mb-8">
        <div className="flex items-center gap-6">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-20 h-20 rounded-2xl object-cover shadow-soft" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
              <span className="text-3xl text-white font-bold">{user.displayName?.[0] || '?'}</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text mb-1">{user.displayName}</h1>
            <p className="text-text-secondary text-sm mb-3">{user.email}</p>
            {/* Level Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">
                Lv.{level.level} {isZh ? level.nameZh : level.nameEn}
              </span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="px-5 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-xl hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300"
          >
            {t('logout', { defaultValue: 'Log out' })}
          </button>
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary">
              {formatDuration(totalSeconds)} {t('total', { defaultValue: 'total' })}
            </span>
            {nextLevel && (
              <span className="text-text-secondary">
                {t('nextLevel', { defaultValue: 'Next' })}: {isZh ? nextLevel.nameZh : nextLevel.nameEn}
              </span>
            )}
          </div>
          <div className="h-3 bg-background-alt rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('todayPractice', { defaultValue: 'Today' }), value: formatDuration(stats.todayTotal) },
          { label: t('weekPractice', { defaultValue: 'This Week' }), value: formatDuration(stats.weekTotal) },
          { label: t('monthPractice', { defaultValue: 'This Month' }), value: formatDuration(stats.monthTotal) },
          { label: t('streak', { defaultValue: 'Streak' }), value: `${stats.streak} ${t('days', { defaultValue: 'days' })}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl border border-border-light p-5 shadow-soft text-center">
            <p className="text-2xl font-bold text-gradient">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Total Sessions */}
      <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft text-center">
        <p className="text-5xl font-bold text-gradient mb-2">{stats.totalSessions}</p>
        <p className="text-text-secondary">{t('totalSessions', { defaultValue: 'Total Sessions' })}</p>
      </div>
    </div>
  )
}
