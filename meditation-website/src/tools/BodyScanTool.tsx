import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'
import CompletionModal from '../components/CompletionModal'
import BodyOutline from '../components/BodyOutline'
import { usePracticeStats } from '../hooks/usePracticeStats'

type Speed = 'quick' | 'standard' | 'deep'

const speedDurations: Record<Speed, number> = {
  quick: 5 * 60,
  standard: 15 * 60,
  deep: 25 * 60,
}

const bodyParts = [
  { id: 'head', key: 'headFace' },
  { id: 'neck', key: 'neckShoulders' },
  { id: 'arms', key: 'armsHands' },
  { id: 'chest', key: 'chestUpperBack' },
  { id: 'abdomen', key: 'abdomenLowerBack' },
  { id: 'hips', key: 'hipsPelvis' },
  { id: 'legs', key: 'legsFeet' },
] as const

export default function BodyScanTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()

  const [speed, setSpeed] = useState<Speed>('standard')
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [partTimeLeft, setPartTimeLeft] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shouldEnterFullscreen, setShouldEnterFullscreen] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const hasRecordedRef = useRef(false)

  const totalDuration = speedDurations[speed]
  const partDuration = totalDuration / 7

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTotalElapsed((prev) => {
          const next = prev + 1
          if (next >= totalDuration) {
            setIsActive(false)
            setIsComplete(true)
            return next
          }
          return next
        })

        setPartTimeLeft((prev) => {
          const next = prev - 1
          if (next <= 0) {
            setCurrentPartIndex((pi) => {
              if (pi < bodyParts.length - 1) {
                return pi + 1
              }
              return pi
            })
            return Math.floor(partDuration)
          }
          return next
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, totalDuration, partDuration])

  // Record practice on completion
  useEffect(() => {
    if (isComplete && !hasRecordedRef.current) {
      hasRecordedRef.current = true
      addRecord('bodyScan', totalElapsed)
    }
  }, [isComplete, totalElapsed, addRecord])

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
    setCurrentPartIndex(0)
    setPartTimeLeft(Math.floor(partDuration))
    setTotalElapsed(0)
    setIsComplete(false)
    hasRecordedRef.current = false
    setShouldEnterFullscreen(true)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsPaused(false)
    setCurrentPartIndex(0)
    setPartTimeLeft(0)
    setTotalElapsed(0)
    setIsComplete(false)
    hasRecordedRef.current = false
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = totalDuration > 0 ? (totalElapsed / totalDuration) * 100 : 0
  const currentPart = bodyParts[currentPartIndex]

  if (isComplete) {
    return (
      <CompletionModal
        toolName="bodyScan"
        duration={totalElapsed}
        onRestart={handleReset}
        onClose={() => setIsComplete(false)}
      />
    )
  }

  return (
    <FullscreenToolWrapper toolName="bodyScan" shouldEnterFullscreen={shouldEnterFullscreen}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {!isActive ? (
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </Link>

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('bodyScan.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('bodyScan.desc')}</p>

          {/* Speed Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('bodyScan.selectSpeed')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['quick', 'standard', 'deep'] as Speed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                    speed === s
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-105'
                      : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <div className="font-semibold">{t(`bodyScan.speeds.${s}`)}</div>
                  <div className="text-xs mt-1 opacity-80">{speedDurations[s] / 60} min</div>
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
        <div className="text-center w-full max-w-3xl animate-fade-in">
          {/* Body scan content - Enhanced for fullscreen */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            {/* Body outline - Larger */}
            <div className="w-64 h-96 flex-shrink-0">
              <BodyOutline highlightPart={currentPart.id} />
            </div>

            {/* Scan info - Enhanced */}
            <div className="flex-1 text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                {t(`bodyScan.parts.${currentPart.key}`)}
              </h2>
              <p className="text-text-secondary text-lg md:text-xl mb-6 leading-relaxed">
                {t(`bodyScan.guidance.${currentPart.key}`)}
              </p>

              {/* Part progress indicator - Enhanced */}
              <div className="flex items-center gap-2 mb-3">
                {bodyParts.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-3 flex-1 rounded-full transition-all duration-500 ${
                      idx < currentPartIndex
                        ? 'bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]'
                        : idx === currentPartIndex
                        ? 'bg-gradient-to-r from-primary to-primary-light shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.7)]'
                        : 'bg-border-light'
                    }`}
                  />
                ))}
              </div>
              <p className="text-base md:text-lg text-text-secondary font-medium">
                {currentPartIndex + 1} / {bodyParts.length}
              </p>
            </div>
          </div>

          {/* Progress bar - Enhanced */}
          <div className="w-full bg-border-light rounded-full h-4 mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-light to-secondary rounded-full transition-all duration-1000"
              style={{
                width: `${progressPercent}%`,
                boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.5)'
              }}
            />
          </div>

          {/* Timer - Enhanced */}
          <div className="flex items-center justify-between mb-3 text-base md:text-lg text-text-secondary">
            <span className="font-medium">{formatTime(totalElapsed)}</span>
            <span className="font-medium">{formatTime(totalDuration)}</span>
          </div>

          <p className="text-6xl md:text-7xl font-bold text-gradient mb-3">
            {formatTime(totalDuration - totalElapsed)}
          </p>
          <p className="text-text-secondary text-lg mb-12">
            {t('bodyScan.partTimeLeft')}: {formatTime(partTimeLeft)}
          </p>

          {/* Controls - Enhanced */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePause}
              className="px-10 py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium text-lg shadow-soft hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              {isPaused ? t('common.resume') : t('common.pause')}
            </button>
            <button
              onClick={handleReset}
              className="px-10 py-5 border-2 border-border text-text-secondary rounded-2xl font-medium text-lg hover:border-primary/30 hover:bg-background-alt transition-all duration-300"
            >
              {t('common.stop')}
            </button>
          </div>
        </div>
      )}
    </div>
    </FullscreenToolWrapper>
  )
}
