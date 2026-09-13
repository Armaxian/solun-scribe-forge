import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNetworkState } from '@/hooks/use-network-state';

interface OfflineBannerProps {
  /** Minimum number of consecutive failures before showing banner */
  minFailures?: number;
}

/**
 * Banner component that shows when network requests fail repeatedly.
 * Detects offline state and provides user feedback with retry hint.
 */
export function OfflineBanner({ minFailures = 2 }: OfflineBannerProps) {
  const { isOnline, consecutiveFailures, resetFailures, isReconnecting } = useNetworkState();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner if offline OR if we have multiple consecutive failures
    const shouldShow = !isOnline || consecutiveFailures >= minFailures;
    setShowBanner(shouldShow);
  }, [isOnline, consecutiveFailures, minFailures]);

  // Hide banner when connection is restored
  useEffect(() => {
    if (isOnline && consecutiveFailures === 0 && showBanner) {
      // Small delay to ensure connection is stable
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, consecutiveFailures, showBanner]);

  if (!showBanner) {
    return null;
  }

  const handleRetry = () => {
    resetFailures();
    // Trigger a network check
    if ('navigator' in window && 'onLine' in navigator) {
      // Force a check by attempting to fetch a small resource
      fetch(window.location.origin + '/favicon.ico', {
        cache: 'no-store',
        mode: 'no-cors',
      }).catch(() => {
        // Ignore errors, we're just checking connectivity
      });
    }
  };

  return (
    <Alert
      variant="destructive"
      className="fixed top-0 left-0 right-0 z-[60] rounded-none border-x-0 border-t-0 shadow-lg"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {isReconnecting ? (
            <Wifi className="h-4 w-4 animate-pulse" />
          ) : !isOnline ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className="flex-1">
            {isReconnecting ? (
              <span>Reconnecting...</span>
            ) : !isOnline ? (
              <span>You're offline. Check your connection and try again.</span>
            ) : (
              <span>
                Having trouble connecting. Some features may not work. Try refreshing the page.
              </span>
            )}
          </AlertDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={isReconnecting}
          className="flex-shrink-0"
        >
          {isReconnecting ? 'Reconnecting...' : 'Retry'}
        </Button>
      </div>
    </Alert>
  );
}

