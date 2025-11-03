import { useQuery } from '@tanstack/react-query';
import {
  getReleaseConfig,
  type Platform,
  type ReleaseInfo,
} from '@/lib/releases';
import { queryKeys } from './query-keys';

/**
 * Hook for fetching download/release metadata
 */
export function useDownloads() {
  const query = useQuery({
    queryKey: queryKeys.downloads.releases,
    queryFn: getReleaseConfig,
    staleTime: 1000 * 60 * 15, // 15 minutes - release data changes infrequently
    gcTime: 1000 * 60 * 60, // 1 hour - keep in cache longer
    retry: 2,
  });

  return {
    releases: query.data ?? {},
    loading: query.isLoading,
    error: query.error,
    isError: query.isError,
  };
}

