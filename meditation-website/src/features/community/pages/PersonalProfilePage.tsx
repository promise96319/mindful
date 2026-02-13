import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../hooks/useAuth'
import { usePracticeStats } from '../../../hooks/usePracticeStats'
import { getJournals, getUserData } from '../../../services/apiService'
import { getLevel, getLevelProgress, getNextLevel, formatDuration } from '../../../utils/levelSystem'
import PracticeHeatmap from '../../../components/journal/PracticeHeatmap'
import EmotionCalendar from '../../../components/journal/EmotionCalendar'
import { MOOD_ICONS } from '../../../types/journal'
import type { JournalEntry } from '../../../types/journal'

export default function PersonalProfilePage() {
  const { t, i18n } = useTranslation('profile')
  const { user, signOut, promptLogin } = useAuth()
  const { getStats, records } = usePracticeStats()
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [journals, setJournals] = useState<(JournalEntry & { id: string })[]>([])
  const [journalsLoading, setJournalsLoading] = useState(true)
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

  const fetchJournals = useCallback(async () => {
    if (!user) return
    setJournalsLoading(true)
    try {
      const data = await getJournals()
      setJournals(data)
    } catch {
      // ignore
    } finally {
      setJournalsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchJournals()
      // Poll every 30s
      const interval = setInterval(fetchJournals, 30000)
      return () => clearInterval(interval)
    } else {
      setJournals([])
      setJournalsLoading(false)
    }
  }, [user, fetchJournals])

  const level = getLevel(totalSeconds)
  const progress = getLevelProgress(totalSeconds)
  const nextLevel = getNextLevel(totalSeconds)

  const formatJournalDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} ${t('min', { defaultValue: 'min' })}`
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">
          {t('title', { defaultValue: 'Profile' })}
        </h1>
        <p className="text-text-secondary text-lg mb-6">
          {t('loginRequired', { defaultValue: 'Please log in to view your profile' })}
        </p>
        <button
          onClick={promptLogin}
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
        >
          Log In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
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
      <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft text-center mb-8">
        <p className="text-5xl font-bold text-gradient mb-2">{stats.totalSessions}</p>
        <p className="text-text-secondary">{t('totalSessions', { defaultValue: 'Total Sessions' })}</p>
      </div>

      {/* Heatmap + Calendar */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <PracticeHeatmap records={records} />
        <EmotionCalendar journals={journals} />
      </div>

      {/* Journal List */}
      <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-text">
            My Journal Entries
          </h3>
          <Link
            to="/journal/new"
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium text-sm shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            New Entry
          </Link>
        </div>

        {journalsLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              No journal entries yet. Complete a practice to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {journals.map((journal) => (
              <Link
                key={journal.id}
                to={`/journal/${journal.id}`}
                className="block p-5 rounded-2xl border border-border-light hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{MOOD_ICONS[journal.mood - 1]}</span>
                    <div>
                      <h4 className="font-medium text-text group-hover:text-primary transition-colors">
                        {journal.toolUsed}
                      </h4>
                      <p className="text-xs text-text-secondary">{journal.date}</p>
                    </div>
                  </div>
                  <span className="text-sm text-text-secondary">{formatJournalDuration(journal.duration)}</span>
                </div>
                {journal.freeText && (
                  <p className="text-sm text-text-secondary line-clamp-2 mt-2">
                    {journal.freeText}
                  </p>
                )}
                {(journal.bodyTags.length > 0 || journal.mindTags.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {[...journal.bodyTags, ...journal.mindTags].slice(0, 5).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
