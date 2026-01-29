import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type RelaxMode = 'bodyScan' | 'muscleRelax'

const bodyParts = [
  'head', 'face', 'neck', 'shoulders',
  'arms', 'hands', 'chest', 'abdomen',
  'back', 'hips', 'legs', 'feet'
]

export default function RelaxationTool() {
  const { t } = useTranslation('tools')
  const [mode, setMode] = useState<RelaxMode>('bodyScan')
  const [isActive, setIsActive] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleStart = () => {
    setIsActive(true)
    setCurrentPart(0)
    setIsComplete(false)
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
            {t('relaxation.complete') || 'Practice Complete'}
          </h2>
          <p className="text-text-secondary text-lg mb-8 animate-fade-in-up stagger-2">
            {t('relaxation.completeMsg') || 'Your body is now relaxed'}
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

          <h1 className="text-3xl font-bold text-gradient mb-3">{t('relaxation.title')}</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">{t('relaxation.desc')}</p>

          {/* Mode Selection */}
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
        <div className="text-center w-full max-w-md animate-fade-in">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between text-sm text-text-secondary mb-3">
              <span className="font-medium">{currentPart + 1} / {bodyParts.length}</span>
              <span>{Math.round(((currentPart + 1) / bodyParts.length) * 100)}%</span>
            </div>
            <div className="h-3 bg-background-alt rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentPart + 1) / bodyParts.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Body Part Card */}
          <div className="bg-gradient-to-br from-card to-background-alt p-10 rounded-3xl shadow-medium border border-border-light mb-10 animate-scale-in">
            <p className="text-text-secondary mb-3 text-sm font-medium uppercase tracking-wide">
              {mode === 'bodyScan' ? t('relaxation.focusOn') || 'Focus on your' : t('relaxation.tenseRelax') || 'Tense and relax your'}
            </p>
            <h2 className="text-4xl font-bold text-gradient capitalize mb-4">
              {t(`relaxation.bodyParts.${bodyParts[currentPart]}`) || bodyParts[currentPart]}
            </h2>
            {mode === 'muscleRelax' && (
              <p className="text-text-secondary text-sm leading-relaxed bg-primary/5 px-4 py-3 rounded-xl">
                {t('relaxation.instruction') || 'Hold tension for 5 seconds, then release'}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
            >
              {currentPart < bodyParts.length - 1 ? t('common.next') || 'Next' : t('common.complete') || 'Complete'}
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
