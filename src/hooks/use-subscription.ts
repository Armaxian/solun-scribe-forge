import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { queryKeys } from './query-keys'
import { useSession } from './use-session'

import { tone } from '@/copy/tone'
import { 
  fetchSubscription, 
  createCheckoutSession, 
  createPortalSession,
  isSubscriptionActive,
  type Subscription,
  type StripeLookupKey,
  type CheckoutResponse,
  type PortalResponse,
} from '@/lib/stripe'


/**
 * Hook for fetching and managing user subscriptions
 */
export function useSubscription() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  // Fetch subscription data
  const query = useQuery({
    queryKey: user ? queryKeys.subscription.details(user.id) : ['subscription', 'details', 'none'],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated')
      return fetchSubscription()
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  })

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async ({ 
      lookupKey, 
      successUrl, 
      cancelUrl 
    }: { 
      lookupKey: StripeLookupKey
      successUrl?: string
      cancelUrl?: string 
    }): Promise<CheckoutResponse> => {
      if (!user) throw new Error('User not authenticated')
      return createCheckoutSession(lookupKey, { successUrl, cancelUrl })
    },
    onSuccess: (result) => {
      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url
      } else if (result.has_active_subscription) {
        const errorToast = tone.toast("error", "You already have an active subscription.")
        toast.error(errorToast.title, {
          description: "Manage your subscription from the Account page."
        })
      } else if (result.error) {
        const errorToast = tone.toast("error", result.error)
        toast.error(errorToast.title, {
          description: errorToast.description
        })
      }
    },
    onError: (error) => {
      console.error('Checkout error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout'
      const errorToast = tone.toast("error", errorMessage)
      toast.error(errorToast.title, {
        description: errorToast.description
      })
    },
  })

  // Portal mutation
  const portalMutation = useMutation({
    mutationFn: async (returnUrl?: string): Promise<PortalResponse> => {
      if (!user) throw new Error('User not authenticated')
      return createPortalSession(returnUrl)
    },
    onSuccess: (result) => {
      if (result.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = result.url
      } else if (result.error) {
        const errorToast = tone.toast("error", result.error)
        toast.error(errorToast.title, {
          description: errorToast.description
        })
      }
    },
    onError: (error) => {
      console.error('Portal error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to open billing portal'
      const errorToast = tone.toast("error", errorMessage)
      toast.error(errorToast.title, {
        description: errorToast.description
      })
    },
  })

  const subscription: Subscription | null = query.data ?? null

  return {
    // Subscription data
    subscription,
    loading: query.isLoading,
    error: query.error,
    isActive: isSubscriptionActive(subscription),
    tier: subscription?.tier ?? null,
    status: subscription?.status ?? null,
    
    // Actions
    refresh: () => {
      if (user) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.subscription.details(user.id) 
        })
        // Also invalidate entitlements since they're linked
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.license.entitlements(user.id) 
        })
      }
    },
    
    // Checkout
    startCheckout: checkoutMutation.mutate,
    startCheckoutAsync: checkoutMutation.mutateAsync,
    isCheckingOut: checkoutMutation.isPending,
    
    // Portal
    openPortal: portalMutation.mutate,
    openPortalAsync: portalMutation.mutateAsync,
    isOpeningPortal: portalMutation.isPending,
  }
}

