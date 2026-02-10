import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePracticeStats } from '../hooks/usePracticeStats'
import CompletionScreen from '../components/CompletionScreen'

const durations = [1, 3, 5, 10]

export default function FocusTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()
  const [duration, setDuration] = useState(3)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const recordedRef = useRef(false)

  const totalDurationSeconds = duration * 60

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  useEffect(() => {
    if (isComplete && !recordedRef.current) {
      recordedRef.current = true
      addRecord('focus', totalDurationSeconds)
    }
  }, [isComplete])

  const handleStart = () => {
    setTimeLeft(totalDurationSeconds)
    setIsActive(true)
    setIsComplete(false)
    recordedRef.current = false
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(0)
    setIsComplete(false)
    recordedRef.current = false
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    return (
      <CompletionScreen
        toolName="focus"
        duration={totalDurationSeconds}
        onRestart={handleReset}
        completeTitleKey="focus.complete"
        completeMessage={t('focus.completeMsg') || 'Great focus session!'}
      />
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {!isActive ? (
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </Link>

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('focus.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('focus.instruction')}</p>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('focus.duration')}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                    duration === d
                      ? 'bg-gradient-to-br from-accent to-accent-light text-white border-transparent shadow-soft scale-105'
                      : 'bg-card text-text-secondary border-border-light hover:border-accent/30 hover:bg-accent/5'
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-semibold text-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
          >
            {t('common.start')}
          </button>
        </div>
      ) : (
        <div className="text-center w-full max-w-2xl animate-fade-in">
          <div className="relative w-full aspect-square max-w-md mx-auto mb-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/20 to-accent-light/20 animate-breathe" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-breathe" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary-light/40 to-accent-light/40 animate-breathe" style={{ animationDelay: '1s' }} />
            <div className="relative">
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/30 blur-xl animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-large shadow-primary/50 animate-gentle-pulse" />
            </div>
          </div>

          <p className="text-6xl font-bold text-gradient mb-12">
            {formatTime(timeLeft)}
          </p>

          <button
            onClick={handleReset}
            className="px-8 py-4 border-2 border-border text-text-secondary rounded-2xl font-medium hover:border-primary/30 hover:bg-background-alt transition-all duration-300"
          >
            {t('common.stop')}
          </button>
        </div>
      )}
    </div>
  )
}
