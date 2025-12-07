/**
 * Debug route to verify Netlify SPA routing works correctly.
 * This route has NO dependencies on Stripe, Supabase, or any external services.
 * If you can access /debug, Netlify routing is working.
 */
export default function Debug() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-bold">✅ Netlify SPA Routing Works</h1>
        <p className="text-lg text-muted-foreground">
          If you can see this page, Netlify is correctly serving the React SPA.
        </p>
        <div className="mt-8 p-4 bg-muted rounded-lg text-left max-w-md mx-auto">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Route: /debug</li>
            <li>• No external API calls</li>
            <li>• No Stripe dependencies</li>
            <li>• No Supabase dependencies</li>
            <li>• Pure static React component</li>
          </ul>
        </div>
        <div className="mt-4">
          <a href="/" className="text-primary hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

