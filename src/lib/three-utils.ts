// Utility to handle Three.js instance management
// This helps prevent the "Multiple instances of Three.js" warning

let threeInstanceCount = 0;

export function registerThreeInstance() {
  threeInstanceCount++;
  if (threeInstanceCount > 1 && import.meta.env.DEV) {
    console.warn(`Multiple Three.js instances detected (${threeInstanceCount}). This is expected when using Spline components.`);
  }
}

export function unregisterThreeInstance() {
  threeInstanceCount = Math.max(0, threeInstanceCount - 1);
}

export function getThreeInstanceCount() {
  return threeInstanceCount;
}

// Check if we're in a browser environment
export function isBrowser() {
  return typeof window !== 'undefined';
}

// Suppress Three.js warnings in development
export function suppressThreeWarnings() {
  if (import.meta.env.DEV && isBrowser()) {
    // Override console.warn to filter out Three.js multiple instance warnings
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('Multiple instances of Three.js')) {
        // Suppress this specific warning as it's expected with Spline
        return;
      }
      originalWarn.apply(console, args);
    };
  }
}
