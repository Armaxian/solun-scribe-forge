import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { tone } from "@/copy/tone";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { OfflineBanner } from "./components/OfflineBanner";
import { analytics } from "./lib/analytics";

// Lazy load all route components for code splitting
const About = lazy(() => import("./routes/About"));
const Account = lazy(() => import("./routes/Account"));
const Blog = lazy(() => import("./routes/Blog"));
const BlogPost = lazy(() => import("./routes/BlogPost"));
const Contact = lazy(() => import("./routes/Contact"));
const Cookies = lazy(() => import("./routes/Cookies"));
const Docs = lazy(() => import("./routes/Docs"));
const FAQs = lazy(() => import("./routes/FAQs"));
const Download = lazy(() => import("./routes/Download"));
const Features = lazy(() => import("./routes/Features"));
const Home = lazy(() => import("./routes/Home"));
const Legal = lazy(() => import("./routes/Legal"));
const Login = lazy(() => import("./routes/Login"));
const NotFound = lazy(() => import("./routes/NotFound"));
const Pricing = lazy(() => import("./routes/Pricing"));
const Privacy = lazy(() => import("./routes/Privacy"));
const Root = lazy(() => import("./routes/Root"));
const Story = lazy(() => import("./routes/Story"));
const Terms = lazy(() => import("./routes/Terms"));

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PaperBackground } from "@/components/ui/PaperBackground";

const LIGHT_BACKGROUND_COLOR = "#f5f2e8";
const LIGHT_TEXT_COLOR = "#0C0C0C";
const LIGHT_THEME_VARS: Record<string, string> = {
  "--background": "0 0% 100%",
  "--foreground": "0 0% 5%",
  "--card": "0 0% 100%",
  "--card-foreground": "0 0% 5%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "0 0% 5%",
  "--muted": "0 0% 95%",
  "--muted-foreground": "0 0% 35%",
  "--bg": "#FFFFFF",
  "--ink": "#0C0C0C",
};

const THEME_ATTRS = ["data-theme", "data-mode", "data-color-mode"];

const LightThemeGuard = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;
    if (!root || !body) return;

    const enforce = () => {
      // Check for DarkReader extension and block it
      const hasDarkReader = root.hasAttribute('data-darkreader-mode') || 
                           root.hasAttribute('data-darkreader-scheme') ||
                           body.hasAttribute('data-darkreader-inline-bgcolor');
      
      if (hasDarkReader) {
        // Remove all DarkReader attributes
        const darkReaderAttrs = [
          'data-darkreader-mode', 'data-darkreader-scheme', 'data-darkreader-proxy-injected',
          'data-darkreader-inline-bgcolor', 'data-darkreader-inline-color'
        ];
        darkReaderAttrs.forEach(attr => {
          root.removeAttribute(attr);
          body.removeAttribute(attr);
        });
        
        // Remove DarkReader CSS variables
        const darkReaderVars = [
          '--darkreader-inline-bgcolor', '--darkreader-inline-color',
          '--darkreader-bg--background', '--darkreader-bg--foreground',
          '--darkreader-text--foreground', '--darkreader-bg--card',
          '--darkreader-text--card-foreground', '--darkreader-bg--muted',
          '--darkreader-text--muted', '--darkreader-border--muted',
          '--darkreader-text--muted-foreground'
        ];
        darkReaderVars.forEach(varName => {
          root.style.removeProperty(varName);
          body.style.removeProperty(varName);
        });
      }

      [root, body].forEach((node) => {
        node.classList.remove("dark");
        THEME_ATTRS.forEach((attr) => {
          const value = node.getAttribute(attr);
          if (value && value.toLowerCase() === "dark") {
            node.setAttribute(attr, "light");
          }
        });
      });

      Object.entries(LIGHT_THEME_VARS).forEach(([token, value]) => {
        root.style.setProperty(token, value);
      });

      root.style.colorScheme = "light";
      root.style.backgroundColor = LIGHT_BACKGROUND_COLOR;
      root.style.color = LIGHT_TEXT_COLOR;
      body.style.backgroundColor = LIGHT_BACKGROUND_COLOR;
      body.style.color = LIGHT_TEXT_COLOR;
    };

    enforce();

    const observer = new MutationObserver(enforce);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", ...THEME_ATTRS, "data-darkreader-mode", "data-darkreader-scheme", "data-darkreader-proxy-injected", "data-darkreader-inline-bgcolor", "data-darkreader-inline-color"],
    });
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["class", ...THEME_ATTRS, "data-darkreader-mode", "data-darkreader-scheme", "data-darkreader-proxy-injected", "data-darkreader-inline-bgcolor", "data-darkreader-inline-color"],
    });

    const schemeWatcher = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSchemeChange = () => enforce();
    schemeWatcher.addEventListener("change", handleSchemeChange);

    const handleVisibility = () => {
      if (!document.hidden) {
        enforce();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Aggressive DarkReader blocking - run every 100ms
    const darkReaderBlocker = setInterval(() => {
      const hasDarkReader = root.hasAttribute('data-darkreader-mode') || 
                           root.hasAttribute('data-darkreader-scheme') ||
                           body.hasAttribute('data-darkreader-inline-bgcolor');
      if (hasDarkReader) {
        const darkReaderAttrs = [
          'data-darkreader-mode', 'data-darkreader-scheme', 'data-darkreader-proxy-injected',
          'data-darkreader-inline-bgcolor', 'data-darkreader-inline-color'
        ];
        darkReaderAttrs.forEach(attr => {
          root.removeAttribute(attr);
          body.removeAttribute(attr);
        });
        
        const darkReaderVars = [
          '--darkreader-inline-bgcolor', '--darkreader-inline-color',
          '--darkreader-bg--background', '--darkreader-bg--foreground',
          '--darkreader-text--foreground', '--darkreader-bg--card',
          '--darkreader-text--card-foreground', '--darkreader-bg--muted',
          '--darkreader-text--muted', '--darkreader-border--muted',
          '--darkreader-text--muted-foreground'
        ];
        darkReaderVars.forEach(varName => {
          root.style.removeProperty(varName);
          body.style.removeProperty(varName);
        });
        
        // Force light theme again
        root.style.setProperty('background-color', '#FFFFFF', 'important');
        root.style.setProperty('color', '#0C0C0C', 'important');
        body.style.setProperty('background-color', '#FFFFFF', 'important');
        body.style.setProperty('color', '#0C0C0C', 'important');
      }
    }, 100);

    return () => {
      observer.disconnect();
      schemeWatcher.removeEventListener("change", handleSchemeChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(darkReaderBlocker);
    };
  }, []);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 min
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status?: number }).status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s, max 30s
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Do refetch when reconnecting
    },
    mutations: {
      retry: 1, // Retry mutations once
      retryDelay: 1000, // 1 second delay
    },
  },
});

// Loading fallback component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-phthalo border-t-transparent mx-auto mb-4" />
      <p className="text-muted-foreground">{tone.loading('general')}</p>
    </div>
  </div>
);

const AppContent = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <LightThemeGuard />
      <PaperBackground />
      <OfflineBanner />
      <div className="flex min-h-screen flex-col text-[#0C0C0C] selection:bg-[#1E7F5C]/20">
        <Header />
        <main className="flex-1" role="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Root />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="download" element={<Download />} />
                <Route path="features" element={<Features />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="docs" element={<Docs />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="story" element={<Story />} />
                <Route path="login" element={<Login />} />
                <Route path="account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                <Route path="legal" element={<Legal />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faqs" element={<FAQs />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <ErrorBoundary isRoot>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
