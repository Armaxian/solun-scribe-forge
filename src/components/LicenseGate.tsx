import { ReactNode } from 'react';
import { useLicense } from '@/hooks/use-license';
import { LicenseTier } from '@/lib/license';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';

interface LicenseGateProps {
  children: ReactNode;
  minTier: LicenseTier;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Component that gates content behind license validation.
 * Shows fallback UI if user doesn't have required license tier.
 */
export function LicenseGate({ 
  children, 
  minTier, 
  fallback,
  redirectTo = '/account'
}: LicenseGateProps) {
  const { entitlements, loading, isValid, tier } = useLicense();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo"></div>
      </div>
    );
  }

  // Check if user has required tier
  const tierOrder: Record<string, number> = {
    'basic': 1,
    'professional': 2,
    'team': 3,
  };

  const userTierLevel = tier ? tierOrder[tier] : 0;
  const requiredTierLevel = tierOrder[minTier] || 0;
  const hasAccess = isValid && userTierLevel >= requiredTierLevel;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback UI
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Lock className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Premium Feature</CardTitle>
          </div>
          <CardDescription>
            This feature requires a {minTier} license or higher.
            {tier && (
              <span className="block mt-1">
                Your current tier: <strong>{tier}</strong>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Upgrade your license to unlock this feature</span>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link to={redirectTo}>
                Manage License
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

