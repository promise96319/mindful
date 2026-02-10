import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePracticeStats } from '../hooks/usePracticeStats'
import CompletionScreen from '../components/CompletionScreen'

type Theme = 'mindfulness' | 'lovingKindness' | 'sleep'

const durations = [5, 10, 15, 20]

export default function MeditationTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()
  const [theme, setTheme] = useState<Theme>('mindfulness')
  const [duration, setDuration] = useState(10)
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
      addRecord('meditation', totalDurationSeconds)
    }
  }, [isComplete])

  const handleStart = () => {
    setTimeLeft(totalDurationSeconds)
    setIsActive(true)
    setIsComplete(false)
    recordedRef.current = false
  }

  const handlePause = () => {
    setIsActive(!isActive)
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
        toolName="meditation"
        duration={totalDurationSeconds}
        onRestart={handleReset}
        completeTitleKey="meditation.complete"
        completeMessage={`${duration} ${t('common.minutes') || 'minutes'} ${t('common.of') || 'of'} ${t(`meditation.themes.${theme}`)}`}
      />
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {timeLeft === 0 ? (
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </Link>

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('meditation.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('meditation.desc')}</p>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('meditation.selectTheme') || 'Select Theme'}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {(['mindfulness', 'lovingKindness', 'sleep'] as Theme[]).map((th) => (
                <button
                  key={th}
                  onClick={() => setTheme(th)}
                  className={`p-5 rounded-2xl text-left font-medium transition-all duration-300 border-2 ${
                    theme === th
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-[1.02]'
                      : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${theme === th ? 'bg-white' : 'bg-primary/30'}`} />
                    {t(`meditation.themes.${th}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('timer.setDuration')}
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
        <div className="text-center animate-fade-in">
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/30 to-accent-light/30 animate-breathe" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 animate-breathe" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary-light to-primary shadow-large" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20 text-white animate-gentle-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </div>
          </div>

          <p className="text-lg text-text-secondary mb-6 font-medium">
            {t(`meditation.themes.${theme}`)}
          </p>

          <p className="text-6xl font-bold text-gradient mb-12">
            {formatTime(timeLeft)}
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePause}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              {isActive ? t('common.pause') : t('common.start')}
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-4 border-2 border-border text-text-secondary rounded-2xl font-medium hover:border-primary/30 hover:bg-background-alt transition-all duration-300"
            >
              {t('common.stop')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
