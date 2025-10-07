import { usePostHog } from 'posthog-js/react'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
}

export class Analytics {
  private static instance: Analytics
  private enabled = true
  private posthog: ReturnType<typeof usePostHog> | null = null

  private constructor() {
    // Check for Do Not Track
    const dnt = navigator.doNotTrack || (window as any).doNotTrack
    if (dnt === '1' || dnt === 'yes') {
      this.enabled = false
      console.log('Analytics disabled due to Do Not Track setting')
      return
    }

    // PostHog is initialized via PostHogProvider in main.tsx
    // We'll get the instance using the hook where needed
    if (!import.meta.env.VITE_PUBLIC_POSTHOG_KEY || !import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
      if (import.meta.env.DEV) {
        console.log('PostHog not configured - running in development mode without analytics')
      } else {
        console.warn('PostHog configuration missing in production')
      }
      this.enabled = false
    }
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  setPostHogInstance(instance: ReturnType<typeof usePostHog>) {
    this.posthog = instance
  }

  track(event: AnalyticsEvent): void {
    if (!this.enabled || !this.posthog) return

    try {
      this.posthog.capture(event.name, event.properties)
      if (import.meta.env.DEV) {
        console.log('Analytics event:', event)
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  pageView(page: string): void {
    if (!this.enabled || !this.posthog) return

    try {
      this.posthog.capture('$pageview', { page })
      if (import.meta.env.DEV) {
        console.log('Page view:', page)
      }
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }

  identify(userId: string, properties?: Record<string, unknown>): void {
    if (!this.enabled || !this.posthog) return

    try {
      this.posthog.identify(userId, properties)
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