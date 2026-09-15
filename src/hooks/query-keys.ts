/**
 * Centralized query keys for React Query
 * This ensures consistent cache invalidation and prevents key mismatches
 */

export const queryKeys = {
  // Profile queries
  profile: {
    all: ['profile'] as const,
    detail: (userId: string) => ['profile', userId] as const,
  },
  
  // License queries
  license: {
    all: ['license'] as const,
    entitlements: (userId: string) => ['license', 'entitlements', userId] as const,
  },
  
  // Subscription queries
  subscription: {
    all: ['subscription'] as const,
    details: (userId: string) => ['subscription', 'details', userId] as const,
  },
  
  // Download/release queries
  downloads: {
    all: ['downloads'] as const,
    releases: ['downloads', 'releases'] as const,
  },

  // AI usage queries
  aiUsage: {
    all: ['ai-usage'] as const,
    period: (userId: string) => ['ai-usage', 'period', userId] as const,
  },
} as const;

