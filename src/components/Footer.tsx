import { Github, Instagram } from "lucide-react";
import { useState, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

import { useNewsletter } from "@/hooks/use-newsletter";

// Define available routes - only show links for routes that exist
const AVAILABLE_ROUTES = {
  company: {
    "/story": "Solun Story",
    "/about": "About Us",
  },
  support: {
    "/contact": "Contact",
    "/faqs": "FAQs",
    "/download": "Download",
    "/blog": "Blog",
  },
  legal: {
    "/legal": "Legal Center",
    "/terms": "Terms",
    "/privacy": "Privacy",
    "/cookies": "Cookies",
  },
} as const;

// Define which routes actually exist in the app
const EXISTING_ROUTES = new Set([
  "/legal",
  "/terms",
  "/privacy",
  "/cookies",
  "/download",
  "/blog",
  "/story",
  "/about",
  "/contact",
  "/faqs",
]);

// Social media links - validate URLs
const SOCIAL_LINKS = [
  {
    name: "X (Twitter)",
    href: "https://twitter.com/solun",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/solun",
    icon: <Github className="h-5 w-5" aria-hidden="true" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/solunapp",
    icon: <Instagram className="h-5 w-5" aria-hidden="true" />,
  },
].filter((link) => {
  // Basic URL validation - ensure href is a valid URL
  try {
    new URL(link.href);
    return true;
  } catch {
    return false;
  }
});

interface FooterLinkSectionProps {
  title: string;
  links: Record<string, string>;
}

function FooterLinkSection({ title, links }: FooterLinkSectionProps) {
  const filteredLinks = useMemo(() => {
    return Object.entries(links).filter(([href]) => EXISTING_ROUTES.has(href));
  }, [links]);

  if (filteredLinks.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold typewriter text-foreground">
        {title}
      </h3>
      <ul className="space-y-2" role="list">
        {filteredLinks.map(([href, name]) => (
          <li key={href}>
            <Link
              to={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm typewriter inline-block py-1 px-1 min-h-[44px] min-w-[44px] flex items-center"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    <footer className="site-footer border-t border-white/10 bg-phthalo text-white" role="contentinfo">
      <div className="container max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_.65fr_.65fr_.65fr_1.15fr] lg:gap-8">
          {/* Brand & Social */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label="Go to homepage"
            >
              <img 
                src="/favicon.ico"
                alt="Solun logo" 
                className="h-6 w-6 rounded-lg object-contain" 
                aria-hidden="true"
              />
              <span className="font-semibold typewriter text-foreground">Solun</span>
            </Link>
            <p className="text-sm text-muted-foreground typewriter">
              Write worlds.
            </p>
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-2" role="list">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`Follow Solun on ${social.name}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Company - only render if it has links */}
          <FooterLinkSection title="Company" links={AVAILABLE_ROUTES.company} />
          
          {/* Support - only render if it has links (includes Download & Blog) */}
          <FooterLinkSection title="Support" links={AVAILABLE_ROUTES.support} />

          {/* Legal */}
          <FooterLinkSection title="Legal" links={AVAILABLE_ROUTES.legal} />

          {/* Newsletter - Right column */}
          <div>
            <h3 className="mb-3 text-sm font-semibold typewriter text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4 typewriter">
              Stay updated with the latest features.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 typewriter disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  aria-label="Email address for newsletter subscription"
                  required
                />
                <button 
                  type="submit"
                  className="btn btn-primary text-xs typewriter disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap"
                  disabled={isSubmitting}
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Footer bottom: copyright only */}
        <div className="mt-8 border-t border-border/50 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground typewriter">
            <p>© {new Date().getFullYear()} Solun. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
