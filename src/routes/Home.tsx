import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FileText,
  Database,
  MessageSquare,
  GitBranch,
  Shield,
  Palette,
  ChevronRight,
  BookOpen,
  Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { TypewriterTextInk } from "@/components/ui/TypewriterTextInk";
import InkflowTitle from "@/components/Inkflow/InkflowTitle";
import PrismDemo from "@/components/ui/prism-demo";
import { ThreeSplineScene } from "@/components/ui/three-spline-scene";
import { analytics } from "@/lib/analytics";
import { getDetailedPlatformInfo, getPlatformLabel, type Platform } from "@/lib/platform";
import { useInView } from "@/hooks/useInView";
import { tone } from "@/copy/tone";

const featuresDetailed = [
  {
    icon: FileText,
    title: "Focused Writing",
    subtitle: "A place for your manuscript",
    description:
      "Write in a clean, distraction-free editor designed for long-form storytelling. Your manuscript stays on your device, organized in local projects with automatic saves and export options.",
    illustration: "editor",
    details: [
      "TipTap-based rich text editor",
      "Local project organization",
      "Auto-save to SQLite",
      "Export to Markdown, DOCX, PDF",
    ],
  },
  {
    icon: Database,
    title: "Lore Vault",
    subtitle: "Keep your story details close",
    description:
      "Store characters, places, and items alongside your manuscript. Create relationships and timelines to keep your world consistent. Everything stays in your local database.",
    illustration: "lore-vault",
    details: [
      "Characters, places, items",
      "Relationships and timeline tracking",
      "Local SQLite storage",
      "Cross-referenced to your writing",
    ],
  },
  {
    icon: MessageSquare,
    title: "AI Writing Assistant",
    subtitle: "Ask questions about your story",
    description:
      "Get help from AI that can reference your characters and plot. The AI uses context from your Lore Vault to provide relevant suggestions. Requires an internet connection and subscription for AI access.",
    illustration: "ai-chat",
    details: [
      "Context-aware AI responses",
      "References your Lore Vault",
      "Review suggestions before accepting",
      "AI usage requires subscription",
    ],
  },
  {
    icon: Shield,
    title: "Local-First Privacy",
    subtitle: "Your writing stays on your device",
    description:
      "Manuscripts, lore, and backups are stored locally in SQLite. Only selected context is sent to AI when you explicitly ask for help. No automatic cloud sync or data mining.",
    illustration: "privacy",
    details: [
      "Local SQLite database",
      "Device-local storage",
      "AI context sent only when requested",
      "Local backups you control",
    ],
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
        <title>Solun - Writing Workspace for Novelists and World-Builders</title>
        <meta name="description" content="A desktop writing workspace for your manuscript, your world, and the ideas between them. Local-first editor with Lore Vault and AI writing assistance." />
        <link rel="canonical" href="https://solun.app/" />
        <meta property="og:title" content="Solun - Writing Workspace for Novelists" />
        <meta property="og:description" content="Desktop writing workspace with manuscript editor, Lore Vault, and AI assistance. Your writing stays on your device." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/" />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-home.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Solun Writing Workspace" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun - Writing Workspace for Novelists" />
        <meta name="twitter:description" content="Desktop writing workspace with manuscript editor, Lore Vault, and AI assistance. Your writing stays on your device." />
        <meta name="twitter:image" content="https://solun.app/og-image-home.png" />
        <meta name="twitter:image:alt" content="Solun Writing Workspace" />
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
        <div className="container max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl relative z-10">
          <div className="flex flex-col items-center justify-center text-center min-h-[600px]">
            <div className="space-y-8 animate-fade-in max-w-4xl">
              <div ref={titleRef} className="w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                  <TypewriterTextInk
                    text={["Write worlds.", "Write stories.", "Write ideas."]}
                    speed={120}
                    delay={800}
                    className="typewriter-subtle"
                    onComplete={() => setIsTypingComplete(true)}
                    loop={true}
                    pauseTime={3000}
                  />
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed px-4">
                  A writing workspace for your manuscript, your world, and the ideas between them.
                </p>
              </div>
              <div className={`flex flex-col items-center gap-6 transition-all duration-1000 ${isTypingComplete ? 'opacity-100 transform translate-y-0' : 'opacity-60 transform translate-y-2'}`}>
                <p className="text-base text-muted-foreground max-w-2xl px-4">
                  Explore and write locally without an account. Sign in when you want AI assistance.
                </p>
                <GradientButton
                  className="relative z-10 typewriter text-lg px-8 py-6"
                  onClick={() => handleDownload()}
                  aria-label={`Download Solun for ${detectedLabel}`}
                >
                  {tone.cta('download')}
                </GradientButton>
                <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground typewriter">
                  <span>Also available for</span>
                  {platformOptions
                    .filter(opt => opt.platform !== detectedPlatform)
                    .map((opt, i, arr) => (
                      <span key={opt.platform} className="inline-flex items-center">
                        <button
                          onClick={() => handleDownload(opt.platform)}
                          className="underline hover:text-[#0B3D2E] transition-colors font-medium typewriter py-1 px-2 min-h-[44px] inline-flex items-center"
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

      <hr className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl border-t border-black/10 my-10" />

      {/* Features Page Content injected under hero */}
      {/* Features Grid (detailed) */}
      <section className="section-tight">
        <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
          <div className="space-y-20">
            {featuresDetailed.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-phthalo/10">
                        <feature.icon className="h-8 w-8 text-phthalo" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold">{feature.title}</h2>
                        {('subtitle' in feature) && (
                          <p className="text-phthalo font-medium">{(feature as any).subtitle}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    {'details' in feature && (
                      <ul className="space-y-3">
                        {(feature as any).details.map((detail: string, detailIndex: number) => (
                          <li key={detailIndex} className="flex items-start gap-3">
                            <ChevronRight className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Illustration Placeholder or Spline Scene */}
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="card-hover">
                    {(feature as any).hasSpline ? (
                      <div className="aspect-video bg-gradient-subtle rounded-lg overflow-hidden">
                        <ThreeSplineScene
                          sceneUrl={(feature as any).splineScene}
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <feature.icon className="h-16 w-16 text-phthalo/40 mx-auto" aria-hidden="true" />
                          <p className="text-muted-foreground font-medium">
                            {feature.illustration.replace('-', ' ').toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Illustration coming soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section bg-gradient-subtle">
        <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
          <div className="mx-auto max-w-4xl xl:max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything working together
              </h2>
              <p className="text-lg text-muted-foreground">
                Features that enhance each other, creating a seamless writing experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card-hover text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-phthalo" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">Write</h3>
                <p className="text-muted-foreground">
                  Distraction-free editor with pagination
                </p>
              </div>

              <div className="card-hover text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-olive" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-muted-foreground">
                  Lore Vault links everything together
                </p>
              </div>

              <div className="card-hover text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-phthalo" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">Explore</h3>
                <p className="text-muted-foreground">
                  AI chat informed by your world
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section style={{ paddingBlock: 'var(--space-section)' }} className="border-t border-border/40" aria-labelledby="cta-heading">
        <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center space-y-8 flex flex-col items-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-semibold tracking-[-0.01em] text-foreground mb-6 typewriter">
            Start writing today
          </h2>
          <div className="h-px w-12 bg-[#0B3D2E]/30 mb-8" />
          <p className="text-lg text-muted-foreground max-w-xl prose-reading-comfortable typewriter">
            Join writers crafting immersive worlds with confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <GradientButton
              asChild
              className="typewriter"
            >
              <Link to="/download" aria-label="Download Solun for free">
                {tone.cta('download')}
              </Link>
            </GradientButton>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#0B3D2E] text-[#0B3D2E] hover:bg-[#0B3D2E]/5 px-8 py-4 text-lg font-semibold rounded-xl typewriter"
              asChild
            >
              <Link to="/login" aria-label="Log in to Solun">
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
