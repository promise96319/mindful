import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePracticeStats } from '../hooks/usePracticeStats'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'
import CompletionModal from '../components/CompletionModal'

const durations = [1, 3, 5, 10]

export default function FocusTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()
  const [duration, setDuration] = useState(3)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shouldEnterFullscreen, setShouldEnterFullscreen] = useState(false)
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
    setShouldEnterFullscreen(true)
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
      <CompletionModal
        toolName="focus"
        duration={totalDurationSeconds}
        onRestart={handleReset}
        onClose={() => setIsComplete(false)}
      />
    )
  }

  return (
    <FullscreenToolWrapper toolName="focus" shouldEnterFullscreen={shouldEnterFullscreen}>
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
        <div className="text-center w-full max-w-4xl animate-fade-in">
          {/* Focus Point - Enhanced for fullscreen with larger concentric circles */}
          <div className="relative w-full aspect-square max-w-2xl mx-auto mb-16 flex items-center justify-center">
            {/* Outer rings with enhanced glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/10 to-accent-light/10 animate-breathe"
                 style={{
                   boxShadow: '0 0 80px rgba(var(--color-primary-rgb), 0.2), inset 0 0 40px rgba(var(--color-primary-rgb), 0.1)'
                 }} />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 animate-breathe"
                 style={{
                   animationDelay: '0.5s',
                   boxShadow: '0 0 60px rgba(var(--color-primary-rgb), 0.25), inset 0 0 30px rgba(var(--color-primary-rgb), 0.15)'
                 }} />
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary-light/20 to-accent-light/20 animate-breathe"
                 style={{
                   animationDelay: '1s',
                   boxShadow: '0 0 40px rgba(var(--color-primary-rgb), 0.3), inset 0 0 20px rgba(var(--color-primary-rgb), 0.2)'
                 }} />
            <div className="absolute inset-24 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 animate-breathe"
                 style={{
                   animationDelay: '1.5s',
                   boxShadow: '0 0 30px rgba(var(--color-primary-rgb), 0.35)'
                 }} />

            {/* Center focus point - larger and more prominent */}
            <div className="relative">
              <div className="absolute inset-0 w-16 h-16 -m-8 rounded-full bg-primary/20 blur-2xl animate-pulse" />
              <div className="absolute inset-0 w-12 h-12 -m-6 rounded-full bg-primary/30 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary-light to-primary-dark shadow-2xl animate-gentle-pulse"
                   style={{
                     boxShadow: '0 0 60px rgba(var(--color-primary-rgb), 0.6), 0 0 120px rgba(var(--color-primary-rgb), 0.4), inset 0 0 20px rgba(255, 255, 255, 0.3)'
                   }} />
            </div>
          </div>

          {/* Timer Display - Larger and more prominent */}
          <p className="text-7xl md:text-8xl font-bold text-gradient mb-20">
            {formatTime(timeLeft)}
          </p>

          {/* Stop Button - Larger for fullscreen */}
          <button
            onClick={handleReset}
            className="px-10 py-5 border-2 border-border text-text-secondary rounded-2xl font-medium text-lg hover:border-primary/30 hover:bg-background-alt transition-all duration-300 hover:scale-105"
          >
            {t('common.stop')}
          </button>
        </div>
      )}
    </div>
    </FullscreenToolWrapper>
  )
}
