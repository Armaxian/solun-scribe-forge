import {
  User,
  LogOut,
  CreditCard,
  Key,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Clock,
  CalendarDays,
  Loader2,
  RefreshCw,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { tone } from "@/copy/tone";
import { useAIUsage } from "@/hooks/use-ai-usage";
import { useLicense } from "@/hooks/use-license";
import { useProfile } from "@/hooks/use-profile";
import { useSession } from "@/hooks/use-session";
import { useSubscription } from "@/hooks/use-subscription";
import { sanitizeSupabaseError, sanitizeError } from "@/lib/error-sanitizer";
import { 
  getTierDisplayName as getLicenseTierDisplayName, 
  getTierFeatures,
} from "@/lib/license";
import {
  getTierDisplayName as getSubscriptionTierDisplayName,
  formatPeriodEnd,
  isExpiringsSoon,
  SUBSCRIPTION_STATUS,
} from "@/lib/stripe";
import { signOut } from "@/lib/supabase";
import { sanitizeLicenseKey } from "@/lib/validation";

type LicenseStatus = 'none' | 'valid' | 'expired' | 'invalid';

export default function Account() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading, error: profileError, updateProfile, isUpdating } = useProfile();
  const [displayNameInput, setDisplayNameInput] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const { entitlements, loading: licenseLoading, isValidating, validateLicenseAsync } = useLicense();
  const {
    subscription,
    loading: subscriptionLoading,
    error: subscriptionError,
    isActive: hasActiveSubscription,
    openPortal,
    isOpeningPortal,
    refresh: refreshSubscription,
  } = useSubscription();
  const aiUsage = useAIUsage();

  // License state
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseKeyError, setLicenseKeyError] = useState<string | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>('none');
  const [licenseDetails, setLicenseDetails] = useState<{
    type: string;
    expiry: string;
    features: string[];
  } | null>(null);

  // Handle checkout success/cancelled from URL params
  useEffect(() => {
    const checkoutResult = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');

    if (checkoutResult === 'success' && sessionId) {
      // Show success message
      const successToast = tone.toast("success", "Checkout completed. Confirming your subscription…");
      toast.success(successToast.title, {
        description: "Your plan will appear once payment confirmation arrives. Use Refresh if it is still pending."
      });
      // Refresh subscription data
      refreshSubscription();
      // Clean up URL params
      setSearchParams(prev => {
        prev.delete('checkout');
        prev.delete('session_id');
        return prev;
      });
    }
  }, [searchParams, setSearchParams, refreshSubscription]);

  // Update license status and details when entitlements change
  useEffect(() => {
    if (!licenseLoading && entitlements) {
      if (entitlements.isValid && entitlements.tier) {
        setLicenseStatus('valid');
        setLicenseDetails({
          type: getLicenseTierDisplayName(entitlements.tier),
          expiry: entitlements.expiry || '',
          features: getTierFeatures(entitlements.tier)
        });
      } else if (!entitlements.isValid) {
        setLicenseStatus('expired');
        setLicenseDetails(null);
      } else {
        setLicenseStatus('none');
        setLicenseDetails(null);
      }
    } else if (!licenseLoading && !entitlements) {
      setLicenseStatus('none');
      setLicenseDetails(null);
    }
  }, [entitlements, licenseLoading]);



  const handleRedeemLicense = async () => {
    // Validate and sanitize license key
    const validation = sanitizeLicenseKey(licenseKey);
    if (!validation.valid) {
      const licenseForm = tone.form('licenseKey');
      const errorMessage = validation.error || licenseForm.validation.required || licenseForm.validation.pattern;
      setLicenseKeyError(errorMessage);
      const errorToast = tone.toast("error", errorMessage);
      toast.error(errorToast.title, {
        description: errorToast.description,
      });
      return;
    }
    
    // Use sanitized key
    const keyToUse = validation.sanitized || licenseKey;

    try {
      // Validate license via React Query mutation (automatically handles cache invalidation)
      const result = await validateLicenseAsync(keyToUse);

      if (result.valid && result.tier && result.expiry) {
        const tierDisplayName = getLicenseTierDisplayName(result.tier);
        setLicenseKeyError(null);
        const successToast = tone.toast("success", `${tierDisplayName} license is now active.`);
        toast.success(successToast.title, {
          description: successToast.description
        });
        setLicenseKey(''); // Clear the input
        // The useLicense hook will automatically refetch entitlements due to cache invalidation
      } else {
        // Handle different error cases
        if (result.error?.includes('expired')) {
          setLicenseStatus('expired');
          setLicenseDetails(null);
          const errorDetail = result.expiry ? `This license expired on ${new Date(result.expiry).toLocaleDateString()}.` : result.error;
          const errorToast = tone.toast("error", errorDetail);
          toast.error(errorToast.title, {
            description: errorToast.description
          });
        } else if (result.error?.includes('already assigned')) {
          setLicenseStatus('invalid');
          setLicenseDetails(null);
          const errorToast = tone.toast("error", "This license key is already assigned to another user.");
          toast.error(errorToast.title, {
            description: errorToast.description
          });
        } else if (result.error?.includes('revoked')) {
          setLicenseStatus('invalid');
          setLicenseDetails(null);
          const errorToast = tone.toast("error", "This license key has been revoked and is no longer valid.");
          toast.error(errorToast.title, {
            description: errorToast.description
          });
        } else {
          setLicenseStatus('invalid');
          setLicenseDetails(null);
          const errorDetail = result.error || "Please check your license key and try again.";
          const errorToast = tone.toast("error", errorDetail);
          toast.error(errorToast.title, {
            description: errorToast.description
          });
        }
        setLicenseKey(''); // Clear the input
      }
    } catch (error) {
      // Error handling is done in the mutation's onError, but handle UI state if needed
      console.error('Error redeeming license:', error);
      setLicenseKey(''); // Clear the input
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        // Log full error for debugging
        console.error('Sign out error:', error);
        const userMessage = sanitizeSupabaseError(error, 'sign out');
        const errorToast = tone.toast("error", userMessage);
        toast.error(errorToast.title, {
          description: errorToast.description,
        });
      } else {
        const successToast = tone.toast("success");
        toast.success(successToast.title, {
          description: successToast.description,
        });
        navigate('/');
      }
    } catch (error) {
      // Log full error for debugging
      console.error('Unexpected sign out error:', error);
      const userMessage = sanitizeError(error, 'sign out');
      const errorToast = tone.toast("error", userMessage);
      toast.error(errorToast.title, {
        description: errorToast.description,
      });
    } finally { setSigningOut(false); }
  };

  const handleOpenPortal = () => {
    openPortal(`${window.location.origin}/account`);
  };

  const getSubscriptionStatusBadge = () => {
    if (!subscription) return null;

    switch (subscription.status) {
      case SUBSCRIPTION_STATUS.ACTIVE:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case SUBSCRIPTION_STATUS.TRIALING:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trial</Badge>;
      case SUBSCRIPTION_STATUS.PAST_DUE:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Past Due</Badge>;
      case SUBSCRIPTION_STATUS.CANCELED:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Canceled</Badge>;
      case SUBSCRIPTION_STATUS.UNPAID:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{subscription.status}</Badge>;
    }
  };

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">{tone.loading('general')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  // Determine current plan name
  const getCurrentPlanName = () => {
    if (hasActiveSubscription && subscription?.tier) {
      return getSubscriptionTierDisplayName(subscription.tier);
    }
    if (licenseDetails) {
      return licenseDetails.type;
    }
    return 'Free Plan';
  };

  return (
    <>
      <Helmet>
        <title>Account Settings - Solun</title>
        <meta name="description" content="Manage your Solun account settings, profile information, and preferences." />
        <link rel="canonical" href="https://solun.app/account" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen section py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your Solun account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{displayName}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge className="mt-1">
                  {getCurrentPlanName()}
                </Badge>
              </div>
            </div>
            {profileError && <p role="alert" className="text-sm text-destructive">Unable to load your profile. Please refresh this page.</p>}
            <form className="space-y-3" onSubmit={event => { event.preventDefault(); updateProfile({ display_name: displayNameInput ?? profile?.display_name ?? '' }); }}>
              <Label htmlFor="display-name">Display name</Label>
              <Input id="display-name" maxLength={80} value={displayNameInput ?? profile?.display_name ?? ''} onChange={event => setDisplayNameInput(event.target.value)} />
              <Button disabled={isUpdating || !!profileError} type="submit">{isUpdating ? 'Saving…' : 'Save profile'}</Button>
            </form>
            <Link className="text-sm underline" to="/login?mode=reset">Change password</Link>
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscriptionError ? <div role="alert"><p>Unable to load your subscription. Please try again.</p><Button variant="outline" onClick={refreshSubscription}>Retry</Button></div> : subscriptionLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">{tone.loading('skeleton')}</p>
              </div>
            ) : hasActiveSubscription && subscription ? (
              <div className="space-y-4">
                {/* Active Subscription Card */}
                <div className={`p-4 rounded-lg border ${
                  subscription.cancel_at_period_end 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : isExpiringsSoon(subscription)
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className={`h-5 w-5 mt-0.5 ${
                      subscription.cancel_at_period_end 
                        ? 'text-yellow-600' 
                        : isExpiringsSoon(subscription)
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${
                          subscription.cancel_at_period_end 
                            ? 'text-yellow-800' 
                            : isExpiringsSoon(subscription)
                            ? 'text-orange-800'
                            : 'text-green-800'
                        }`}>
                          {getSubscriptionTierDisplayName(subscription.tier)} Plan
                        </h4>
                        {getSubscriptionStatusBadge()}
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {subscription.cancel_at_period_end 
                              ? `Cancels on ${formatPeriodEnd(subscription.current_period_end)}`
                              : `Renews on ${formatPeriodEnd(subscription.current_period_end)}`
                            }
                          </span>
                        </div>
                        
                        {subscription.cancel_at_period_end && (
                          <p className="text-yellow-700 mt-2">
                            Your subscription will end at the current billing period. 
                            You'll continue to have access until then.
                          </p>
                        )}
                        
                        {isExpiringsSoon(subscription) && !subscription.cancel_at_period_end && (
                          <p className="text-orange-700 mt-2">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Your subscription renews soon. Ensure your payment method is up to date.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manage Subscription Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleOpenPortal}
                    disabled={isOpeningPortal}
                    className="flex-1"
                  >
                    {isOpeningPortal ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Opening Portal...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => refreshSubscription()}
                    className="sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Use the customer portal to update payment methods, view invoices, 
                  change plans, or cancel your subscription.
                </p>
              </div>
            ) : subscription?.status === SUBSCRIPTION_STATUS.PAST_DUE ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">
                        Payment Past Due
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Your payment failed. Please update your payment method to continue using premium features.
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleOpenPortal} disabled={isOpeningPortal}>
                  {isOpeningPortal ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Opening Portal...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </>
                  )}
                </Button>
              </div>
            ) : subscription?.status === SUBSCRIPTION_STATUS.CANCELED ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Subscription Canceled
                      </h4>
                      <p className="text-sm text-gray-700">
                        Your subscription has been canceled. Subscribe again to restore access to premium features.
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/pricing">
                    View Plans
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="mb-1 font-medium">No active subscription</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to a plan to unlock premium features
                  </p>
                  <Button asChild>
                    <Link to="/pricing">
                      View Plans
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Usage Section */}
        {hasActiveSubscription && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Usage This Month
              </CardTitle>
              <CardDescription>
                Your AI writing assistance usage and remaining allowance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiUsage.loading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo border-t-transparent mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">{tone.loading('skeleton')}</p>
                </div>
              ) : aiUsage.error ? <div role="alert"><p>Unable to load AI usage.</p><Button variant="outline" onClick={() => aiUsage.refetch()}>Retry</Button></div> : aiUsage.usage ? (
                <>
                  {/* Requests Usage */}
                  {aiUsage.requestsLimit > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">AI Requests</span>
                        <span className="text-muted-foreground">
                          {aiUsage.requestsUsed.toLocaleString()} / {aiUsage.requestsLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                            aiUsage.requestsPercentage >= 90
                              ? 'bg-red-500'
                              : aiUsage.requestsPercentage >= 75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, aiUsage.requestsPercentage)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {aiUsage.requestsRemaining} requests remaining
                      </p>
                    </div>
                  )}

                  {/* Tokens Usage */}
                  {aiUsage.tokensLimit > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Tokens</span>
                        <span className="text-muted-foreground">
                          {aiUsage.tokensUsed.toLocaleString()} / {aiUsage.tokensLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                            aiUsage.tokensPercentage >= 90
                              ? 'bg-red-500'
                              : aiUsage.tokensPercentage >= 75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, aiUsage.tokensPercentage)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {aiUsage.tokensRemaining.toLocaleString()} tokens remaining
                      </p>
                    </div>
                  )}

                  {/* Period Info */}
                  {aiUsage.periodEnd && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          Usage resets on {new Date(aiUsage.periodEnd).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => aiUsage.refetch()}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Usage
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="mb-1 font-medium">No AI usage tracked yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start using AI writing assistance in the desktop app to see your usage here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* License Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              License Key
            </CardTitle>
            <CardDescription>
              Redeem a license key (for desktop app or promotional codes)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current License Status */}
            {licenseLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">{tone.loading('skeleton')}</p>
              </div>
            ) : licenseStatus === 'valid' && licenseDetails ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">
                      {licenseDetails.type} License Active
                    </h4>
                    <p className="text-sm text-green-700 mb-2">
                      Expires: {new Date(licenseDetails.expiry).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {licenseDetails.features.map((feature) => (
                        <Badge key={feature} className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : licenseStatus === 'expired' ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">
                      License Expired
                    </h4>
                    <p className="text-sm text-red-700">
                      Your license has expired. Redeem a new license key or subscribe to continue using premium features.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* License Redemption Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="license-key">License Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="license-key"
                    type="text"
                    placeholder="Enter your license key (e.g., SOLUN-PRO-2024-DEMO)"
                    value={licenseKey}
                    onChange={(e) => {
                      setLicenseKey(e.target.value);
                      // Clear error when user starts typing
                      if (licenseKeyError) setLicenseKeyError(null);
                    }}
                    onBlur={() => {
                      // Validate on blur if there's a value
                      if (licenseKey.trim()) {
                        const validation = sanitizeLicenseKey(licenseKey);
                        if (!validation.valid) {
                          const licenseForm = tone.form('licenseKey');
                          setLicenseKeyError(validation.error || licenseForm.validation.required || licenseForm.validation.pattern);
                        } else {
                          setLicenseKeyError(null);
                          // Auto-uppercase and sanitize on blur
                          if (validation.sanitized) {
                            setLicenseKey(validation.sanitized);
                          }
                        }
                      }
                    }}
                    className="font-mono text-sm"
                    disabled={isValidating}
                  />
                  <Button
                    onClick={handleRedeemLicense}
                    disabled={isValidating || !licenseKey.trim()}
                    className="flex items-center gap-2"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        Redeem
                      </>
                    )}
                  </Button>
                </div>
                {licenseKeyError && (
                  <p id="license-key-error" className="text-sm font-medium text-destructive">
                    {licenseKeyError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  License keys are case-insensitive. Example: SOLUN-PRO-2024-DEMO
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Sign Out Section */}
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-destructive">Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
