import { useEffect, useState } from 'react'
import { Static3DPreview } from './static-3d-preview'

interface SplineFallbackProps {
  className?: string
}

export function SplineFallback({ className }: SplineFallbackProps) {
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // Show fallback after a delay to allow Spline to attempt loading
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!showFallback) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B3D2E] mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading 3D scene...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Static3DPreview className="w-full h-full" />
    </div>
  )
}
