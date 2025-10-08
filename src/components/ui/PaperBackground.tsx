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
          /* Edge vignette */
          radial-gradient(ellipse at center, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.035) 100%),
          /* Deckled edges subtle darkening */
          radial-gradient(1200px 400px at 50% -200px, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.00) 70%),
          radial-gradient(1200px 400px at 50% calc(100% + 200px), rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.00) 70%),
          /* Fine horizontal grain */
          repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.012) 0px,
            rgba(0,0,0,0.012) 1px,
            transparent 1px,
            transparent 3px
          ),
          /* Fine vertical grain */
          repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0.01) 0px,
            rgba(0,0,0,0.01) 1px,
            transparent 1px,
            transparent 4px
          ),
          /* Soft fibers (diagonal) */
          repeating-linear-gradient(
            45deg,
            rgba(0,0,0,0.008) 0px,
            rgba(0,0,0,0.008) 2px,
            transparent 2px,
            transparent 6px
          ),
          /* Speckle dots */
          radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 0.5px, transparent 1px),
          radial-gradient(circle at 70% 60%, rgba(0,0,0,0.025) 0.5px, transparent 1px),
          radial-gradient(circle at 40% 80%, rgba(0,0,0,0.02) 0.5px, transparent 1px),
          /* Noise grain textures at two scales */
          url('/textures/noise.svg'),
          url('/textures/noise.svg'),
          /* Base cream with slight warmth */
          linear-gradient(135deg, #f5f2e8 0%, #f7f4ea 100%)
        `,
        backgroundSize: [
          '100% 100%', // vignette
          '100% 100%', // top deckle
          '100% 100%', // bottom deckle
          '100% 100%', // horizontal grain
          '100% 100%', // vertical grain
          '100% 100%', // fibers
          '6px 6px',    // speckles 1
          '7px 7px',    // speckles 2
          '9px 9px',    // speckles 3
          '320px 320px', // noise fine
          '540px 540px', // noise coarse
          '100% 100%'    // base
        ].join(', '),
        backgroundPosition: [
          'center',
          'center',
          'center',
          '0 0',
          '0 0',
          '0 0',
          '0 0',
          '0 0',
          '0 0',
          '0 0',
          '0 0',
          'center'
        ].join(', '),
        backgroundRepeat: [
          'no-repeat',
          'no-repeat',
          'no-repeat',
          'repeat',
          'repeat',
          'repeat',
          'repeat',
          'repeat',
          'repeat',
          'repeat',
          'repeat',
          'no-repeat'
        ].join(', '),
        backgroundBlendMode: [
          'multiply', // vignette
          'multiply', // top deckle
          'multiply', // bottom deckle
          'multiply', // horizontal grain
          'multiply', // vertical grain
          'multiply', // fibers
          'multiply', // speckles 1
          'multiply', // speckles 2
          'multiply', // speckles 3
          'multiply', // noise fine
          'multiply', // noise coarse
          'normal'    // base
        ].join(', '),
        // Subtle internal shading and slight tonal shaping to feel tactile
        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.04)',
        filter: 'saturate(1.02) contrast(1.02) brightness(1.0)',
      }}
    />
  )
}
