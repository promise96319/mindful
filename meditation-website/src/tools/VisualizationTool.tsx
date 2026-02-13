import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'
import CompletionModal from '../components/CompletionModal'
import MandalaScene from '../components/visualizations/MandalaScene'
import StarfieldScene from '../components/visualizations/StarfieldScene'
import WaterRippleScene from '../components/visualizations/WaterRippleScene'
import { usePracticeStats } from '../hooks/usePracticeStats'

type SceneType = 'mandala' | 'starfield' | 'waterRipple'

const durationOptions = [3, 5, 10, 15]

export default function VisualizationTool() {
  const { t } = useTranslation('tools')
  const { addRecord } = usePracticeStats()

  const [scene, setScene] = useState<SceneType>('mandala')
  const [duration, setDuration] = useState(5)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [shouldEnterFullscreen, setShouldEnterFullscreen] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })

  const intervalRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasRecordedRef = useRef(false)

  const totalDurationSeconds = duration * 60

  // Handle resize for canvas
  const updateCanvasSize = useCallback(() => {
    if (shouldEnterFullscreen && document.fullscreenElement) {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight })
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCanvasSize({ width: Math.floor(rect.width), height: Math.floor(Math.min(rect.width * 0.66, 500)) })
    }
  }, [shouldEnterFullscreen])

  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  // Timer
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTotalElapsed((prev) => {
          const next = prev + 1
          if (next >= totalDurationSeconds) {
            setIsActive(false)
            setIsComplete(true)
            return next
          }
          return next
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, isPaused, totalDurationSeconds])

  // Record practice on completion
  useEffect(() => {
    if (isComplete && !hasRecordedRef.current) {
      hasRecordedRef.current = true
      addRecord('visualization', totalElapsed)
    }
  }, [isComplete, totalElapsed, addRecord])

  // Remove old Escape handler as FullscreenToolWrapper handles it

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
    setTotalElapsed(0)
    setIsComplete(false)
    setShouldEnterFullscreen(true)
    hasRecordedRef.current = false
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsPaused(false)
    setTotalElapsed(0)
    setIsComplete(false)
    setShouldEnterFullscreen(false)
    hasRecordedRef.current = false
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderScene = () => {
    switch (scene) {
      case 'mandala':
        return <MandalaScene width={canvasSize.width} height={canvasSize.height} />
      case 'starfield':
        return <StarfieldScene width={canvasSize.width} height={canvasSize.height} />
      case 'waterRipple':
        return <WaterRippleScene width={canvasSize.width} height={canvasSize.height} />
    }
  }

  if (isComplete) {
    return (
      <CompletionModal
        toolName="visualization"
        duration={totalElapsed}
        onRestart={handleReset}
        onClose={() => setIsComplete(false)}
      />
    )
  }

  // Fullscreen immersive mode - check for actual fullscreen state
  const isInFullscreen = shouldEnterFullscreen && !!document.fullscreenElement
  if (isActive && isInFullscreen) {
    return (
      <FullscreenToolWrapper toolName="visualization" shouldEnterFullscreen={shouldEnterFullscreen}>
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Canvas */}
          <div className="flex-1 relative">
            {renderScene()}

            {/* Overlay controls - Enhanced for fullscreen */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
              <div className="max-w-2xl mx-auto">
                {/* Timer - Larger */}
                <p className="text-white text-5xl md:text-6xl font-bold text-center mb-6 drop-shadow-lg">
                  {formatTime(totalDurationSeconds - totalElapsed)}
                </p>

                {/* Progress bar - Enhanced */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-6 overflow-hidden">
                  <div
                    className="h-full bg-white/90 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(totalElapsed / totalDurationSeconds) * 100}%`,
                      boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                    }}
                  />
                </div>

                {/* Controls - Larger */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePause}
                    className="px-8 py-4 bg-white/25 backdrop-blur-md text-white rounded-2xl font-medium text-lg hover:bg-white/35 transition-all duration-300 hover:scale-105"
                  >
                    {isPaused ? t('common.resume') : t('common.pause')}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-white/15 backdrop-blur-md text-white/90 rounded-2xl font-medium text-lg hover:bg-white/25 transition-all duration-300"
                  >
                    {t('common.stop')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullscreenToolWrapper>
    )
  }

  // Active but not fullscreen (windowed mode) - show option to enter fullscreen
  if (isActive) {
    return (
      <FullscreenToolWrapper toolName="visualization" shouldEnterFullscreen={shouldEnterFullscreen}>
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
          <div className="w-full max-w-2xl">
            <div
              ref={containerRef}
              className="w-full rounded-3xl overflow-hidden shadow-large mb-6 border border-border-light"
            >
              {renderScene()}
            </div>

            {/* Timer */}
            <p className="text-4xl font-bold text-gradient text-center mb-2">
              {formatTime(totalDurationSeconds - totalElapsed)}
            </p>
            <p className="text-text-secondary text-center text-sm mb-6">
              {formatTime(totalElapsed)} / {formatTime(totalDurationSeconds)}
            </p>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePause}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
              >
                {isPaused ? t('common.resume') : t('common.pause')}
              </button>
              <button
                onClick={() => setShouldEnterFullscreen(true)}
                className="px-8 py-4 bg-gradient-to-r from-secondary to-secondary-light text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
              >
                {t('visualization.fullscreen') || 'Fullscreen'}
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-4 border-2 border-border text-text-secondary rounded-2xl font-medium hover:border-primary/30 hover:bg-background-alt transition-all duration-300"
              >
                {t('common.stop')}
              </button>
            </div>
          </div>
        </div>
      </FullscreenToolWrapper>
    )
  }

  // Pre-start selection screen
  return (
    <FullscreenToolWrapper toolName="visualization" shouldEnterFullscreen={shouldEnterFullscreen}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in-up">
        <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </Link>

        <h1 className="text-3xl font-bold text-gradient mb-3">{t('visualization.title')}</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">{t('visualization.desc')}</p>

        {/* Scene Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-text mb-4">
            {t('visualization.selectScene')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['mandala', 'starfield', 'waterRipple'] as SceneType[]).map((s) => (
              <button
                key={s}
                onClick={() => setScene(s)}
                className={`p-4 rounded-2xl text-sm font-medium transition-all duration-300 border-2 ${
                  scene === s
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft scale-105'
                    : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                {t(`visualization.scenes.${s}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-text mb-4">
            {t('visualization.selectDuration')}
          </label>
          <div className="grid grid-cols-4 gap-3">
            {durationOptions.map((d) => (
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

        {/* Preview */}
        <div
          ref={containerRef}
          className="w-full rounded-2xl overflow-hidden mb-8 border border-border-light shadow-soft"
          style={{ height: 200 }}
        >
          {renderScene()}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-semibold text-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
        >
          {t('common.start')}
        </button>
      </div>
    </div>
    </FullscreenToolWrapper>
  )
}
