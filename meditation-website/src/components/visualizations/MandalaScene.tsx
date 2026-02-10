import { useEffect, useRef } from 'react'

interface MandalaSceneProps {
  width: number
  height: number
}

export default function MandalaScene({ width, height }: MandalaSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    let startTime = performance.now()

    const draw = (time: number) => {
      const elapsed = (time - startTime) / 1000
      const cx = width / 2
      const cy = height / 2
      const maxRadius = Math.min(width, height) / 2.2

      ctx.clearRect(0, 0, width, height)

      // Breathing scale factor: slow oscillation
      const breathe = 0.85 + 0.15 * Math.sin(elapsed * 0.5)

      const layers = 6
      const petalsPerLayer = [6, 8, 12, 16, 20, 24]

      for (let layer = 0; layer < layers; layer++) {
        const layerRadius = maxRadius * ((layer + 1) / layers) * breathe
        const petals = petalsPerLayer[layer]
        const rotationOffset = elapsed * (0.1 + layer * 0.05) * (layer % 2 === 0 ? 1 : -1)

        // Color cycling per layer
        const hue = (elapsed * 20 + layer * 40) % 360
        const saturation = 60 + 20 * Math.sin(elapsed * 0.3 + layer)
        const lightness = 50 + 10 * Math.sin(elapsed * 0.4 + layer * 0.5)

        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`
        ctx.lineWidth = 1.5

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2 + rotationOffset
          const petalLength = layerRadius * 0.35

          ctx.beginPath()
          const x1 = cx + Math.cos(angle) * (layerRadius - petalLength)
          const y1 = cy + Math.sin(angle) * (layerRadius - petalLength)
          const x2 = cx + Math.cos(angle) * layerRadius
          const y2 = cy + Math.sin(angle) * layerRadius

          // Draw petal as an elliptical arc
          const cpOffset = petalLength * 0.5
          const perpAngle = angle + Math.PI / 2
          const cpx1 = (x1 + x2) / 2 + Math.cos(perpAngle) * cpOffset
          const cpy1 = (y1 + y2) / 2 + Math.sin(perpAngle) * cpOffset
          const cpx2 = (x1 + x2) / 2 - Math.cos(perpAngle) * cpOffset
          const cpy2 = (y1 + y2) / 2 - Math.sin(perpAngle) * cpOffset

          ctx.moveTo(x1, y1)
          ctx.quadraticCurveTo(cpx1, cpy1, x2, y2)
          ctx.quadraticCurveTo(cpx2, cpy2, x1, y1)
          ctx.stroke()
        }

        // Ring circle
        ctx.beginPath()
        ctx.arc(cx, cy, layerRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`
        ctx.stroke()
      }

      // Center dot
      const centerHue = (elapsed * 30) % 360
      ctx.beginPath()
      ctx.arc(cx, cy, 6 * breathe, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${centerHue}, 70%, 60%, 0.9)`
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
