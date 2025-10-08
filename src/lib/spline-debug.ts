// Utility to debug Spline scene loading issues

export async function testSplineScene(sceneUrl: string): Promise<{
  accessible: boolean
  status?: number
  error?: string
}> {
  try {
    console.log('Testing Spline scene URL:', sceneUrl)
    
    const response = await fetch(sceneUrl, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache'
    })
    
    if (response.ok) {
      console.log('✅ Spline scene URL is accessible')
      return { accessible: true, status: response.status }
    } else {
      console.warn('⚠️ Spline scene URL returned status:', response.status)
      return { accessible: false, status: response.status }
    }
  } catch (error) {
    console.error('❌ Spline scene URL test failed:', error)
    return { 
      accessible: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export function getBrowserCompatibility(): {
  webgl: boolean
  webgl2: boolean
  userAgent: string
} {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  const gl2 = canvas.getContext('webgl2')
  
  return {
    webgl: !!gl,
    webgl2: !!gl2,
    userAgent: navigator.userAgent
  }
}

export function logSplineDebugInfo(sceneUrl: string) {
  console.group('🔍 Spline Debug Information')
  
  // Test scene URL
  testSplineScene(sceneUrl).then(result => {
    console.log('Scene URL test:', result)
  })
  
  // Check browser compatibility
  const compatibility = getBrowserCompatibility()
  console.log('Browser compatibility:', compatibility)
  
  // Check if Spline library is available
  console.log('Spline library available:', typeof window !== 'undefined' && 'Spline' in window)
  
  console.groupEnd()
}
