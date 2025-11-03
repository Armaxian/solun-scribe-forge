import { Helmet } from "react-helmet-async";
import {
  FileText,
  Database,
  MessageSquare,
  GitBranch,
  Shield,
  Palette,
  ChevronRight,
  BookOpen,
  Users,
  Zap,
  Lock,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThreeSplineScene } from "@/components/ui/three-spline-scene";

const features = [
  {
    icon: FileText,
    title: "Distraction-Free Editor",
    subtitle: "Write worlds, not code",
    description: "A cozy, page-by-page writing experience with elegant pagination. Focus on your story with a clean interface that feels like writing on parchment. Smooth page transitions and minimal distractions keep you in the flow.",
    illustration: "editor-pagination",
    details: [
      "Page-by-page navigation with smooth transitions",
      "Minimal, parchment-like interface",
      "Auto-save with local encryption",
      "Distraction-free fullscreen mode"
    ]
  },
  {
    icon: Database,
    title: "Lore Vault",
    subtitle: "Your world's memory",
    description: "Store characters, places, items, relationships, and timelines in an interconnected knowledge base. Every entity links to others, creating a web of relationships that maintains your world's consistency.",
    illustration: "lore-vault",
    hasSpline: true,
    splineScene: "https://prod.spline.design/klSoItsFh7uXybAi/scene.splinecode",
    details: [
      "Interconnected entities and relationships",
      "Rich metadata for characters, places, and items",
      "Timeline tracking and chronology",
      "Quick search and cross-references"
    ]
  },
  {
    icon: MessageSquare,
    title: "RAG-Powered Chat",
    subtitle: "AI that knows your world",
    description: "Context-aware conversations that draw from your Lore Vault. Ask questions about your characters, get plot suggestions, or explore world-building ideas—all informed by your existing content.",
    illustration: "rag-chat",
    details: [
      "Vector search through your lore",
      "Context-aware responses",
      "Seamless editor integration",
      "Export chat to editor or notes"
    ]
  },
  {
    icon: Layers,
    title: "Continuity Engine",
    subtitle: "Never forget a detail",
    description: "Track character arcs, plot threads, and timeline consistency effortlessly. The system automatically suggests continuity fixes and maintains narrative coherence across your entire work.",
    illustration: "continuity",
    hasSpline: true,
    splineScene: "https://prod.spline.design/klSoItsFh7uXybAi/scene.splinecode",
    details: [
      "Automatic continuity checking",
      "Character arc tracking",
      "Plot thread management",
      "Timeline validation"
    ]
  },
  {
    icon: GitBranch,
    title: "Version Control & Drafts",
    subtitle: "Every idea preserved",
    description: "Built-in versioning keeps every draft, revision, and idea. Branch your story, experiment with plot changes, and merge back when ready. Never lose a brilliant idea again.",
    illustration: "versioning",
    details: [
      "Unlimited draft versions",
      "Branch and merge storylines",
      "Compare versions side-by-side",
      "Restore any previous state"
    ]
  },
  {
    icon: Shield,
    title: "Offline-First Architecture",
    subtitle: "Your data, your control",
    description: "Runs entirely on your device with SQLite and vector extensions. No cloud dependency, no data mining. Your stories and lore remain private, encrypted, and under your complete control.",
    illustration: "offline-first",
    details: [
      "SQLite with vector extensions",
      "End-to-end encryption",
      "No internet required",
      "Cross-platform sync options"
    ]
  },
  {
    icon: Palette,
    title: "Olive + Cream Theme",
    subtitle: "Premium minimal aesthetic",
    description: "A carefully crafted color palette of deep phthalo greens and warm olive tones on cream backgrounds. Like writing on aged parchment with fine ink—comfortable for hours of creation.",
    illustration: "theme",
    details: [
      "Phthalo green and olive accents",
      "Warm cream backgrounds",
      "Dark mode support",
      "Accessibility-optimized contrast"
    ]
  }
];

export default function Features() {
  return (
    <>
      <Helmet>
        <title>Solun Features - AI Writing Workspace for World-Builders</title>
        <meta name="description" content="Discover Solun's powerful features: Lore Vault for interconnected knowledge, RAG-powered AI chat, distraction-free editor, continuity engine, and offline-first architecture." />
        <link rel="canonical" href="https://solun.app/features" />
        <meta property="og:title" content="Solun Features - Premium AI Writing Workspace" />
        <meta property="og:description" content="Lore Vault, RAG-powered chat, continuity engine, and offline-first architecture for serious world-building." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/features" />
        <meta property="og:image" content="https://solun.app/og-image-features.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun Features - Premium AI Writing Workspace" />
        <meta name="twitter:description" content="Lore Vault, RAG-powered chat, continuity engine, and offline-first architecture for serious world-building." />
        <meta name="twitter:image" content="https://solun.app/og-image-features.png" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4">
            <div className="mx-auto md:mx-0 container-narrow text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Powerful tools for
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  world-building
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Every feature designed to support your creative process, from first draft to final world
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="space-y-20">
              {features.map((feature, index) => (
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
                          <p className="text-phthalo font-medium">{feature.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>

                      <ul className="space-y-3">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-3">
                            <ChevronRight className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Illustration Placeholder or Spline Scene */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="card-hover">
                      {feature.hasSpline ? (
                        <div className="aspect-video bg-gradient-subtle rounded-lg overflow-hidden">
                          <ThreeSplineScene
                            sceneUrl={feature.splineScene}
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

        {/* CTA Section */}
        <section className="section border-t border-border/50">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start building worlds?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl prose-reading-comfortable mx-auto">
              Join writers who are creating immersive stories with confidence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="btn btn-primary"
              >
                Download Free
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/pricing"
                className="btn btn-ghost"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
