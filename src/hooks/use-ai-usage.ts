import { useQuery } from '@tanstack/react-query'
import { useSession } from './use-session'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './query-keys'

export interface UsagePeriod {
  user_id: string
  current_period_start: string
  current_period_end: string
  period_requests_used: number
  period_tokens_used: number
  period_cost_used: number
  tier: 'professional' | 'team' | null
  created_at: string
  updated_at: string
}

export interface PlanAllowance {
  tier: 'professional' | 'team'
  requests_per_month: number | null
  tokens_per_month: number | null
  cost_limit_usd: number | null
  allow_overage: boolean
}

/**
 * Hook to fetch current user's AI usage for the current period
 */
export function useAIUsage() {
  const { user } = useSession()

  const usageQuery = useQuery({
    queryKey: user ? queryKeys.aiUsage.period(user.id) : ['ai-usage', 'none'],
    queryFn: async (): Promise<UsagePeriod | null> => {
      if (!user) return null

      const { data, error } = await supabase
        .from('user_usage_periods')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No usage period yet - user might not have subscription
          return null
        }
        throw error
      }

      return data as UsagePeriod
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds - usage changes frequently
    retry: 2,
  })

  const allowanceQuery = useQuery({
    queryKey: ['plan-allowances', usageQuery.data?.tier],
    queryFn: async (): Promise<PlanAllowance | null> => {
      if (!usageQuery.data?.tier) return null

      const { data, error } = await supabase
        .from('plan_allowances')
        .select('*')
        .eq('tier', usageQuery.data.tier)
        .single()

      if (error) {
        throw error
      }

      return data as PlanAllowance
    },
    enabled: !!usageQuery.data?.tier,
    staleTime: 1000 * 60 * 5, // 5 minutes - allowances don't change often
  })

  // Calculate usage percentages
  const getUsagePercentage = (type: 'requests' | 'tokens') => {
    if (!usageQuery.data || !allowanceQuery.data) return 0

    if (type === 'requests') {
      const limit = allowanceQuery.data.requests_per_month
      if (!limit) return 0
      return Math.min(100, (usageQuery.data.period_requests_used / limit) * 100)
    } else {
      const limit = allowanceQuery.data.tokens_per_month
      if (!limit) return 0
      return Math.min(100, (usageQuery.data.period_tokens_used / limit) * 100)
    }
  }

  const getRemaining = (type: 'requests' | 'tokens') => {
    if (!usageQuery.data || !allowanceQuery.data) return 0

    if (type === 'requests') {
      const limit = allowanceQuery.data.requests_per_month
      if (!limit) return 0
      return Math.max(0, limit - usageQuery.data.period_requests_used)
    } else {
      const limit = allowanceQuery.data.tokens_per_month
      if (!limit) return 0
      return Math.max(0, limit - usageQuery.data.period_tokens_used)
    }
  }

  return {
    usage: usageQuery.data,
    allowance: allowanceQuery.data,
    loading: usageQuery.isLoading || allowanceQuery.isLoading,
    error: usageQuery.error || allowanceQuery.error,

    // Helpers
    requestsUsed: usageQuery.data?.period_requests_used || 0,
    requestsLimit: allowanceQuery.data?.requests_per_month || 0,
    requestsRemaining: getRemaining('requests'),
    requestsPercentage: getUsagePercentage('requests'),

    tokensUsed: usageQuery.data?.period_tokens_used || 0,
    tokensLimit: allowanceQuery.data?.tokens_per_month || 0,
    tokensRemaining: getRemaining('tokens'),
    tokensPercentage: getUsagePercentage('tokens'),

    periodStart: usageQuery.data?.current_period_start,
    periodEnd: usageQuery.data?.current_period_end,

    refetch: () => {
      usageQuery.refetch()
      allowanceQuery.refetch()
    },
  }
}
