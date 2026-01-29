import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const durations = [1, 3, 5, 10]

export default function FocusTool() {
  const { t } = useTranslation('tools')
  const [duration, setDuration] = useState(3)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<number | null>(null)

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

  const handleStart = () => {
    setTimeLeft(totalDurationSeconds)
    setIsActive(true)
    setIsComplete(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(0)
    setIsComplete(false)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-secondary-light to-secondary/30 flex items-center justify-center mx-auto mb-6 shadow-soft animate-scale-in">
            <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-3 animate-fade-in-up stagger-1">
            {t('focus.complete') || 'Practice Complete'}
          </h2>
          <p className="text-text-secondary text-lg mb-8 animate-fade-in-up stagger-2">
            {t('focus.completeMsg') || 'Great focus session!'}
          </p>
          <div className="flex gap-4 justify-center animate-fade-in-up stagger-3">
            <button
              onClick={handleReset}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              {t('common.start')}
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

          {/* Duration Selection */}
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
          {/* Focus Point */}
          <div className="relative w-full aspect-square max-w-md mx-auto mb-12 flex items-center justify-center">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/20 to-accent-light/20 animate-breathe" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-breathe" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary-light/40 to-accent-light/40 animate-breathe" style={{ animationDelay: '1s' }} />

            {/* Center focus point */}
            <div className="relative">
              <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/30 blur-xl animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-large shadow-primary/50 animate-gentle-pulse" />
            </div>
          </div>

          {/* Timer */}
          <p className="text-6xl font-bold text-gradient mb-12">
            {formatTime(timeLeft)}
          </p>

          {/* Controls */}
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
