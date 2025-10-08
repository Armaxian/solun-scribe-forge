// Simple debounce polyfill to replace lodash.debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null

  const debounced = function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(this, args)
  } as T & { cancel: () => void }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

// Make it available globally to replace lodash.debounce
if (typeof window !== 'undefined') {
  (window as any).debounce = debounce
}
