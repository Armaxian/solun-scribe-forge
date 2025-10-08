import { useEffect, useRef } from 'react'

interface Static3DPreviewProps {
  className?: string
}

export function Static3DPreview({ className }: Static3DPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create a simple 3D-like visualization
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, width, height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#f8fafc')
      gradient.addColorStop(1, '#e2e8f0')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw some geometric shapes to simulate 3D
      const centerX = width / 2
      const centerY = height / 2
      const time = Date.now() * 0.001

      // Rotating cube-like shape
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(time * 0.5)

      // Draw multiple layers for depth
      for (let i = 0; i < 3; i++) {
        const scale = 1 - i * 0.2
        const alpha = 0.3 - i * 0.1
        const offset = i * 10

        ctx.save()
        ctx.translate(offset, offset)
        ctx.scale(scale, scale)
        ctx.globalAlpha = alpha

        // Draw hexagon
        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3
          const x = Math.cos(angle) * 40
          const y = Math.sin(angle) * 40
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.strokeStyle = '#0B3D2E'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      }

      ctx.restore()

      // Add some floating particles
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time + i) * 0.5 + 0.5) * width
        const y = (Math.cos(time * 0.7 + i) * 0.5 + 0.5) * height
        const size = Math.sin(time * 2 + i) * 2 + 3

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(11, 61, 46, ${0.3 - i * 0.01})`
        ctx.fill()
      }

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0B3D2E] mb-2">Solun</div>
          <div className="text-sm text-gray-600">AI Writing Workspace</div>
        </div>
      </div>
    </div>
  )
}
