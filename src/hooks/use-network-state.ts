import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useRef, useCallback } from 'react';

interface NetworkState {
  isOnline: boolean;
  consecutiveFailures: number;
  isReconnecting: boolean;
  resetFailures: () => void;
}

/**
 * Checks if an error is a network-related error
 */
function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message?.toLowerCase() || '';
  const name = error.name || '';

  // Check for common network error patterns
  if (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    name === 'TypeError' ||
    name === 'NetworkError'
  ) {
    return true;
  }

  // Check for 5xx server errors (might indicate network issues)
  if ('status' in error) {
    const status = (error as { status?: number }).status;
    if (status && status >= 500) {
      return true;
    }
  }

  return false;
}

/**
 * Hook to track network state and consecutive fetch failures.
 * Provides reconnection detection without spamming toasts.
 */
export function useNetworkState(): NetworkState {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const wasOfflineRef = useRef(false);

  // Track online/offline events
  useEffect(() => {
    const handleOnline = () => {
      const wasOffline = wasOfflineRef.current;
      wasOfflineRef.current = false;
      setIsOnline(true);
      
      if (wasOffline) {
        // We were offline and now we're back online
        setIsReconnecting(true);
        
        // Reset failures after a short delay to ensure connection is stable
        reconnectTimeoutRef.current = setTimeout(() => {
          setConsecutiveFailures(0);
          setIsReconnecting(false);
          
          // Silently refetch active queries without showing toasts
          queryClient.refetchQueries({ type: 'active' });
        }, 1000);
      } else {
        // We were already online, just reset failures
        setConsecutiveFailures(0);
        setIsReconnecting(false);
      }
      
      // Clear any pending timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    const handleOffline = () => {
      wasOfflineRef.current = true;
      setIsOnline(false);
      setIsReconnecting(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [queryClient]);

  // Monitor React Query mutations for network failures
  useEffect(() => {
    const mutationCache = queryClient.getMutationCache();
    
    const unsubscribe = mutationCache.subscribe((event) => {
      if (event?.type === 'updated') {
        const mutation = event.mutation;
        if (mutation.state.status === 'error') {
          const error = mutation.state.error;
          if (isNetworkError(error)) {
            setConsecutiveFailures((prev) => prev + 1);
          }
        }
      }
    });

    return unsubscribe;
  }, [queryClient]);

  // Monitor React Query queries for network failures
  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    
    const unsubscribe = queryCache.subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        const error = event.query.state.error;
        if (isNetworkError(error)) {
          setConsecutiveFailures((prev) => prev + 1);
        }
      }
    });

    return unsubscribe;
  }, [queryClient]);

  const resetFailures = useCallback(() => {
    setConsecutiveFailures(0);
    setIsReconnecting(false);
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  return {
    isOnline,
    consecutiveFailures,
    isReconnecting,
    resetFailures,
  };
}

