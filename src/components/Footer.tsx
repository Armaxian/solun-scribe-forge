import { Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useCallback, useRef } from "react";
import { useNewsletter } from "@/hooks/use-newsletter";

const footerLinks = {
  legal: [
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
    { name: "Cookies", href: "/cookies" },
  ],
  resources: [
    { name: "Changelog", href: "/changelog" },
    { name: "Press Kit", href: "/press" },
    { name: "Status", href: "/status" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const { subscribe, isSubmitting } = useNewsletter();
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubscribe = useCallback(() => {
    if (!email.trim()) {
      return; // Empty email - validation will be handled by the mutation
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    subscribe({ email, source: 'footer' });
    setEmail("");
  }, [email, subscribe, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Debounce the submission
    submitTimeoutRef.current = setTimeout(() => {
      handleSubscribe();
    }, 300);
  };

  return (
      <footer className="bg-background border-t border-border/40" role="contentinfo">
      <div className="container py-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-hero" />
              <span className="font-semibold typewriter">Solun</span>
            </div>
            <p className="text-sm text-muted-foreground typewriter">
              Write worlds. Keep them true.
            </p>
            <div className="flex gap-2">
              <a
                href="https://twitter.com/solun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Follow Solun on X"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://github.com/solun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="View Solun on GitHub"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com/solunapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Follow Solun on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold typewriter">Legal</h3>
            <ul className="space-y-1">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground link-underline typewriter inline-block py-2 px-1 min-h-[44px] flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold typewriter">Resources</h3>
            <ul className="space-y-1">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground link-underline typewriter inline-block py-2 px-1 min-h-[44px] flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold typewriter">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3 typewriter">
              Stay updated with the latest features.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear error when user starts typing
                  }}
                  disabled={isSubmitting}
                  className={`flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring typewriter disabled:opacity-50 disabled:cursor-not-allowed ${
"border-input"
                  }`}
                  aria-label="Email address for newsletter subscription"
                  required
                />
              <button 
                type="submit"
                className="btn btn-primary text-xs typewriter disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] px-4 py-2"
                disabled={isSubmitting}
                aria-label="Subscribe to newsletter"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground typewriter">
          © {new Date().getFullYear()} Solun. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
