import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys } from './query-keys';
import { useSession } from './use-session';

import { tone } from '@/copy/tone';
import { sanitizeSupabaseError } from '@/lib/error-sanitizer';
import { supabase, type Database } from '@/lib/supabase';


type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Fetches a user's profile from Supabase
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found - return null (profile might not exist yet)
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Updates a user's profile
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.display_name?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Hook for fetching and managing user profile
 */
export function useProfile() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: user ? queryKeys.profile.detail(user.id) : ['profile', 'none'],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return fetchProfile(user.id);
    },
    enabled: !!user, // Only run if user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes - profile data doesn't change often
    retry: (failureCount, error) => {
      // Don't retry on 404 (profile doesn't exist)
      if (error instanceof Error && 'code' in error && error.code === 'PGRST116') {
        return false;
      }
      return failureCount < 2;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Omit<Profile, 'id' | 'created_at'>>) => {
      if (!user) throw new Error('User not authenticated');
      return updateProfile(user.id, updates);
    },
    onSuccess: (data) => {
      // Optimistically update the cache
      if (user) {
        queryClient.setQueryData(queryKeys.profile.detail(user.id), data);
      }
      // Optionally invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      const successToast = tone.toast("success");
      toast.success(successToast.title, {
        description: successToast.description,
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      const userMessage = sanitizeSupabaseError(
        error as { code?: string; message?: string },
        'profile update'
      );
      const errorToast = tone.toast("error", userMessage);
      toast.error(errorToast.title, {
        description: errorToast.description,
      });
    },
  });

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    error: query.error,
    updateProfile: updateMutation.mutate,
    updateProfileAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

