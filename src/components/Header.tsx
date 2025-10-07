import { FileDown, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import { analytics } from "@/lib/analytics";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-[var(--solun-cream)] border-b border-black/5 py-3.5" role="banner">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Solun - Home">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero" aria-hidden="true" />
            <span className="text-xl font-semibold tracking-tight">Solun</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors tracking-tight nav-link ${
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={location.pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link
              to="/login"
              onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header', destination: 'login' } })}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Log in
            </Link>
          </Button>
          <Button className="btn btn-primary" asChild>
            <Link
              to="/download"
              onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header', destination: 'download' } })}
            >
              <FileDown className="h-4 w-4" aria-hidden="true" />
              Download
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
