import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePracticeStats } from '../hooks/usePracticeStats'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'
import CompletionModal from '../components/CompletionModal'

type RelaxMode = 'bodyScan' | 'muscleRelax'

const bodyParts = [
  'head', 'face', 'neck', 'shoulders',
  'arms', 'hands', 'chest', 'abdomen',
  'back', 'hips', 'legs', 'feet'
]

export default function RelaxationTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()
  const [mode, setMode] = useState<RelaxMode>('bodyScan')
  const [isActive, setIsActive] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shouldEnterFullscreen, setShouldEnterFullscreen] = useState(false)
  const startTimeRef = useRef<number>(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const recordedRef = useRef(false)

  useEffect(() => {
    if (isActive) {
      const timer = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isActive])

  useEffect(() => {
    if (isComplete && !recordedRef.current) {
      recordedRef.current = true
      addRecord('relaxation', elapsedTime)
    }
  }, [isComplete])

  const handleStart = () => {
    setIsActive(true)
    setCurrentPart(0)
    setIsComplete(false)
    startTimeRef.current = Date.now()
    setElapsedTime(0)
    recordedRef.current = false
    setShouldEnterFullscreen(true)
  }

  const handleNext = () => {
    if (currentPart < bodyParts.length - 1) {
      setCurrentPart(currentPart + 1)
    } else {
      setIsActive(false)
      setIsComplete(true)
    }
  }

  const handleReset = () => {
    setIsActive(false)
    setCurrentPart(0)
    setIsComplete(false)
    setElapsedTime(0)
    recordedRef.current = false
  }

  if (isComplete) {
    return (
      <CompletionModal
        toolName="relaxation"
        duration={elapsedTime}
        onRestart={handleReset}
        onClose={() => setIsComplete(false)}
      />
    )
  }

  return (
    <FullscreenToolWrapper toolName="relaxation" shouldEnterFullscreen={shouldEnterFullscreen}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {!isActive ? (
        <div className="w-full max-w-md animate-fade-in-up">
          <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('common.back')}
          </Link>

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('relaxation.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('relaxation.desc')}</p>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-text mb-4">
              {t('relaxation.selectMode') || 'Select Mode'}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('bodyScan')}
                className={`p-6 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                  mode === 'bodyScan'
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-105'
                    : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <div className="text-2xl mb-2">🧘</div>
                {t('relaxation.bodyScan')}
              </button>
              <button
                onClick={() => setMode('muscleRelax')}
                className={`p-6 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                  mode === 'muscleRelax'
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-105'
                    : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <div className="text-2xl mb-2">💪</div>
                {t('relaxation.muscleRelax')}
              </button>
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
          {/* Progress - Enhanced for fullscreen */}
          <div className="mb-12">
            <div className="flex justify-between text-base md:text-lg text-text-secondary mb-4">
              <span className="font-semibold">{currentPart + 1} / {bodyParts.length}</span>
              <span className="font-medium">{Math.round(((currentPart + 1) / bodyParts.length) * 100)}%</span>
            </div>
            <div className="h-4 bg-background-alt rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary-light to-secondary transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${((currentPart + 1) / bodyParts.length) * 100}%`,
                  boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.5)'
                }}
              />
            </div>
          </div>

          {/* Body Part Card - Enhanced for fullscreen */}
          <div className="bg-gradient-to-br from-card to-background-alt p-12 md:p-16 rounded-3xl shadow-large border border-border-light mb-16 animate-scale-in"
               style={{
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 60px rgba(var(--color-primary-rgb), 0.1)'
               }}>
            <p className="text-text-secondary mb-4 text-base md:text-lg font-medium uppercase tracking-wider">
              {mode === 'bodyScan' ? t('relaxation.focusOn') || 'Focus on your' : t('relaxation.tenseRelax') || 'Tense and relax your'}
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-gradient capitalize mb-6">
              {t(`relaxation.bodyParts.${bodyParts[currentPart]}`) || bodyParts[currentPart]}
            </h2>
            {mode === 'muscleRelax' && (
              <p className="text-text-secondary text-base md:text-lg leading-relaxed bg-primary/5 px-6 py-4 rounded-xl">
                {t('relaxation.instruction') || 'Hold tension for 5 seconds, then release'}
              </p>
            )}
          </div>

          {/* Controls - Enhanced for fullscreen */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleNext}
              className="px-12 py-5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium text-lg shadow-soft hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              {currentPart < bodyParts.length - 1 ? t('common.next') || 'Next' : t('common.complete') || 'Complete'}
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
