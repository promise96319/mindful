import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import JournalPopup from './journal/JournalPopup'

interface CompletionScreenProps {
  toolName: string
  duration: number // seconds
  onRestart: () => void
  completeTitleKey?: string
  completeMessageKey?: string
  completeMessage?: string
}

export default function CompletionScreen({
  toolName,
  duration,
  onRestart,
  completeTitleKey,
  completeMessage,
}: CompletionScreenProps) {
  const { t } = useTranslation('tools')
  const [showJournal, setShowJournal] = useState(true)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-secondary-light to-secondary/30 flex items-center justify-center mx-auto mb-6 shadow-soft animate-scale-in">
            <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-3 animate-fade-in-up stagger-1">
            {completeTitleKey ? t(completeTitleKey) : t('common.complete', { ns: 'tools' }) || 'Practice Complete'}
          </h2>
          <p className="text-text-secondary text-lg mb-8 animate-fade-in-up stagger-2">
            {completeMessage || `${formatTime(duration)}`}
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up stagger-3">
            <button
              onClick={onRestart}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              {t('common.start')}
            </button>
            <button
              onClick={() => setShowJournal(true)}
              className="px-8 py-4 bg-gradient-to-r from-secondary to-secondary-light text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              {t('common.writeJournal', { ns: 'tools', defaultValue: 'Write Journal' })}
            </button>
            <Link
              to="/tools"
              className="px-8 py-4 border-2 border-primary/20 text-primary rounded-2xl font-medium hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              {t('common.back')}
            </Link>
          </div>
        </div>
      </div>

      {showJournal && (
        <JournalPopup
          toolName={toolName}
          duration={duration}
          onClose={() => setShowJournal(false)}
        />
      )}
    </>
  )
}
