import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { tone } from "@/copy/tone";

const NotFound = () => {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Focus management for accessibility
    headingRef.current?.focus();
  }, [location.pathname]);

  // Get a random snippet for a tiny touch of personality
  const snippetKeys = Object.keys(tone.snippets) as Array<keyof typeof tone.snippets>;
  const randomSnippet = tone.snippets[snippetKeys[Math.floor(Math.random() * snippetKeys.length)]];

  return (
    <>
      <Helmet>
        <title>Page Not Found - Solun</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to Solun's homepage to explore our AI writing workspace." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-[#f5f2e8] p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl mb-4" aria-hidden="true">📄</div>
            <h1 
              ref={headingRef}
              className="text-2xl font-bold text-[#0C0C0C]"
              tabIndex={-1}
            >
              Lost in the margins
            </h1>
            <p className="text-muted-foreground text-lg">
              The page you want slipped under the couch. We'll help you find it.
            </p>
          </div>
          
          <div className="space-y-3 pt-4">
            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full min-h-[44px]"
                size="lg"
              >
                <Link to="/">Back to Desk</Link>
              </Button>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 min-h-[44px]"
                  size="lg"
                >
                  <Link to="/blog">Search the archives</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 min-h-[44px]"
                  size="lg"
                >
                  <Link to="/docs">Browse Docs</Link>
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic pt-2">
              {randomSnippet}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
