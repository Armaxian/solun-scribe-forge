import React, { lazy, Suspense, useEffect, useState } from "react";

function GradientFallback() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#3b7253]/8 via-[#5aa07a]/8 to-[#7ab896]/8" />
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow errors and show graceful fallback
  }

  render() {
    if (this.state.hasError) {
      return <GradientFallback />;
    }
    return this.props.children;
  }
}

const LazyHeroCanvas = lazy(() => import("./HeroCanvas"));

export default function SafeHeroCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const disabled = import.meta.env.VITE_DISABLE_HERO_CANVAS === "true";

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch {
      // Non-browser environments; do nothing
    }
  }, []);

  if (disabled || reducedMotion) {
    return <GradientFallback />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<GradientFallback />}>
        <LazyHeroCanvas />
      </Suspense>
    </ErrorBoundary>
  );
}

