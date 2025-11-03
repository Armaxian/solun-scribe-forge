import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { useProfile } from "@/hooks/use-profile";
import { useLicense } from "@/hooks/use-license";
import { signOut } from "@/lib/supabase";
import { sanitizeLicenseKey } from "@/lib/validation";
import { 
  getTierDisplayName, 
  getTierFeatures,
} from "@/lib/license";
import { User, LogOut, Monitor, CreditCard, Key, CheckCircle, AlertCircle } from "lucide-react";

type LicenseStatus = 'none' | 'valid' | 'expired' | 'invalid';

export default function Account() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading } = useProfile();
  const { entitlements, loading: licenseLoading, isValidating, validateLicenseAsync } = useLicense();

  // License state
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>('none');
  const [licenseDetails, setLicenseDetails] = useState<{
    type: string;
    expiry: string;
    features: string[];
  } | null>(null);

  // Update license status and details when entitlements change
  useEffect(() => {
    if (!licenseLoading && entitlements) {
      if (entitlements.isValid && entitlements.tier) {
        setLicenseStatus('valid');
        setLicenseDetails({
          type: getTierDisplayName(entitlements.tier),
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

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate('/login');
      return;
    }
  }, [user, sessionLoading, navigate]);

  const handleRedeemLicense = async () => {
    // Validate and sanitize license key
    const validation = sanitizeLicenseKey(licenseKey);
    if (!validation.valid) {
      toast.error("Invalid license key", {
        description: validation.error || 'Please check your license key format.',
      });
      return;
    }
    
    // Use sanitized key
    const keyToUse = validation.sanitized || licenseKey;

    try {
      // Validate license via React Query mutation (automatically handles cache invalidation)
      const result = await validateLicenseAsync(keyToUse);

      if (result.valid && result.tier && result.expiry) {
        const tierDisplayName = getTierDisplayName(result.tier);
        toast.success("License activated successfully!", {
          description: `${tierDisplayName} license is now active.`
        });
        setLicenseKey(''); // Clear the input
        // The useLicense hook will automatically refetch entitlements due to cache invalidation
      } else {
        // Handle different error cases
        if (result.error?.includes('expired')) {
          setLicenseStatus('expired');
          setLicenseDetails(null);
          toast.error("License key has expired", {
            description: result.expiry ? `This license expired on ${new Date(result.expiry).toLocaleDateString()}.` : result.error
          });
        } else if (result.error?.includes('already assigned')) {
          setLicenseStatus('invalid');
          setLicenseDetails(null);
          toast.error("License key already in use", {
            description: "This license key is already assigned to another user."
          });
        } else if (result.error?.includes('revoked')) {
          setLicenseStatus('invalid');
          setLicenseDetails(null);
          toast.error("License key revoked", {
            description: "This license key has been revoked and is no longer valid."
          });
        } else {
          setLicenseStatus('invalid');
          setLicenseDetails(null);
          toast.error("Invalid license key", {
            description: result.error || "Please check your license key and try again."
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
    try {
      const { error } = await signOut();
      if (error) {
        // Log full error for debugging
        console.error('Sign out error:', error);
        const userMessage = sanitizeSupabaseError(error, 'sign out');
        toast.error("Failed to sign out", {
          description: userMessage,
        });
      } else {
        toast.success("Signed out successfully");
        navigate('/');
      }
    } catch (error) {
      // Log full error for debugging
      console.error('Unexpected sign out error:', error);
      const userMessage = sanitizeError(error, 'sign out');
      toast.error("An unexpected error occurred", {
        description: userMessage,
      });
    }
  };

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

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
                  {licenseDetails ? licenseDetails.type : 'Free Plan'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              License & Billing
            </CardTitle>
            <CardDescription>
              Manage your license and redeem new license keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current License Status */}
            {licenseLoading ? (
              <div className="text-center py-6 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-phthalo mx-auto mb-4"></div>
                <p className="text-sm">Loading license status...</p>
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
                      Your license has expired. Renew or purchase a new license to continue using premium features.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-1">No active license</p>
                <p className="text-sm">Redeem a license key below to unlock premium features</p>
              </div>
            )}

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
                          setLicenseKeyError(validation.error || 'Invalid license key');
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Demo licenses available:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code className="bg-muted px-1 py-0.5 rounded text-xs">SOLUN-PRO-2024-DEMO</code> - Professional license (expires Dec 31, 2025)</li>
                  <li><code className="bg-muted px-1 py-0.5 rounded text-xs">SOLUN-BASIC-2024</code> - Basic license (expires Dec 31, 2024)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Management
            </CardTitle>
            <CardDescription>
              Manage devices connected to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No devices connected</p>
              <p className="text-sm">Devices will appear here when you start using Solun</p>
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
