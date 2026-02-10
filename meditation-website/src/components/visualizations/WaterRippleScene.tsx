import { useEffect, useRef } from 'react'

interface WaterRippleSceneProps {
  width: number
  height: number
}

interface Ripple {
  radius: number
  maxRadius: number
  opacity: number
  hue: number
  startTime: number
}

export default function WaterRippleScene({ width, height }: WaterRippleSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const cx = width / 2
    const cy = height / 2
    const maxRippleRadius = Math.max(width, height) * 0.6

    const ripples: Ripple[] = []
    let lastRippleTime = 0
    const rippleInterval = 2.5 // seconds between new ripples
    let startTime = performance.now()

    const draw = (time: number) => {
      const elapsed = (time - startTime) / 1000

      // Spawn new ripple periodically
      if (elapsed - lastRippleTime > rippleInterval) {
        ripples.push({
          radius: 0,
          maxRadius: maxRippleRadius,
          opacity: 1,
          hue: (elapsed * 15) % 360,
          startTime: elapsed,
        })
        lastRippleTime = elapsed
      }

      // Background: dark blue gradient
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRippleRadius)
      gradient.addColorStop(0, 'rgba(10, 20, 40, 1)')
      gradient.addColorStop(1, 'rgba(5, 10, 25, 1)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]
        const age = elapsed - ripple.startTime
        const speed = 60 // pixels per second
        ripple.radius = age * speed
        ripple.opacity = Math.max(0, 1 - ripple.radius / ripple.maxRadius)

        if (ripple.opacity <= 0) {
          ripples.splice(i, 1)
          continue
        }

        // Draw multiple concentric thin rings per ripple for depth
        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = ripple.radius - ring * 8
          if (ringRadius <= 0) continue

          const ringOpacity = ripple.opacity * (1 - ring * 0.3)
          const lineWidth = 2 - ring * 0.5

          ctx.beginPath()
          ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${ripple.hue + ring * 15}, 60%, 65%, ${ringOpacity * 0.7})`
          ctx.lineWidth = Math.max(0.5, lineWidth)
          ctx.stroke()
        }
      }

      // Center glow
      const glowPulse = 0.5 + 0.5 * Math.sin(elapsed * 1.2)
      const glowGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30)
      glowGradient.addColorStop(0, `hsla(200, 80%, 70%, ${0.4 + glowPulse * 0.3})`)
      glowGradient.addColorStop(1, 'hsla(200, 80%, 70%, 0)')
      ctx.fillStyle = glowGradient
      ctx.fillRect(cx - 30, cy - 30, 60, 60)

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(200, 80%, 80%, ${0.7 + glowPulse * 0.3})`
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ width, height }}
    />
  )
}
