import { useEffect, useState } from "react";
import { ArrowRight, Database, Sparkles, BookOpen, Shield, Layers, GitBranch } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { TypewriterText } from "@/components/ui/TypewriterText";
import InkflowTitle from "@/components/Inkflow/InkflowTitle";
import PrismDemo from "@/components/ui/prism-demo";
import { analytics } from "@/lib/analytics";
import { getDetailedPlatformInfo, getPlatformLabel, type Platform } from "@/lib/platform";
import { useInView } from "@/hooks/useInView";



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
  const [isTypingComplete, setIsTypingComplete] = useState(false);
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
      <div className="flex min-h-screen flex-col relative">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ paddingBlock: 'var(--space-hero)' }} aria-labelledby="hero-heading">
        {/* Prism Background */}
        <div className="absolute inset-0 z-0">
          <PrismDemo />
        </div>
        
        {/* Typewriter Heading Over Prism */}
        <div className="container relative z-10">
          <div className="flex flex-col items-center justify-center text-center min-h-[600px]">
            <div className="space-y-8 animate-fade-in">
              <div ref={titleRef} className="w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  <TypewriterText 
                    text={["Write worlds.", "Write stories.", "Write ideas.", "Write dreams.", "Write tales.", "Write narratives."]}
                    speed={120}
                    delay={800}
                    className="typewriter-subtle"
                    onComplete={() => setIsTypingComplete(true)}
                    loop={true}
                    pauseTime={3000}
                  />
                </h1>
              </div>
              <div className={`flex flex-col items-center gap-4 transition-all duration-1000 ${isTypingComplete ? 'opacity-100 transform translate-y-0' : 'opacity-60 transform translate-y-2'}`}>
                <GradientButton
                  className="relative z-10 typewriter"
                  onClick={() => handleDownload()}
                >
                  Download for {detectedLabel}
                </GradientButton>
                <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground typewriter">
                  <span>Also available for</span>
                  {platformOptions
                    .filter(opt => opt.platform !== detectedPlatform)
                    .map((opt, i, arr) => (
                      <span key={opt.platform} className="inline-flex items-center">
                        <button
                          onClick={() => handleDownload(opt.platform)}
                          className="underline hover:text-[#0B3D2E] transition-colors font-medium typewriter"
                        >
                          {opt.label}
                        </button>
                        {i < arr.length - 1 && <span className="mx-1">{i === arr.length - 2 ? ' and' : ','}</span>}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-t border-black/10 my-10" />

      {/* Features Grid */}
      <section style={{ paddingBlock: 'var(--space-section)' }} aria-labelledby="features-heading">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12 flex flex-col items-center">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-semibold tracking-[-0.01em] text-foreground mb-6 typewriter">
              Everything you need to craft coherent stories
            </h2>
            <div className="h-px w-12 bg-[#0B3D2E]/30 mb-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group sticker-card opacity-0 animate-fade-in stagger-${index + 1}`}
              >
                <div className="size-12 rounded-xl bg-gradient-to-br from-[#0B3D2E]/15 to-[#0B3D2E]/20 flex items-center justify-center text-[#0B3D2E] group-hover:from-[#0B3D2E]/20 group-hover:to-[#0B3D2E]/25 transition-all duration-300 mb-4 shadow-sm">
                  <feature.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B3D2E] mb-2 typewriter">{feature.title}</h3>
                <p className="text-sm text-[#0B3D2E]/75 leading-relaxed typewriter">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Preview */}
      <section style={{ paddingBlock: 'var(--space-section)' }} aria-label="Product preview">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <p className="text-muted-foreground font-medium typewriter">Product Screenshot Placeholder</p>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground typewriter">
              Clean, minimal interface that lets you focus on what matters: your story
            </p>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section style={{ paddingBlock: 'var(--space-section)' }} className="border-t border-border/40" aria-labelledby="cta-heading">
        <div className="container text-center space-y-8 flex flex-col items-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-semibold tracking-[-0.01em] text-foreground mb-6 typewriter">
            Start writing today
          </h2>
          <div className="h-px w-12 bg-[#0B3D2E]/30 mb-8" />
          <p className="text-lg text-muted-foreground max-w-xl typewriter">
            Join writers crafting immersive worlds with confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <GradientButton
              asChild
              className="typewriter"
            >
              <Link to="/download">
                Download for Free
              </Link>
            </GradientButton>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#0B3D2E] text-[#0B3D2E] hover:bg-[#0B3D2E]/5 px-8 py-4 text-lg font-semibold rounded-xl typewriter"
              asChild
            >
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
