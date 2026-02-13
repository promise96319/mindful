import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePracticeStats } from '../hooks/usePracticeStats'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'
import CompletionModal from '../components/CompletionModal'

const presetDurations = [5, 10, 15, 20, 30]

export default function TimerTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()
  const [duration, setDuration] = useState(10)
  const [customDuration, setCustomDuration] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shouldEnterFullscreen, setShouldEnterFullscreen] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const recordedRef = useRef(false)

  const totalDurationSeconds = duration * 60

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
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
  }, [isActive, isPaused, timeLeft])

  useEffect(() => {
    if (isComplete && !recordedRef.current) {
      recordedRef.current = true
      addRecord('timer', totalDurationSeconds)
    }
  }, [isComplete])

  const handleStart = () => {
    const mins = customDuration ? parseInt(customDuration) : duration
    if (mins > 0) {
      setDuration(mins)
      setTimeLeft(mins * 60)
      setIsActive(true)
      setIsPaused(false)
      setIsComplete(false)
      recordedRef.current = false
      setShouldEnterFullscreen(true)
    }
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(0)
    setIsComplete(false)
    recordedRef.current = false
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = totalDurationSeconds > 0
    ? ((totalDurationSeconds - timeLeft) / totalDurationSeconds) * 100
    : 0

  if (isComplete) {
    return (
      <CompletionModal
        toolName="timer"
        duration={totalDurationSeconds}
        onRestart={handleReset}
        onClose={() => setIsComplete(false)}
      />
    )
  }

  return (
    <FullscreenToolWrapper toolName="timer" shouldEnterFullscreen={shouldEnterFullscreen}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {!isActive ? (
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </Link>

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('timer.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('timer.desc')}</p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('timer.setDuration')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetDurations.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDuration(d)
                    setCustomDuration('')
                  }}
                  className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                    duration === d && !customDuration
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-105'
                      : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('timer.custom') || 'Custom'} ({t('timer.minutes')})
            </label>
            <input
              type="number"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              placeholder={t('timer.enterMinutes') || 'Enter minutes'}
              min="1"
              max="120"
              className="w-full p-4 rounded-2xl border-2 border-border-light bg-card text-text focus:border-primary focus:outline-none transition-all duration-300 shadow-soft focus:shadow-medium"
            />
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-semibold text-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
          >
            {t('common.start')}
          </button>
        </div>
      ) : (
        <div className="text-center animate-fade-in w-full max-w-3xl">
          {/* Timer Circle - Enhanced for fullscreen */}
          <div className="relative w-full aspect-square max-w-lg mx-auto mb-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="var(--color-background-alt)"
                strokeWidth="8"
                opacity="0.3"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 0.45 * (typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.5 : 200)}
                strokeDashoffset={2 * Math.PI * 0.45 * (typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.5 : 200) * (1 - progress / 100)}
                className="transition-all duration-1000"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(var(--color-primary-rgb), 0.5))'
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl md:text-8xl font-bold text-gradient mb-4">
                {formatTime(timeLeft)}
              </span>
              <span className="text-text-secondary text-lg md:text-xl font-medium">
                {Math.round(progress)}% {t('common.complete') || 'complete'}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePause}
              className="px-10 py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium text-lg shadow-soft hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              {isPaused ? t('common.start') : t('common.pause')}
            </button>
            <button
              onClick={handleReset}
              className="px-10 py-5 border-2 border-border text-text-secondary rounded-2xl font-medium text-lg hover:border-primary/30 hover:bg-background-alt transition-all duration-300"
            >
              {t('common.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
    </FullscreenToolWrapper>
  )
}
