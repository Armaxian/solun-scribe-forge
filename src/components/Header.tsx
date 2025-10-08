import { FileDown, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import { GradientButton } from "./ui/gradient-button";
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
    <header className="sticky top-0 z-50 py-3.5" role="banner" style={{ backgroundColor: 'transparent' }}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Solun - Home">
            <img src="/fevicon.ico" alt="Solun Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold tracking-tight typewriter">Solun</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors tracking-tight nav-link typewriter ${
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
          <Button variant="ghost" size="sm" className="typewriter" asChild>
            <Link
              to="/login"
              onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header', destination: 'login' } })}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Log in
            </Link>
          </Button>
          <GradientButton
            size="sm"
            className="min-w-[100px] px-4 py-2 text-sm typewriter"
            asChild
          >
            <Link
              to="/download"
              onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header', destination: 'download' } })}
            >
              <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
              Download
            </Link>
          </GradientButton>
        </div>
      </div>
    </header>
  );
}
