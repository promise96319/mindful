import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { addJournal } from '../services/apiService'
import JournalForm from '../components/journal/JournalForm'
import type { JournalEntry } from '../types/journal'

export default function JournalNew() {
  const { t } = useTranslation('journal')
  const { user, promptLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      promptLogin()
      return
    }
    await addJournal(entry)
    navigate('/journal')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/journal" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t('backToJournal', { defaultValue: 'Back to Journal' })}
      </Link>

      <h1 className="text-3xl font-bold text-gradient mb-8">
        {t('newEntry', { defaultValue: 'New Entry' })}
      </h1>

      <div className="bg-card rounded-3xl border border-border-light p-6 shadow-soft">
        <JournalForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/journal')}
        />
      </div>
    </div>
  )
}
