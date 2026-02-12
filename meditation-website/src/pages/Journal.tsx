import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { usePracticeStats } from '../hooks/usePracticeStats'
import { getJournals } from '../services/apiService'
import PracticeHeatmap from '../components/journal/PracticeHeatmap'
import EmotionCalendar from '../components/journal/EmotionCalendar'
import { MOOD_ICONS } from '../types/journal'
import type { JournalEntry } from '../types/journal'

export default function Journal() {
  const { t } = useTranslation('journal')
  const { user, loading: authLoading, promptLogin } = useAuth()
  const { records } = usePracticeStats()
  const [journals, setJournals] = useState<(JournalEntry & { id: string })[]>([])
  const [journalsLoading, setJournalsLoading] = useState(true)

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
    if (authLoading) return

    if (user) {
      fetchJournals()
      // Poll every 30s
      const interval = setInterval(fetchJournals, 30000)
      return () => clearInterval(interval)
    } else {
      setJournals([])
      setJournalsLoading(false)
    }
  }, [user, authLoading, fetchJournals])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} ${t('min', { defaultValue: 'min' })}`
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {t('title', { defaultValue: 'Journal' })}
          </h1>
          <p className="text-text-secondary">
            {t('subtitle', { defaultValue: 'Track your meditation journey' })}
          </p>
        </div>
        {user ? (
          <Link
            to="/journal/new"
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            {t('newEntry', { defaultValue: 'New Entry' })}
          </Link>
        ) : (
          <button
            onClick={promptLogin}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
          >
            {t('newEntry', { defaultValue: 'New Entry' })}
          </button>
        )}
      </div>

      {/* Heatmap + Calendar */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <PracticeHeatmap records={records} />
        <EmotionCalendar journals={journals} />
      </div>

      {/* Journal List */}
      <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
        <h3 className="text-base font-semibold text-text mb-6">
          {t('recentEntries', { defaultValue: 'Recent Entries' })}
        </h3>
        {(authLoading || journalsLoading) ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : journals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              {t('noEntries', { defaultValue: 'No journal entries yet. Complete a practice to get started!' })}
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
                  <span className="text-sm text-text-secondary">{formatDuration(journal.duration)}</span>
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
