import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'

type SoundId = 'rain' | 'ocean' | 'forest' | 'stream' | 'fire' | 'wind' | 'birds' | 'whiteNoise'

interface Sound {
  id: SoundId
  icon: string
  volume: number
  active: boolean
}

const initialSounds: Sound[] = [
  { id: 'rain', icon: '🌧️', volume: 50, active: false },
  { id: 'ocean', icon: '🌊', volume: 50, active: false },
  { id: 'forest', icon: '🌲', volume: 50, active: false },
  { id: 'stream', icon: '💧', volume: 50, active: false },
  { id: 'fire', icon: '🔥', volume: 50, active: false },
  { id: 'wind', icon: '💨', volume: 50, active: false },
  { id: 'birds', icon: '🐦', volume: 50, active: false },
  { id: 'whiteNoise', icon: '📻', volume: 50, active: false },
]

export default function AmbientTool() {
  const { t } = useTranslation('tools')
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [masterVolume, setMasterVolume] = useState(70)

  const toggleSound = (id: SoundId) => {
    setSounds(sounds.map(s =>
      s.id === id ? { ...s, active: !s.active } : s
    ))
  }

  const updateVolume = (id: SoundId, volume: number) => {
    setSounds(sounds.map(s =>
      s.id === id ? { ...s, volume } : s
    ))
  }

  const activeSounds = sounds.filter(s => s.active)

  return (
    <FullscreenToolWrapper toolName="ambient">
      <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </Link>

        <h1 className="text-3xl font-bold text-gradient mb-3">{t('ambient.title')}</h1>
        <p className="text-text-secondary mb-10 leading-relaxed">{t('ambient.desc')}</p>

        {/* Master Volume */}
        <div className="mb-10 p-6 bg-gradient-to-br from-card to-background-alt rounded-3xl border border-border-light shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </div>
              <span className="text-base font-semibold text-text">{t('ambient.masterVolume') || 'Master Volume'}</span>
            </div>
            <span className="text-lg font-bold text-primary">{masterVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Sound Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {sounds.map((sound, index) => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`p-6 rounded-2xl text-center transition-all duration-300 border-2 opacity-0 animate-fade-in-up ${
                sound.active
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-medium scale-105'
                  : 'bg-card border-border-light hover:border-primary/30 hover:bg-primary/5 hover:scale-105'
              }`}
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <span className={`text-4xl mb-3 block transition-transform duration-300 ${sound.active ? 'scale-110' : ''}`}>
                {sound.icon}
              </span>
              <span className={`text-sm font-medium ${sound.active ? 'text-white' : 'text-text-secondary'}`}>
                {t(`ambient.sounds.${sound.id}`)}
              </span>
            </button>
          ))}
        </div>

        {/* Active Sounds Volume Control */}
        {activeSounds.length > 0 && (
          <div className="bg-gradient-to-br from-card to-background-alt rounded-3xl border border-border-light p-8 shadow-soft animate-scale-in">
            <h3 className="text-base font-semibold text-text mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('ambient.activeSounds') || 'Active Sounds'}
            </h3>
            <div className="space-y-6">
              {activeSounds.map((sound) => (
                <div key={sound.id} className="flex items-center gap-4 p-4 bg-background-warm rounded-2xl">
                  <span className="text-3xl w-12 flex-shrink-0">{sound.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text">{t(`ambient.sounds.${sound.id}`)}</span>
                      <span className="text-sm font-bold text-primary">{sound.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sound.volume}
                      onChange={(e) => updateVolume(sound.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={() => toggleSound(sound.id)}
                    className="p-2.5 rounded-xl text-text-secondary hover:text-white hover:bg-red-500 transition-all duration-300 flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSounds.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-light/20 to-primary/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </div>
            <p className="text-text-secondary text-lg">
              {t('ambient.selectSounds') || 'Select sounds to create your ambient mix'}
            </p>
          </div>
        )}

        {/* Note about audio */}
        <div className="mt-10 p-6 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-3xl border border-accent/10 text-center">
          <div className="inline-flex items-center gap-2 text-accent mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="font-semibold">{t('common.note') || 'Note'}</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t('ambient.audioNote') || 'Audio playback will be available soon. This is a visual preview of the interface.'}
          </p>
        </div>
      </div>
    </div>
    </FullscreenToolWrapper>
  )
}
