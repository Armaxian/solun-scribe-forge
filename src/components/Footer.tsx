import { Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <footer className="bg-background border-t border-border/40" role="contentinfo">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-hero" />
              <span className="font-semibold typewriter">Solun</span>
            </div>
            <p className="text-sm text-muted-foreground typewriter">
              Write worlds. Keep them true.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/solun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
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
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="View Solun on GitHub"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com/solunapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Follow Solun on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold typewriter">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground link-underline typewriter"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold typewriter">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground link-underline typewriter"
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
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring typewriter"
              />
              <button className="btn btn-primary text-xs typewriter">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground typewriter">
          © {new Date().getFullYear()} Solun. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
