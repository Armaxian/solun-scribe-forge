// Analytics placeholder for PostHog or Umami integration
// Replace with actual analytics implementation when ready

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
}

export class Analytics {
  private static instance: Analytics

  private constructor() {
    // Initialize analytics service here
    // Example: PostHog, Umami, Google Analytics, etc.
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  track(event: AnalyticsEvent): void {
    // Track event
    console.log('Analytics event:', event)
  }

  pageView(page: string): void {
    // Track page view
    console.log('Page view:', page)
  }

  identify(userId: string, properties?: Record<string, unknown>): void {
    // Identify user
    console.log('User identified:', userId, properties)
  }
}

export const analytics = Analytics.getInstance()
