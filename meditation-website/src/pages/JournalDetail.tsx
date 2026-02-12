import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { getJournal, updateJournal, deleteJournal } from '../services/apiService'
import JournalForm from '../components/journal/JournalForm'
import { MOOD_ICONS } from '../types/journal'
import type { JournalEntry } from '../types/journal'

export default function JournalDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('journal')
  const { user, loading: authLoading, promptLogin } = useAuth()
  const navigate = useNavigate()
  const [journal, setJournal] = useState<(JournalEntry & { id: string }) | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || authLoading) return
    if (!user) {
      promptLogin()
      setLoading(false)
      return
    }
    getJournal(id).then((j) => {
      setJournal(j)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, user, authLoading])

  const handleUpdate = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return
    if (!user) {
      promptLogin()
      return
    }
    await updateJournal(id, entry)
    navigate('/journal')
  }

  const handleDelete = async () => {
    if (!id) return
    if (!user) {
      promptLogin()
      return
    }
    await deleteJournal(id)
    navigate('/journal')
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-text-secondary text-lg mb-6">{t('notFound', { defaultValue: 'Journal entry not found' })}</p>
        <Link to="/journal" className="text-primary hover:underline">{t('backToJournal', { defaultValue: 'Back to Journal' })}</Link>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gradient mb-8">{t('editEntry', { defaultValue: 'Edit Entry' })}</h1>
        <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
          <JournalForm
            initialData={journal}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} ${t('min', { defaultValue: 'min' })}`
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/journal" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t('backToJournal', { defaultValue: 'Back to Journal' })}
      </Link>

      <div className="bg-card rounded-3xl border border-border-light p-8 shadow-soft">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{MOOD_ICONS[journal.mood - 1]}</span>
            <div>
              <h1 className="text-2xl font-bold text-text">{journal.toolUsed}</h1>
              <p className="text-text-secondary">{journal.date} · {formatDuration(journal.duration)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all duration-300"
            >
              {t('edit', { defaultValue: 'Edit' })}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/5 transition-all duration-300"
            >
              {t('delete', { defaultValue: 'Delete' })}
            </button>
          </div>
        </div>

        {/* Focus */}
        <div className="mb-6">
          <span className="text-sm font-medium text-text-secondary">{t('focus', { defaultValue: 'Focus' })}: </span>
          <span className="text-text font-semibold">{journal.focus}/5</span>
        </div>

        {/* Tags */}
        {(journal.bodyTags.length > 0 || journal.mindTags.length > 0) && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {journal.bodyTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">{tag}</span>
              ))}
              {journal.mindTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {journal.freeText && (
          <div className="p-5 bg-background-alt rounded-2xl">
            <p className="text-text leading-relaxed whitespace-pre-wrap">{journal.freeText}</p>
          </div>
        )}
      </div>
    </div>
  )
}
