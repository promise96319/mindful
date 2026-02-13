import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePracticeStats } from '../hooks/usePracticeStats'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'
import CompletionModal from '../components/CompletionModal'

type BreathingMode = 'abdominal' | '478' | 'box'
type Phase = 'inhale' | 'hold' | 'exhale' | 'rest'

const breathingPatterns: Record<BreathingMode, { inhale: number; hold: number; exhale: number; rest: number }> = {
  abdominal: { inhale: 4, hold: 0, exhale: 6, rest: 0 },
  '478': { inhale: 4, hold: 7, exhale: 8, rest: 0 },
  box: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
}

const durations = [1, 3, 5, 10]

export default function BreathingTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()
  const [mode, setMode] = useState<BreathingMode>('box')
  const [duration, setDuration] = useState(3)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [phaseTime, setPhaseTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const recordedRef = useRef(false)

  const pattern = breathingPatterns[mode]
  const totalDurationSeconds = duration * 60

  const getPhaseSequence = (): Phase[] => {
    const seq: Phase[] = ['inhale']
    if (pattern.hold > 0) seq.push('hold')
    seq.push('exhale')
    if (pattern.rest > 0) seq.push('rest')
    return seq
  }

  const getPhaseDuration = (p: Phase): number => pattern[p]

  const getNextPhase = (current: Phase): Phase => {
    const seq = getPhaseSequence()
    const idx = seq.indexOf(current)
    return seq[(idx + 1) % seq.length]
  }

  const getCircleScale = (): number => {
    const phaseDuration = getPhaseDuration(phase)
    const progress = phaseDuration > 0 ? phaseTime / phaseDuration : 0

    switch (phase) {
      case 'inhale':
        return 0.5 + 0.5 * progress
      case 'hold':
        return 1
      case 'exhale':
        return 1 - 0.5 * progress
      case 'rest':
        return 0.5
      default:
        return 0.5
    }
  }

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTotalTime((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsActive(false)
            setIsComplete(true)
            return prev
          }
          return prev + 0.1
        })

        setPhaseTime((prev) => {
          const phaseDuration = getPhaseDuration(phase)
          if (prev >= phaseDuration) {
            setPhase(getNextPhase(phase))
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, phase, totalDurationSeconds])

  useEffect(() => {
    if (isComplete && !recordedRef.current) {
      recordedRef.current = true
      addRecord('breathing', Math.floor(totalTime))
    }
  }, [isComplete])

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
    setPhase('inhale')
    setPhaseTime(0)
    setTotalTime(0)
    setIsComplete(false)
    recordedRef.current = false
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsPaused(false)
    setPhase('inhale')
    setPhaseTime(0)
    setTotalTime(0)
    setIsComplete(false)
    recordedRef.current = false
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    return (
      <CompletionModal
        toolName="breathing"
        duration={Math.floor(totalTime)}
        onRestart={handleReset}
        onClose={() => setIsComplete(false)}
      />
    )
  }

  return (
    <FullscreenToolWrapper toolName="breathing">
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        {!isActive ? (
          <div className="w-full max-w-md animate-fade-in-up">
            <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t('common.back')}
            </Link>

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('breathing.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('breathing.desc')}</p>

          {/* Mode Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('breathing.selectMode') || 'Select Mode'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(breathingPatterns) as BreathingMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                    mode === m
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-105'
                      : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  {t(`breathing.modes.${m === '478' ? '478' : m}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('breathing.duration')}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                    duration === d
                      ? 'bg-gradient-to-br from-secondary to-secondary-light text-white border-transparent shadow-soft scale-105'
                      : 'bg-card text-text-secondary border-border-light hover:border-secondary/30 hover:bg-secondary/5'
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
            {t('breathing.start')}
          </button>
        </div>
      ) : (
        <div className="text-center animate-fade-in">
          {/* Breathing Circle */}
          <div className="relative w-80 h-80 mx-auto mb-12">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-breathe" />
            <div className="absolute inset-4 rounded-full bg-primary/20 blur-xl animate-breathe" style={{ animationDelay: '0.5s' }} />
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light via-primary to-primary-dark shadow-large transition-transform duration-100 ease-out"
              style={{ transform: `scale(${getCircleScale()})` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-2xl font-semibold mb-2">
                {t(`breathing.phases.${phase}`)}
              </span>
              <span className="text-white/80 text-sm">
                {Math.ceil(getPhaseDuration(phase) - phaseTime)}s
              </span>
            </div>
          </div>

          <p className="text-5xl font-bold text-gradient mb-3">
            {formatTime(totalDurationSeconds - totalTime)}
          </p>
          <p className="text-text-secondary text-lg mb-12">
            {formatTime(totalTime)} / {formatTime(totalDurationSeconds)}
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePause}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              {isPaused ? t('breathing.resume') : t('breathing.pause')}
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
    </FullscreenToolWrapper>
  )
}
