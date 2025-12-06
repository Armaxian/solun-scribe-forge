import { supabase } from './supabase'

/**
 * Stripe price lookup keys - must match configuration in Stripe Dashboard
 * Following workspace convention: use const object with UPPERCASE_WITH_UNDERSCORE members
 */
export const STRIPE_LOOKUP_KEYS = {
  PRO_MONTHLY: 'solun_pro_monthly',
  PRO_YEARLY: 'solun_pro_yearly',
  TEAM_MONTHLY: 'solun_team_monthly',
  TEAM_YEARLY: 'solun_team_yearly',
} as const

export type StripeLookupKey = typeof STRIPE_LOOKUP_KEYS[keyof typeof STRIPE_LOOKUP_KEYS]

/**
 * Subscription status types matching Stripe's subscription statuses
 */
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  TRIALING: 'trialing',
  UNPAID: 'unpaid',
  PAUSED: 'paused',
} as const

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS]

/**
 * Subscription tier types
 */
export type SubscriptionTier = 'basic' | 'professional' | 'team' | null

/**
 * Subscription details from database
 */
export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  tier: SubscriptionTier
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  trial_start: string | null
  trial_end: string | null
  created_at: string
  updated_at: string
}

/**
 * Response from checkout session creation
 */
export interface CheckoutResponse {
  url?: string
  session_id?: string
  error?: string
  has_active_subscription?: boolean
}

/**
 * Response from portal session creation
 */
export interface PortalResponse {
  url?: string
  error?: string
}

/**
 * Creates a Stripe checkout session for a subscription
 */
export async function createCheckoutSession(
  lookupKey: StripeLookupKey,
  options?: {
    successUrl?: string
    cancelUrl?: string
  }
): Promise<CheckoutResponse> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Not authenticated. Please log in to continue.' }
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          lookup_key: lookupKey,
          success_url: options?.successUrl,
          cancel_url: options?.cancelUrl,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return { 
        error: result.error || 'Failed to create checkout session',
        has_active_subscription: result.has_active_subscription
      }
    }

    return result
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { error: 'Failed to connect to payment service. Please try again.' }
  }
}

/**
 * Creates a Stripe customer portal session for managing subscriptions
 */
export async function createPortalSession(returnUrl?: string): Promise<PortalResponse> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Not authenticated. Please log in to continue.' }
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          return_url: returnUrl,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return { error: result.error || 'Failed to access billing portal' }
    }

    return result
  } catch (error) {
    console.error('Error creating portal session:', error)
    return { error: 'Failed to connect to payment service. Please try again.' }
  }
}

/**
 * Fetches the current user's subscription from the database
 */
export async function fetchSubscription(): Promise<Subscription | null> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No subscription found
        return null
      }
      console.error('Error fetching subscription:', error)
      return null
    }

    return data as Subscription
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

/**
 * Checks if user has an active subscription
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === SUBSCRIPTION_STATUS.ACTIVE || 
         subscription.status === SUBSCRIPTION_STATUS.TRIALING
}

/**
 * Gets the display name for a subscription tier
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'basic':
      return 'Basic'
    case 'professional':
      return 'Pro'
    case 'team':
      return 'Team'
    default:
      return 'Free'
  }
}

/**
 * Gets the subscription tier from a lookup key
 */
export function getTierFromLookupKey(lookupKey: StripeLookupKey): SubscriptionTier {
  if (lookupKey.includes('team')) return 'team'
  if (lookupKey.includes('pro')) return 'professional'
  return 'basic'
}

/**
 * Checks if current billing is monthly or yearly based on lookup key
 */
export function isYearlyBilling(lookupKey: StripeLookupKey): boolean {
  return lookupKey.includes('yearly')
}

/**
 * Helper to format subscription period end date
 */
export function formatPeriodEnd(periodEnd: string | null): string {
  if (!periodEnd) return 'N/A'
  return new Date(periodEnd).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Helper to check if subscription is about to expire (within 7 days)
 */
export function isExpiringsSoon(subscription: Subscription | null): boolean {
  if (!subscription?.current_period_end) return false
  if (!isSubscriptionActive(subscription)) return false
  
  const periodEnd = new Date(subscription.current_period_end)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0
}

