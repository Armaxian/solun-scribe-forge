import { Suspense, lazy } from "react";
import { ArrowRight, Database, Sparkles, BookOpen, Shield, Layers, GitBranch } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

// Lazy load HeroCanvas to defer Three.js loading
const HeroCanvas = lazy(() => import("@/components/HeroCanvas").then(module => ({ default: module.HeroCanvas })));


const features = [
  {
    icon: Database,
    title: "Lore Vault",
    description: "Characters, places, items, timelines, and relationships—all organized and interconnected.",
  },
  {
    icon: Sparkles,
    title: "Context-Aware AI",
    description: "RAG-powered chat keeps your story continuity intact with vector search and embeddings.",
  },
  {
    icon: BookOpen,
    title: "Cozy Editor",
    description: "Minimal, page-by-page writing experience with elegant Olive + Cream theme.",
  },
  {
    icon: Shield,
    title: "Local-First",
    description: "SQLite with vector extension. Your data stays on your device, encrypted and private.",
  },
  {
    icon: Layers,
    title: "Continuity Engine",
    description: "Track character arcs, plot threads, and timeline consistency effortlessly.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Built-in versioning keeps every draft. Never lose a brilliant idea.",
  },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Solun - Premium AI Writing Workspace for World-Builders</title>
        <meta name="description" content="Write worlds. Keep them true. Premium AI workspace with Lore Vault, RAG-powered chat, and distraction-free editor. Offline-first, local-first architecture for serious world-building." />
        <link rel="canonical" href="https://solun.app/" />
        <meta property="og:title" content="Solun - Premium AI Writing Workspace for World-Builders" />
        <meta property="og:description" content="Write worlds. Keep them true. Context-aware AI, Lore Vault, and elegant editor for writers and world-builders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/" />
        <meta property="og:image" content="https://solun.app/og-image-home.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun - Premium AI Writing Workspace for World-Builders" />
        <meta name="twitter:description" content="Write worlds. Keep them true. Context-aware AI, Lore Vault, and elegant editor for writers and world-builders." />
        <meta name="twitter:image" content="https://solun.app/og-image-home.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Solun",
            "description": "A premium AI workspace for writers and world-builders. Distraction-free editor, Lore Vault, and RAG-powered chat working in harmony.",
            "brand": {
              "@type": "Brand",
              "name": "Solun"
            },
            "manufacturer": {
              "@type": "Organization",
              "name": "Solun",
              "url": "https://solun.app"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free tier with unlimited basic features"
            },
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Windows, macOS, Linux",
            "softwareVersion": "1.0.0",
            "fileSize": "85 MB",
            "url": "https://solun.app/download",
            "screenshot": "https://solun.app/screenshot.png"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Solun",
            "url": "https://solun.app",
            "description": "Premium AI writing workspace for world-builders and authors",
            "foundingDate": "2024",
            "sameAs": [
              "https://twitter.com/solun_app"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://solun.app/support"
            }
          })}
        </script>
      </Helmet>
      <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden section" aria-labelledby="hero-heading">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-bold tracking-tighter">
              Write worlds.
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Keep them true.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A premium AI workspace for writers and world-builders. Distraction-free editor, Lore Vault, 
              and RAG-powered chat working in harmony.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-hero group" asChild>
                <Link to="/download">
                  Download Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="btn-ghost" asChild>
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Available for Windows, macOS, and Linux
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 border-y border-border/50 bg-muted/20" aria-label="Trusted by companies">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <span className="text-sm font-medium">TRUSTED BY WRITERS AT</span>
            <div className="h-8 w-24 rounded bg-muted" aria-hidden="true" />
            <div className="h-8 w-24 rounded bg-muted" aria-hidden="true" />
            <div className="h-8 w-24 rounded bg-muted" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section" aria-labelledby="features-heading">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to craft coherent stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools that work together seamlessly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover group">
                <feature.icon className="h-10 w-10 mb-4 text-phthalo transition-colors group-hover:text-olive" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Preview */}
      <section className="section bg-gradient-subtle" aria-label="Product preview">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="card-hover overflow-hidden">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Product Screenshot Placeholder</p>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Clean, minimal interface that lets you focus on what matters: your story
            </p>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="section-tight" aria-labelledby="security-heading">
        <div className="container">
          <div className="card-hover max-w-4xl mx-auto text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-success" aria-hidden="true" />
            <h2 id="security-heading" className="text-2xl md:text-3xl font-bold mb-3">
              Your data, your device
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Solun runs entirely on your machine. SQLite database with vector extension for blazing-fast
              search, encrypted at rest. No cloud dependency, no data mining.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section border-t border-border/50" aria-labelledby="cta-heading">
        <div className="container text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl md:text-5xl font-bold tracking-tight">
            Start writing today
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Join writers crafting immersive worlds with confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-hero" asChild>
              <Link to="/download">
                Download for Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="btn-ghost" asChild>
              <Link to="/login">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
