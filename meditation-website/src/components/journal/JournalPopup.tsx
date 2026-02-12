import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { addJournal } from '../../services/apiService'
import JournalForm from './JournalForm'
import type { JournalEntry } from '../../types/journal'

interface JournalPopupProps {
  toolName: string
  duration: number
  onClose: () => void
}

export default function JournalPopup({ toolName, duration, onClose }: JournalPopupProps) {
  const { t } = useTranslation('journal')
  const { user, promptLogin } = useAuth()

  const handleSubmit = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      promptLogin()
      return
    }
    await addJournal(entry)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-large border border-border-light p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">
            {t('writeJournal', { defaultValue: 'Write Journal' })}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-background-alt transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <JournalForm
          toolName={toolName}
          duration={duration}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
