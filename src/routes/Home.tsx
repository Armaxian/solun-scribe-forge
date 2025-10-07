import { Suspense, lazy, useEffect, useState } from "react";
import { ArrowRight, Database, Sparkles, BookOpen, Shield, Layers, GitBranch } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import InkflowTitle from "@/components/Inkflow/InkflowTitle";
import { analytics } from "@/lib/analytics";
import { getDetailedPlatformInfo, getPlatformLabel, type Platform } from "@/lib/platform";
import { useInView } from "@/hooks/useInView";

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
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>('unknown');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { ref: titleRef, inView } = useInView<HTMLDivElement>("100px");

  useEffect(() => {
    analytics.track({ name: 'hero_view' });

    // Detect platform on component mount
    const platformInfo = getDetailedPlatformInfo();
    setDetectedPlatform(platformInfo.platform);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const detectedLabel = getPlatformLabel(detectedPlatform);

  const platformOptions = [
    { platform: 'windows' as Platform, label: 'Windows' },
    { platform: 'mac-intel' as Platform, label: 'macOS (Intel)' },
    { platform: 'mac-arm' as Platform, label: 'macOS (Apple Silicon)' },
    { platform: 'linux' as Platform, label: 'Linux' },
  ];

  const handleDownload = (platform?: Platform) => {
    const targetPlatform = platform || detectedPlatform;
    analytics.track({
      name: 'cta_click',
      properties: {
        location: 'hero',
        destination: 'download',
        platform: targetPlatform
      }
    });
    // Navigate to download page with platform parameter
    window.location.href = `/download${targetPlatform !== detectedPlatform ? `?platform=${targetPlatform}` : ''}`;
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
      <div className="flex min-h-screen flex-col bg-[#FFF8E7]">
      {/* Hero Section */}
      <section className="relative overflow-hidden space-section bg-[#FFF8E7]" aria-labelledby="hero-heading">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="mx-auto h-[56vh] max-w-5xl bg-[radial-gradient(60%_50%_at_50%_35%,rgba(11,61,46,0.10),transparent_60%)]" />
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div ref={titleRef} className="w-full">
              <InkflowTitle className="w-full" text="Write worlds." paused={!inView} />
            </div>
            <div className="relative">
              <div className="mt-7 inline-flex items-stretch rounded-2xl shadow-sm border border-black/10 overflow-hidden">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-none px-5 py-3 text-sm font-medium transition-all duration-300 bg-gradient-to-br from-phthalo to-olive text-cream shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phthalo"
                  onClick={() => handleDownload()}
                >
                  Download for {detectedLabel}
                </button>
                <button
                  className="px-3 py-3 bg-white hover:bg-black/5"
                  aria-label="Choose platform"
                  onClick={toggleDropdown}
                >
                  ▾
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full min-w-[200px] bg-white border border-black/10 rounded-2xl shadow-lg z-10">
                  {platformOptions.map((option) => (
                    <button
                      key={option.platform}
                      className={`w-full text-left px-4 py-3 hover:bg-black/5 transition-colors ${
                        option.platform === detectedPlatform ? 'bg-black/5 font-medium' : ''
                      }`}
                      onClick={() => {
                        handleDownload(option.platform);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                      {option.platform === detectedPlatform && (
                        <span className="ml-2 text-xs text-black/60">(Detected)</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-black/70">
              Available for Windows, macOS, and Linux
            </p>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-t border-black/10 my-10" />

      {/* Features Grid */}
      <section className="space-section bg-[#FFF8E7]" aria-labelledby="features-heading">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Everything you need to craft coherent stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools that work together seamlessly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card bg-white/80 dark:bg-[#0D0F0E] border border-black/10 dark:border-white/10 group hover:shadow-medium hover:border-phthalo/20 hover:-translate-y-1 transition-all duration-300 p-6 rounded-2xl">
                <feature.icon className="h-10 w-10 mb-4 stroke-[#0B3D2E] dark:stroke-white/90 transition-colors group-hover:stroke-olive" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2 text-cream dark:text-cream">{feature.title}</h3>
                <p className="text-cream/70 dark:text-cream/70 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Preview */}
      <section className="section bg-[#FFF8E7]" aria-label="Product preview">
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
      <section className="section-tight bg-[#FFF8E7]" aria-labelledby="security-heading">
        <div className="container">
          <div className="card-hover max-w-4xl mx-auto text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-success" aria-hidden="true" />
            <h2 id="security-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
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
      <section className="section border-t border-border/50 bg-[#FFF8E7]" aria-labelledby="cta-heading">
        <div className="container text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
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
