import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from './use-session';
import { fetchUserEntitlements, hasValidLicense, validateLicense, type LicenseTier, type LicenseDetails, type ValidateLicenseResponse } from '@/lib/license';
import { toast } from 'sonner';
import { tone } from '@/copy/tone';
import { queryKeys } from './query-keys';

/**
 * Hook for fetching and managing user license/entitlements
 */
export function useLicense() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: user ? queryKeys.license.entitlements(user.id) : ['license', 'entitlements', 'none'],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchUserEntitlements();
    },
    enabled: !!user, // Only run if user is authenticated
    staleTime: 1000 * 60 * 2, // 2 minutes - license status might change
    retry: 2,
  });

  const validateMutation = useMutation({
    mutationFn: (key: string): Promise<ValidateLicenseResponse> => {
      if (!user) throw new Error('User not authenticated');
      return validateLicense(key);
    },
    onSuccess: (result) => {
      // Invalidate entitlements query to refetch after successful validation
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.license.entitlements(user.id) });
      }
    },
    onError: (error) => {
      console.error('Error validating license:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again later.';
      const errorToast = tone.toast("error", errorMessage);
      toast.error(errorToast.title, {
        description: errorToast.description,
      });
    },
  });

  const checkAccess = async (minTier: LicenseTier = 'basic'): Promise<boolean> => {
    if (!user) return false;
    return await hasValidLicense(minTier);
  };

  const entitlements: LicenseDetails | null = query.data ?? null;

  return {
    entitlements,
    loading: query.isLoading,
    error: query.error,
    isValid: entitlements?.isValid ?? false,
    tier: entitlements?.tier ?? null,
    refresh: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.license.entitlements(user.id) });
      }
    },
    checkAccess,
    validateLicense: validateMutation.mutate,
    validateLicenseAsync: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
  };
}

