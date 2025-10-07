import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { signInWithEmail, signInWithMagicLink, signInWithOAuth } from "@/lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (useMagicLink) {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          toast.error("Failed to send magic link", {
            description: error.message,
          });
        } else {
          toast.success("Magic link sent!", {
            description: "Check your email for the login link.",
          });
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          toast.error("Login failed", {
            description: error.message,
          });
        } else {
          toast.success("Welcome back!");
          navigate("/account");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setOauthLoading(provider);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        toast.error(`${provider} login failed`, {
          description: error.message,
        });
      }
      // OAuth will redirect, so no need to handle success here
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Solun Account</title>
        <meta name="description" content="Sign in to your Solun account to access your writing workspace, Lore Vault, and personalized settings." />
        <link rel="canonical" href="https://solun.app/login" />
        <meta property="og:title" content="Login to Solun" />
        <meta property="og:description" content="Access your premium AI writing workspace and Lore Vault." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/login" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center section">
      <div className="w-full max-w-md">
        <div className="card-hover">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Log in to your Solun account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!useMagicLink && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="magic-link"
                checked={useMagicLink}
                onCheckedChange={(checked) => setUseMagicLink(checked as boolean)}
              />
              <Label htmlFor="magic-link" className="text-sm">
                Send magic link instead
              </Label>
            </div>

            <Button className="w-full btn-hero" type="submit" disabled={loading}>
              {loading ? "Sending..." : useMagicLink ? "Send Magic Link" : "Continue"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator orientation="horizontal" className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth('google')}
                disabled={oauthLoading !== null}
                className="w-full"
              >
                {oauthLoading === 'google' ? '...' : 'Google'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth('apple')}
                disabled={oauthLoading !== null}
                className="w-full"
              >
                {oauthLoading === 'apple' ? '...' : 'Apple'}
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground link-underline">
              Forgot password?
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-foreground hover:text-phthalo link-underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
