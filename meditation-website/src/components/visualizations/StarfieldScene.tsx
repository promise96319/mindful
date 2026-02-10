import { useEffect, useRef } from 'react'

interface StarfieldSceneProps {
  width: number
  height: number
}

interface Star {
  x: number
  y: number
  z: number
  size: number
  hue: number
}

export default function StarfieldScene({ width, height }: StarfieldSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const starsRef = useRef<Star[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    const cx = width / 2
    const cy = height / 2
    const starCount = 200

    // Initialize stars
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        hue: Math.random() * 60 + 200, // blue-purple range
      }))
    }

    const stars = starsRef.current
    let startTime = performance.now()

    const draw = (time: number) => {
      const elapsed = (time - startTime) / 1000

      // Breathing rhythm: speed oscillates
      const breathSpeed = 0.5 + 0.4 * Math.sin(elapsed * 0.4)

      ctx.fillStyle = 'rgba(0, 0, 10, 0.15)'
      ctx.fillRect(0, 0, width, height)

      for (const star of stars) {
        star.z -= breathSpeed * 3

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2
          star.y = (Math.random() - 0.5) * height * 2
          star.z = 1000
          star.hue = Math.random() * 60 + 200
        }

        const scale = 500 / star.z
        const sx = cx + star.x * scale
        const sy = cy + star.y * scale

        if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) {
          star.z = 0 // will reset next frame
          continue
        }

        const brightness = Math.min(1, (1000 - star.z) / 600)
        const size = star.size * scale * 0.5

        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${star.hue}, 80%, ${60 + brightness * 30}%, ${brightness})`
        ctx.fill()

        // Slight glow for brighter stars
        if (size > 1.5) {
          ctx.beginPath()
          ctx.arc(sx, sy, size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${star.hue}, 80%, 70%, ${brightness * 0.15})`
          ctx.fill()
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    // Initial clear to black
    ctx.fillStyle = 'rgb(0, 0, 10)'
    ctx.fillRect(0, 0, width, height)

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
