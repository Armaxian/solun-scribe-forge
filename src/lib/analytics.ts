import posthog from 'posthog-js'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
}

export class Analytics {
  private static instance: Analytics
  private enabled = true

  private constructor() {
    // Check for Do Not Track
    const dnt = navigator.doNotTrack || (window as any).doNotTrack
    if (dnt === '1' || dnt === 'yes') {
      this.enabled = false
      console.log('Analytics disabled due to Do Not Track setting')
      return
    }

    // Initialize PostHog with cookieless mode
    if (import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST) {
      posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: import.meta.env.VITE_POSTHOG_HOST,
        persistence: 'memory', // Cookieless mode - data stored in memory only
        disable_session_recording: true, // Respect privacy
        disable_persistence: true, // No localStorage or cookies
        loaded: (posthog) => {
          if (import.meta.env.DEV) {
            console.log('PostHog loaded in development mode')
          }
        }
      })

      // Disable automatic pageview tracking for manual control
      posthog.opt_out_capturing()
    } else if (import.meta.env.DEV) {
      console.log('PostHog not configured - running in development mode without analytics')
      this.enabled = false
    } else {
      console.warn('PostHog configuration missing in production')
      this.enabled = false
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
      posthog.capture(event.name, event.properties)
      if (import.meta.env.DEV) {
        console.log('Analytics event:', event)
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  pageView(page: string): void {
    if (!this.enabled) return

    try {
      posthog.capture('$pageview', { page })
      if (import.meta.env.DEV) {
        console.log('Page view:', page)
      }
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }

  identify(userId: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return

    try {
      posthog.identify(userId, properties)
      if (import.meta.env.DEV) {
        console.log('User identified:', userId, properties)
      }
    } catch (error) {
      console.error('User identification error:', error)
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }
}

export const analytics = Analytics.getInstance()
