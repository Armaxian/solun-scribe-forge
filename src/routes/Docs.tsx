import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  Download,
  Database,
  MessageSquare,
  Settings,
  ChevronRight,
  Play,
  FileText,
  Users,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const quickStartSteps = [
  {
    step: 1,
    title: "Download & Install",
    description: "Get Solun running on your device. Choose between the web version or native desktop app.",
    icon: Download,
    details: [
      "Visit the download page",
      "Choose your platform (Web, Windows, macOS, Linux)",
      "Install and launch Solun"
    ]
  },
  {
    step: 2,
    title: "Create Your First Story",
    description: "Start writing with our distraction-free editor. Experience the page-by-page writing flow.",
    icon: FileText,
    details: [
      "Click 'New Story' in the sidebar",
      "Choose a title and genre",
      "Start writing on the first page"
    ]
  },
  {
    step: 3,
    title: "Build Your Lore Vault",
    description: "Add characters, places, and items to create an interconnected knowledge base.",
    icon: Database,
    details: [
      "Navigate to the Lore tab",
      "Add your first character or place",
      "Link entities together with relationships"
    ]
  },
  {
    step: 4,
    title: "Chat with Your World",
    description: "Ask questions about your story and get AI-powered insights informed by your lore.",
    icon: MessageSquare,
    details: [
      "Open the Chat panel",
      "Ask about character motivations",
      "Get plot suggestions based on your world"
    ]
  }
];

const docsSections = [
  {
    title: "Getting Started",
    icon: Play,
    description: "Quick start guide and basic setup",
    articles: [
      "Installation Guide",
      "First Story Setup",
      "Interface Overview",
      "Keyboard Shortcuts"
    ]
  },
  {
    title: "Writing Features",
    icon: FileText,
    description: "Master the editor and writing tools",
    articles: [
      "Page-by-Page Writing",
      "Version Control",
      "Export Options",
      "Collaboration Basics"
    ]
  },
  {
    title: "Lore Vault",
    icon: Database,
    description: "Build and manage your world knowledge",
    articles: [
      "Creating Entities",
      "Relationships & Links",
      "Timeline Management",
      "Import/Export Lore"
    ]
  },
  {
    title: "AI Features",
    icon: MessageSquare,
    description: "Using AI to enhance your writing",
    articles: [
      "RAG Chat Overview",
      "Context-Aware Responses",
      "Plot Suggestions",
      "Character Development"
    ]
  },
  {
    title: "Advanced",
    icon: Settings,
    description: "Power user features and customization",
    articles: [
      "Continuity Engine",
      "Custom Themes",
      "Backup & Sync",
      "API Access"
    ]
  }
];

export default function Docs() {
  return (
    <>
      <Helmet>
        <title>Solun Documentation - Complete Guide for World-Building</title>
        <meta name="description" content="Complete documentation for Solun. Learn about the Lore Vault, RAG-powered chat, continuity engine, and how to build worlds with confidence using our AI writing workspace." />
        <link rel="canonical" href="https://solun.app/docs" />
        <meta property="og:title" content="Solun Documentation - Complete World-Building Guide" />
        <meta property="og:description" content="Learn everything about Solun: Lore Vault setup, AI chat features, continuity engine, and offline-first architecture." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/docs" />
        <meta property="og:image" content="https://solun.app/og-image-docs.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun Documentation - Complete World-Building Guide" />
        <meta name="twitter:description" content="Learn everything about Solun: Lore Vault setup, AI chat features, continuity engine, and offline-first architecture." />
        <meta name="twitter:image" content="https://solun.app/og-image-docs.png" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section">
          <div className="container mx-auto px-4">
            <div className="mx-auto md:mx-0 container-narrow text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Documentation &
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Guides
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Everything you need to master Solun and bring your worlds to life
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="section-tight">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Quick Start Guide
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get up and running with Solun in under 10 minutes
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {quickStartSteps.map((step) => (
                  <div key={step.step} className="card-hover">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-phthalo/10 rounded-xl flex items-center justify-center">
                          <step.icon className="h-6 w-6 text-phthalo" />
                        </div>
                        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center mt-2 mx-auto">
                          <span className="text-xs font-bold text-cream">{step.step}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="h-3 w-3 text-phthalo" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lore Vault Section */}
        <section className="section bg-gradient-subtle">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Connect Your Lore Vault
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your world's knowledge base powers everything in Solun
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                <div className="card-hover">
                  <Database className="h-12 w-12 mb-4 text-phthalo" />
                  <h3 className="text-xl font-semibold mb-3">What is the Lore Vault?</h3>
                  <p className="text-muted-foreground mb-4">
                    A structured database of your world's elements—characters, places, items, events, and their relationships.
                    Everything connects, creating a web of knowledge that maintains consistency.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-phthalo" />
                      Characters with backgrounds and motivations
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-phthalo" />
                      Locations with history and significance
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-phthalo" />
                      Items with powers and lore
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-phthalo" />
                      Timeline of events and chronology
                    </li>
                  </ul>
                </div>

                <div className="card-hover">
                  <MessageSquare className="h-12 w-12 mb-4 text-olive" />
                  <h3 className="text-xl font-semibold mb-3">AI Integration</h3>
                  <p className="text-muted-foreground mb-4">
                    Your Lore Vault powers intelligent conversations. Ask questions about your world and get responses
                    informed by your established lore and continuity.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-olive" />
                      Context-aware plot suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-olive" />
                      Character motivation insights
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-olive" />
                      World-building consistency checks
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-olive" />
                      Timeline validation
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card-hover text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
                <h3 className="text-xl font-semibold mb-3">Your Data, Your Control</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Everything runs locally on your device. SQLite database with vector extensions for fast search.
                  Your stories and lore remain private, encrypted, and completely under your control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="section-tight">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Complete Documentation
                </h2>
                <p className="text-lg text-muted-foreground">
                  Detailed guides for every feature and workflow
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docsSections.map((section) => (
                  <div key={section.title} className="card-hover">
                    <section.icon className="h-10 w-10 mb-4 text-phthalo" />
                    <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                    <p className="text-muted-foreground mb-4">{section.description}</p>
                    <ul className="space-y-2">
                      {section.articles.map((article, index) => (
                        <li key={index} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                          {article}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section className="section border-t border-border/50 bg-muted/20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? We're here to help.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card-hover text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-phthalo" />
                  <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Browse our complete documentation library
                  </p>
                  <button className="btn btn-ghost w-full">
                    Browse Docs
                  </button>
                </div>

                <div className="card-hover text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-olive" />
                  <h3 className="text-lg font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Join discussions with other Solun users
                  </p>
                  <button className="btn btn-ghost w-full">
                    Join Community
                  </button>
                </div>

                <div className="card-hover text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-success" />
                  <h3 className="text-lg font-semibold mb-2">Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get help from our support team
                  </p>
                  <button className="btn btn-ghost w-full">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section border-t border-border/50">
          <div className="container text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start building worlds?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download Solun and begin your world-building journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="btn btn-primary"
              >
                Download Free
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/features"
                className="btn btn-ghost"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
