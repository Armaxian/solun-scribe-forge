'use client'
import { cn } from '@/lib/utils'

export function PaperBackground({ className }: { className?: string }) {
  // Enhanced paper effect with multiple layers for realistic texture
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-50',
        'bg-[#f5f2e8]', // Warm cream base
        className
      )}
      style={{
        // Multi-layered paper effect
        backgroundImage: `
          /* Subtle vignette */
          radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.02) 100%),
          /* Paper fiber texture */
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.01) 2px,
            rgba(0,0,0,0.01) 4px
          ),
          /* Noise grain texture */
          url('/textures/noise.svg'),
          /* Base cream with slight warmth */
          linear-gradient(135deg, #f5f2e8 0%, #f7f4ea 100%)
        `,
        backgroundSize: '100% 100%, 8px 8px, 420px 420px, 100% 100%',
        backgroundPosition: 'center, 0 0, 0 0, center',
        backgroundBlendMode: 'normal, multiply, multiply, normal',
        // Add subtle paper-like shadow
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.01)',
      }}
    />
  )
}
