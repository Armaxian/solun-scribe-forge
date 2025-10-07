import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { supabase, signOut, Database } from "@/lib/supabase";
import { User, LogOut, Monitor, CreditCard } from "lucide-react";

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function Account() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, sessionLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Failed to sign out", {
          description: error.message,
        });
      } else {
        toast.success("Signed out successfully");
        navigate('/');
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  if (sessionLoading || loading) {
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
                <Badge variant="secondary" className="mt-1">
                  Free Plan
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              License & Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active license</p>
              <p className="text-sm">Upgrade to unlock premium features</p>
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
