import posthog from 'posthog-js'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
}

export class Analytics {
  private static instance: Analytics
  private enabled = true
  private posthogInstance: any = null

  private constructor() {
    // Check for Do Not Track
    const dnt = navigator.doNotTrack || (window as any).doNotTrack
    if (dnt === '1' || dnt === 'yes') {
      this.enabled = false
      console.log('Analytics disabled due to Do Not Track setting')
      return
    }

    // Check if PostHog is configured and initialized
    if (!import.meta.env.VITE_PUBLIC_POSTHOG_KEY || !import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
      if (import.meta.env.DEV) {
        console.log('PostHog not configured - running in development mode without analytics')
      } else {
        console.warn('PostHog configuration missing in production')
      }
      this.enabled = false
    } else if (!posthog.__loaded) {
      // PostHog might not be initialized yet, wait a bit
      setTimeout(() => {
        if (!posthog.__loaded) {
          console.warn('PostHog not loaded, analytics disabled')
          this.enabled = false
        }
      }, 1000)
    }

    // Set up error handling for blocked requests
    this.setupErrorHandling()
  }

  private setupErrorHandling(): void {
    // Listen for network errors that might indicate blocked requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args)
      } catch (error: any) {
        // Check if it's a blocked request error
        if (error.message?.includes('ERR_BLOCKED_BY_CLIENT') || 
            error.message?.includes('Failed to fetch') ||
            error.name === 'TypeError') {
          if (import.meta.env.DEV) {
            console.warn('Network request blocked (likely by ad blocker):', error.message)
          }
          // Don't disable analytics completely, just log the error
        }
        throw error
      }
    }
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  track(event: AnalyticsEvent): void {
    if (!this.enabled) return

    try {
      // Check if PostHog is blocked
      if (this.isPostHogBlocked()) {
        this.handleBlockedRequest()
        return
      }

      // Use the stored PostHog instance if available, otherwise fall back to global posthog
      const posthogInstance = this.posthogInstance || posthog
      
      // Check if PostHog is available and not blocked
      if (typeof posthogInstance !== 'undefined' && posthogInstance.__loaded) {
        posthogInstance.capture(event.name, event.properties)
        if (import.meta.env.DEV) {
          console.log('Analytics event:', event)
        }
      } else {
        if (import.meta.env.DEV) {
          console.log('PostHog not available, skipping analytics event:', event)
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking error (likely blocked by ad blocker):', error)
      }
      // Don't disable analytics completely, just log the error
    }
  }

  pageView(page: string): void {
    if (!this.enabled) return

    try {
      // Check if PostHog is blocked
      if (this.isPostHogBlocked()) {
        this.handleBlockedRequest()
        return
      }

      // Use the stored PostHog instance if available, otherwise fall back to global posthog
      const posthogInstance = this.posthogInstance || posthog
      
      // Check if PostHog is available and not blocked
      if (typeof posthogInstance !== 'undefined' && posthogInstance.__loaded) {
        posthogInstance.capture('$pageview', { page })
        if (import.meta.env.DEV) {
          console.log('Page view:', page)
        }
      } else {
        if (import.meta.env.DEV) {
          console.log('PostHog not available, skipping page view:', page)
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Page view tracking error (likely blocked by ad blocker):', error)
      }
    }
  }

  identify(userId: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return

    try {
      // Check if PostHog is blocked
      if (this.isPostHogBlocked()) {
        this.handleBlockedRequest()
        return
      }

      // Use the stored PostHog instance if available, otherwise fall back to global posthog
      const posthogInstance = this.posthogInstance || posthog
      
      // Check if PostHog is available and not blocked
      if (typeof posthogInstance !== 'undefined' && posthogInstance.__loaded) {
        posthogInstance.identify(userId, properties)
        if (import.meta.env.DEV) {
          console.log('User identified:', userId, properties)
        }
      } else {
        if (import.meta.env.DEV) {
          console.log('PostHog not available, skipping user identification:', userId)
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('User identification error (likely blocked by ad blocker):', error)
      }
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setPostHogInstance(instance: any): void {
    this.posthogInstance = instance
    if (import.meta.env.DEV) {
      console.log('PostHog instance set in analytics')
    }
  }

  private isPostHogBlocked(): boolean {
    // Check if PostHog requests are being blocked
    try {
      const posthogInstance = this.posthogInstance || posthog
      return !posthogInstance || !posthogInstance.__loaded
    } catch {
      return true
    }
  }

  private handleBlockedRequest(): void {
    if (import.meta.env.DEV) {
      console.warn('PostHog appears to be blocked by ad blocker or browser extension')
    }
  }
}

export const analytics = Analytics.getInstance()