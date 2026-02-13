import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { tracks, categories, type Category, type Track } from '../data/musicLibrary'
import { usePracticeStats } from '../hooks/usePracticeStats'
import FullscreenToolWrapper from '../components/FullscreenToolWrapper'

export default function MusicLibraryTool() {
  const { t, i18n } = useTranslation('tools')
  const { addRecord } = usePracticeStats()

  const [activeCategory, setActiveCategory] = useState<Category>('nature')
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0-100
  const [volume, setVolume] = useState(70)
  const [isLooping, setIsLooping] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(0) // 0 = no timer
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0)
  const [listenDuration, setListenDuration] = useState(0)

  const progressIntervalRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)
  const listenStartRef = useRef<number>(0)

  const isZh = i18n.language?.startsWith('zh')

  const filteredTracks = tracks.filter((tr) => tr.category === activeCategory)

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  // Record listen duration on unmount
  useEffect(() => {
    return () => {
      cleanup()
      // Record any accumulated listen time
      if (listenDuration > 5) {
        addRecord('musicLibrary', listenDuration)
      }
    }
  }, [cleanup, listenDuration, addRecord])

  // Simulated playback progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      listenStartRef.current = Date.now()
      const stepMs = 200
      const stepPercent = (stepMs / (currentTrack.duration * 1000)) * 100

      progressIntervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const next = prev + stepPercent
          if (next >= 100) {
            if (isLooping) {
              return 0
            }
            setIsPlaying(false)
            return 100
          }
          return next
        })
        setListenDuration((prev) => prev + stepMs / 1000)
      }, stepMs)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [isPlaying, currentTrack, isLooping])

  // Timer countdown
  useEffect(() => {
    if (timerMinutes > 0 && isPlaying) {
      setTimerSecondsLeft(timerMinutes * 60)
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false)
            setTimerMinutes(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [timerMinutes, isPlaying])

  const handleSelectTrack = (track: Track) => {
    // Record previous listen if switching tracks
    if (listenDuration > 5) {
      addRecord('musicLibrary', Math.floor(listenDuration))
      setListenDuration(0)
    }
    setCurrentTrack(track)
    setProgress(0)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    if (!currentTrack) return
    setIsPlaying(!isPlaying)
  }

  const timerOptions = [0, 5, 10, 15, 30, 60]

  return (
    <FullscreenToolWrapper toolName="musicLibrary">
      <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-8 transition-all duration-300 hover:gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </Link>

        <h1 className="text-3xl font-bold text-gradient mb-3">{t('musicLibrary.title')}</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">{t('musicLibrary.desc')}</p>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 border-2 ${
                activeCategory === cat
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-soft'
                  : 'bg-card text-text-secondary border-border-light hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              {t(`musicLibrary.categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Track List */}
        <div className="space-y-3 mb-8">
          {filteredTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 text-left ${
                currentTrack?.id === track.id
                  ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-soft'
                  : 'bg-card border-border-light hover:border-primary/20 hover:bg-primary/5'
              }`}
            >
              {/* Thumbnail */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.gradient} flex-shrink-0 flex items-center justify-center shadow-soft`}>
                <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text truncate">
                  {isZh ? track.titleZh : track.title}
                </p>
                <p className="text-sm text-text-secondary">
                  {formatDuration(track.duration)}
                </p>
              </div>

              {/* Playing indicator */}
              {currentTrack?.id === track.id && isPlaying && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${12 + i * 4}px`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Playback Controls */}
        {currentTrack && (
          <div className="bg-gradient-to-br from-card to-background-alt rounded-3xl border border-border-light p-6 shadow-soft mb-8 animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrack.gradient} flex-shrink-0 flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text truncate">
                  {isZh ? currentTrack.titleZh : currentTrack.title}
                </p>
                <p className="text-xs text-text-secondary">{t(`musicLibrary.categories.${currentTrack.category}`)}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-border-light rounded-full h-2 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const percent = ((e.clientX - rect.left) / rect.width) * 100
                  setProgress(Math.min(100, Math.max(0, percent)))
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-secondary">
                  {formatDuration(Math.floor((progress / 100) * currentTrack.duration))}
                </span>
                <span className="text-xs text-text-secondary">
                  {formatDuration(currentTrack.duration)}
                </span>
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-center gap-6 mb-4">
              {/* Loop toggle */}
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isLooping
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                }`}
                title={t('musicLibrary.loop')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-center shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                )}
              </button>

              {/* Timer dropdown */}
              <select
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                className="p-2.5 rounded-xl bg-card border border-border-light text-text text-sm focus:outline-none focus:border-primary/30"
                title={t('musicLibrary.timer')}
              >
                {timerOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 0 ? t('musicLibrary.noTimer') : `${opt} min`}
                  </option>
                ))}
              </select>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-bold text-primary w-10 text-right">{volume}%</span>
            </div>

            {/* Timer display */}
            {timerMinutes > 0 && timerSecondsLeft > 0 && (
              <div className="mt-3 text-center text-sm text-text-secondary">
                {t('musicLibrary.autoStopIn')}: {formatDuration(timerSecondsLeft)}
              </div>
            )}
          </div>
        )}

        {/* Audio placeholder note */}
        <div className="p-6 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-3xl border border-accent/10 text-center">
          <div className="inline-flex items-center gap-2 text-accent mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="font-semibold">{t('common.note')}</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t('musicLibrary.audioNote')}
          </p>
        </div>
      </div>
    </div>
    </FullscreenToolWrapper>
  )
}
