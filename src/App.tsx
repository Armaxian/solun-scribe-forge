import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load all route components for code splitting
const Account = lazy(() => import("./routes/Account"));
const Blog = lazy(() => import("./routes/Blog"));
const BlogPost = lazy(() => import("./routes/BlogPost"));
const Docs = lazy(() => import("./routes/Docs"));
const Download = lazy(() => import("./routes/Download"));
const Features = lazy(() => import("./routes/Features"));
const Home = lazy(() => import("./routes/Home"));
const Login = lazy(() => import("./routes/Login"));
const NotFound = lazy(() => import("./routes/NotFound"));
const Pricing = lazy(() => import("./routes/Pricing"));
const Privacy = lazy(() => import("./routes/Privacy"));
const Root = lazy(() => import("./routes/Root"));
const Terms = lazy(() => import("./routes/Terms"));
const Cookies = lazy(() => import("./routes/Cookies"));

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

// Loading fallback component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-phthalo border-t-transparent mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--ink)] selection:bg-[#1E7F5C]/20">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1" role="main">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Root />}>
                    <Route index element={<Home />} />
                    <Route path="download" element={<Download />} />
                    <Route path="features" element={<Features />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="docs" element={<Docs />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="login" element={<Login />} />
                    <Route path="account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="cookies" element={<Cookies />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </main>
            <Footer />
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
