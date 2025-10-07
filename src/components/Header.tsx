import { FileDown, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "./ui/button";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero" />
            <span className="text-xl font-semibold tracking-tight">Solun</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors link-underline ${
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              Log in
            </Link>
          </Button>
          <Button className="btn-hero" size="sm" asChild>
            <Link to="/download">
              <FileDown className="h-4 w-4" />
              Download
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
