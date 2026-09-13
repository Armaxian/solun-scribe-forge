import { Suspense, lazy, useEffect, useRef, useState, type ComponentType } from 'react'
import type { SplineProps } from '@splinetool/react-spline'
import { useLocation } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'
import { SplineFallback } from './spline-fallback'
import { logSplineDebugInfo } from '../../lib/spline-debug'

// Custom Spline wrapper that handles import issues
const SplineWrapper = lazy<ComponentType<SplineProps>>(async () => {
  try {
    // Try to import Spline with proper error handling
    const SplineModule = await import('@splinetool/react-spline')
    return SplineModule
  } catch (error) {
    console.warn('Failed to load Spline library:', error)
    // Return a fallback component if Spline fails to load
    return {
      default: () => <SplineFallback className="w-full h-full" />
    }
  }
})

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const location = useLocation()
  const splineRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadAttempts, setLoadAttempts] = useState(0)

  // Ensure client-side only rendering
  useEffect(() => {
    setIsClient(true)
    
    // Debug: Check if scene URL is accessible and log debug info
    if (scene) {
      console.log('Loading Spline scene:', scene)
      logSplineDebugInfo(scene)
    }
    
    // Add timeout to detect if Spline fails to load
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Spline scene loading timeout - this might indicate network or compatibility issues')
        setHasError(true)
        setIsLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [isLoading, scene])

  // Unmount Spline when route changes to free GPU memory
  useEffect(() => {
    return () => {
      if (splineRef.current) {
        // Clean up Spline instance to free GPU memory
        try {
          splineRef.current.dispose?.()
        } catch (error) {
          console.warn('Spline cleanup error:', error)
        }
      }
    }
  }, [location.pathname])

  // Don't render on server side
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B3D2E] border-t-transparent mx-auto mb-2"></div>
          <span className="text-sm text-muted-foreground">{(() => {
            const messages = ["Sharpening pencils…", "Warming the typewriter…", "Preparing your workspace…"];
            return messages[Math.floor(Math.random() * messages.length)];
          })()}</span>
        </div>
      </div>
    )
  }

  // If there was an error, show fallback with retry option
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-6">
          <div className="text-gray-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600 mb-2">3D scene failed to load</p>
          <p className="text-xs text-gray-400 mb-4">This might be due to browser compatibility or network issues</p>
          {loadAttempts < 2 && (
            <button
              onClick={() => {
                setHasError(false)
                setIsLoading(true)
                setLoadAttempts(prev => prev + 1)
              }}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors"
            >
              Retry
            </button>
          )}
          {loadAttempts >= 2 && (
            <div className="mt-4">
              <SplineFallback className="w-full h-full" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center p-6">
            <div className="text-gray-500 mb-2">⚠️</div>
            <p className="text-sm text-gray-600 mb-2">3D scene failed to load</p>
            <p className="text-xs text-gray-400">This might be due to browser compatibility or network issues</p>
          </div>
        </div>
      }
    >
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B3D2E] border-t-transparent mx-auto mb-2"></div>
              <span className="text-sm text-muted-foreground">{(() => {
                const messages = ["Sharpening pencils…", "Warming the typewriter…", "Preparing your workspace…"];
                return messages[Math.floor(Math.random() * messages.length)];
              })()}</span>
            </div>
          </div>
        }
      >
        <SplineWrapper 
          ref={splineRef}
          scene={scene} 
          className={className}
          onLoad={() => {
            console.log('Spline scene loaded successfully')
            setHasError(false)
            setIsLoading(false)
          }}
          onError={(error) => {
            console.error('Spline error:', error)
            setHasError(true)
            setIsLoading(false)
          }}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
