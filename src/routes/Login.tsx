import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center section">
      <div className="w-full max-w-md">
        <div className="card-hover">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Log in to your Solun account</p>
          </div>
          
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            
            <Button className="w-full btn-hero" type="submit">
              Log In
            </Button>
          </form>
          
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
  );
}
