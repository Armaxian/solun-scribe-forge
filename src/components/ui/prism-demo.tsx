import { useEffect, useState } from 'react';

import Prism from '@/components/ui/prism';

export default function PrismDemo() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion) {
    // Static gradient fallback for reduced motion preference
    return (
      <div className="w-full h-full relative bg-background">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                rgba(11, 61, 46, 0.15) 0%,
                rgba(11, 61, 46, 0.08) 40%,
                transparent 70%
              ),
              linear-gradient(
                135deg,
                rgba(52, 78, 65, 0.05) 0%,
                rgba(11, 61, 46, 0.03) 50%,
                transparent 100%
              )
            `,
          }}
          aria-label="Decorative background gradient"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-background">
      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={1}
        noise={0.5}
        glow={1}
      />
    </div>
  );
}
