import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface FullscreenToolWrapperProps {
  children: ReactNode
  toolName: string
}

export default function FullscreenToolWrapper({ children }: FullscreenToolWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [supportsFullscreen, setSupportsFullscreen] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if fullscreen is supported
    if (!document.fullscreenEnabled) {
      setSupportsFullscreen(false)
      return
    }

    // Auto-enter fullscreen on mount
    enterFullscreen()

    // Listen for fullscreen changes (user manually exiting)
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

      // Exit fullscreen on unmount
      if (document.fullscreenElement) {
        exitFullscreen()
      }
    }
  }, [])

  const enterFullscreen = async () => {
    if (!containerRef.current || !supportsFullscreen) return

    try {
      // Try different fullscreen APIs for browser compatibility
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        await (containerRef.current as any).webkitRequestFullscreen()
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        await (containerRef.current as any).mozRequestFullScreen()
      } else if ((containerRef.current as any).msRequestFullscreen) {
        await (containerRef.current as any).msRequestFullscreen()
      }
      setIsFullscreen(true)
    } catch (err) {
      console.warn('Failed to enter fullscreen:', err)
      setSupportsFullscreen(false)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
      setIsFullscreen(false)
    } catch (err) {
      console.warn('Failed to exit fullscreen:', err)
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? 'bg-background' : ''}`}
      style={isFullscreen ? { width: '100vw', height: '100vh' } : undefined}
    >
      {/* Fullscreen Toggle Button */}
      {supportsFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border-light text-text-secondary hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-soft hover:shadow-medium group"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            // Exit fullscreen icon
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15h4.5m-4.5 0v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            // Enter fullscreen icon
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
      )}

      {/* Tool Content */}
      {children}
    </div>
  )
}
