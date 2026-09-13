import { FileDown, LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "./ui/button";
import { GradientButton } from "./ui/gradient-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";

import { tone } from "@/copy/tone";
import { useSession } from "@/hooks/use-session";
import { analytics } from "@/lib/analytics";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const location = useLocation();
  const { user } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigationClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header sticky top-0 z-50 border-b border-black/10 bg-[#f5f2e8]/88 py-3 backdrop-blur-xl" role="banner">
      <div className="container flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Solun - Home">
            <img src="/favicon.ico" alt="" className="h-8 w-8" />
            <span className="text-xl font-semibold tracking-tight typewriter">Solun</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link typewriter rounded-full px-3 py-2 text-sm font-medium tracking-tight transition-colors ${
                  location.pathname === item.href
                    ? "bg-phthalo/8 text-phthalo"
                    : "text-muted-foreground hover:bg-black/[.035] hover:text-foreground"
                }`}
                aria-current={location.pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="default" className="typewriter" asChild>
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header', destination: 'login' } })}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {user ? 'Account' : 'Sign in'}
              </Link>
            </Button>
            <GradientButton
              className="min-w-[100px] px-4 py-2 text-sm typewriter min-h-[44px]"
              asChild
            >
              <Link
                to="/download"
                onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header', destination: 'download' } })}
                aria-label="Download Solun"
              >
                <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
                {tone.cta('download')}
              </Link>
            </GradientButton>
          </div>

          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden typewriter"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:max-w-sm" id="mobile-navigation">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8" role="navigation" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      to={item.href}
                      onClick={handleNavigationClick}
                      className={`text-base font-medium transition-colors tracking-tight nav-link typewriter px-4 py-3 rounded-md min-h-[44px] flex items-center ${
                        location.pathname === item.href
                          ? "text-foreground bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      aria-current={location.pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              
              {/* Mobile auth CTAs */}
              <div className="flex flex-col gap-3 mt-8">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="default"
                    className="typewriter w-full justify-start min-h-[44px]"
                    asChild
                    onClick={handleNavigationClick}
                  >
                    <Link
                      to={user ? '/account' : '/login'}
                      onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header_mobile', destination: 'login' } })}
                    >
                      <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                      {user ? 'Account' : 'Sign in'}
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <GradientButton
                    className="w-full min-h-[44px] px-4 py-3 text-sm typewriter"
                    asChild
                    onClick={handleNavigationClick}
                  >
                    <Link
                      to="/download"
                      onClick={() => analytics.track({ name: 'cta_click', properties: { location: 'header_mobile', destination: 'download' } })}
                      aria-label="Download Solun"
                    >
                      <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
                      {tone.cta('download')}
                    </Link>
                  </GradientButton>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
