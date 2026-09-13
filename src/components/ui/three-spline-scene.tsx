'use client'

import SplineLoader from '@splinetool/loader'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface ThreeSplineSceneProps {
  sceneUrl: string
  className?: string
}

export function ThreeSplineScene({ sceneUrl, className }: ThreeSplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -50000,
      10000
    )
    camera.position.set(0, 0, 0)
    camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0))
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.setClearAlpha(1)
    rendererRef.current = renderer

    // Scene settings
    scene.background = new THREE.Color('#d6f0de')
    scene.fog = new THREE.Fog('#d6f0de', 1230.869, 2000)

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.125
    controlsRef.current = controls

    // Add renderer to container
    containerRef.current.appendChild(renderer.domElement)

    // Load Spline scene
    const loader = new SplineLoader()
    loader.load(
      sceneUrl,
      (splineScene) => {
        scene.add(splineScene)
        setIsLoading(false)
        setHasError(false)
      },
      undefined,
      (error) => {
        console.error('Error loading Spline scene:', error)
        setHasError(true)
        setIsLoading(false)
      }
    )

    // Animation loop
    function animate(time: number) {
      if (controls) {
        controls.update()
      }
      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
      animationIdRef.current = requestAnimationFrame(animate)
    }
    animate(0)

    // Window resize handler
    function onWindowResize() {
      if (camera && renderer) {
        camera.left = window.innerWidth / -2
        camera.right = window.innerWidth / 2
        camera.top = window.innerHeight / 2
        camera.bottom = window.innerHeight / -2
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener('resize', onWindowResize)

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (renderer) {
        renderer.dispose()
      }
      if (controls) {
        controls.dispose()
      }
      window.removeEventListener('resize', onWindowResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [sceneUrl])

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <div className="text-center p-6">
          <div className="text-gray-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600 mb-2">3D scene failed to load</p>
          <p className="text-xs text-gray-400">This might be due to browser compatibility or network issues</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-phthalo border-t-transparent mx-auto mb-2"></div>
            <span className="text-sm text-muted-foreground">{(() => {
              // Use dynamic import to avoid bundling tone in 3D scene component
              // For now, use inline message similar to tone.loading()
              const messages = ["Sharpening pencils…", "Warming the typewriter…", "Preparing your workspace…"];
              return messages[Math.floor(Math.random() * messages.length)];
            })()}</span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
