import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface CompletionModalProps {
  toolName: string
  duration: number // seconds
  onRestart: () => void
  onClose: () => void
}

export default function CompletionModal({ toolName, duration, onRestart, onClose }: CompletionModalProps) {
  const { t } = useTranslation('tools')
  const navigate = useNavigate()
  const [showParticles, setShowParticles] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animations after mount
    setTimeout(() => setIsVisible(true), 10)
    setTimeout(() => setShowParticles(true), 300)
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleRecordJournal = () => {
    navigate('/journal/new', {
      state: {
        toolUsed: toolName,
        duration: duration,
        timestamp: new Date().toISOString(),
      },
    })
  }

  const handleContinue = () => {
    onRestart()
    onClose()
  }

  const handleBack = () => {
    navigate('/tools')
  }

  // Generate particle positions
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    angle: (i * 30) * (Math.PI / 180),
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative max-w-lg w-full mx-4 bg-gradient-to-br from-card via-card to-background rounded-3xl border-2 border-border-light shadow-2xl p-8 transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Celebration Animation - Lotus Bloom */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Center lotus */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary-light via-secondary to-secondary-dark shadow-large animate-lotus-bloom">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Particles/Petals */}
          {showParticles && particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
              style={{
                animation: `particle-float 2s ease-out forwards`,
                animationDelay: `${particle.delay}s`,
                '--angle': `${particle.angle}rad`,
              } as any}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary-light to-primary opacity-80 blur-[1px]" />
            </div>
          ))}

          {/* Glow rings */}
          <div className="absolute inset-0 rounded-full bg-secondary/20 blur-xl animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 rounded-full bg-primary/20 blur-lg animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-3 animate-fade-in-up">
            {t('common.complete', { defaultValue: '完成练习' })}
          </h2>
          <p className="text-text-secondary text-lg mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' } as any}>
            {t(`${toolName}.title`, { defaultValue: toolName })}
          </p>
          <p className="text-2xl font-semibold text-gradient animate-fade-in-up" style={{ animationDelay: '0.2s' } as any}>
            {formatTime(duration)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRecordJournal}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-semibold text-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
            style={{ animationDelay: '0.3s' } as any}
          >
            记录冥想
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleContinue}
              className="py-3 bg-gradient-to-r from-secondary to-secondary-light text-white rounded-2xl font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: '0.4s' } as any}
            >
              继续冥想
            </button>
            <button
              onClick={handleBack}
              className="py-3 border-2 border-border-light text-text-secondary rounded-2xl font-medium hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: '0.5s' } as any}
            >
              返回
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lotus-bloom {
          0% {
            transform: scale(0.3) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes particle-float {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * 80px),
              calc(sin(var(--angle)) * 80px)
            ) scale(0);
            opacity: 0;
          }
        }

        .animate-lotus-bloom {
          animation: lotus-bloom 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
