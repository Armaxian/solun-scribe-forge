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
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Spotlight } from "@/components/ui/spotlight";
import { tone } from "@/copy/tone";

const quickStartSteps = [
  {
    step: 1,
    title: "Install Solun",
    description: "Download the desktop app and open your writing space.",
    icon: Download,
    details: [
      "Open the download page",
      "Choose the release for your operating system",
      "Install Solun and launch the app"
    ]
  },
  {
    step: 2,
    title: "Create your first story",
    description: "Start with a blank page, give the project a name, and write your opening scene.",
    icon: FileText,
    details: [
      "Choose New Story in the sidebar",
      "Add a title and optional genre",
      "Write your first scene"
    ]
  },
  {
    step: 3,
    title: "Build your Lore Vault",
    description: "Save the details you want to remember and connect them as your world grows.",
    icon: Database,
    details: [
      "Open the Lore tab",
      "Add a character, place, item, or event",
      "Link related entries together"
    ]
  },
  {
    step: 4,
    title: "Ask for a fresh perspective",
    description: "Use selected story context to explore ideas, motivations, and possible next steps.",
    icon: MessageSquare,
    details: [
      "Open the Chat panel",
      "Choose the writing or lore to include",
      "Review the response before using any idea"
    ]
  }
];

const docsSections = [
  {
    title: "Getting Started",
    icon: Play,
    description: "Install Solun and make your first project",
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
    description: "Learn the editor, saves, versions, and exports",
    articles: [
      "Page-by-Page Writing",
      "Local Version History",
      "Export Options",
      "Local Backups"
    ]
  },
  {
    title: "Lore Vault",
    icon: Database,
    description: "Organize characters, places, events, and connections",
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
    description: "Use selected context to explore story ideas",
    articles: [
      "AI Chat Overview",
      "Context-Aware Responses",
      "Plot Suggestions",
      "Character Development"
    ]
  },
  {
    title: "Advanced",
    icon: Settings,
    description: "Accounts, backups, settings, and troubleshooting",
    articles: [
      "Account & AI Usage",
      "Custom Themes",
      "Local Backup Workflow",
      "Troubleshooting"
    ]
  }
];

export default function Docs() {
  return (
    <>
      <Helmet>
        <title>Solun Documentation — Guides for writing and world-building</title>
        <meta name="description" content="Learn how to install Solun, start a story, organize your Lore Vault, make backups, export your work, and use story assistance." />
        <link rel="canonical" href="https://solun.app/docs" />
        <meta property="og:title" content="Solun Documentation — Guides for writing and world-building" />
        <meta property="og:description" content="Practical guides for installing Solun, writing, organizing your Lore Vault, backing up, exporting, and using story assistance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/docs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun Documentation — Guides for writing and world-building" />
        <meta name="twitter:description" content="Practical guides for installing Solun, writing, organizing your Lore Vault, backing up, exporting, and using story assistance." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section relative overflow-hidden">
          <Spotlight className="top-12 left-16" />
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4">
            <div className="mx-auto md:mx-0 container-narrow text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Documentation &
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Guides
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Clear answers for getting started, writing, and keeping your story world together
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-4xl xl:max-w-5xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Start here
                </h2>
                <p className="text-lg text-muted-foreground">
                  Go from download to first scene in a few minutes
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
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-4xl xl:max-w-5xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Keep your world within reach
                </h2>
                <p className="text-lg text-muted-foreground">
                  A practical home for the details your story depends on
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                <div className="card-hover">
                  <Database className="h-12 w-12 mb-4 text-phthalo" />
                  <h3 className="text-xl font-semibold mb-3">What is the Lore Vault?</h3>
                  <p className="text-muted-foreground mb-4">
                    The Lore Vault is where you keep the people, places, objects, events, and connections behind your story.
                    It turns scattered notes into a world you can return to while you write.
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
                  <h3 className="text-xl font-semibold mb-3">Story assistance</h3>
                  <p className="text-muted-foreground mb-4">
                    When you want another perspective, choose the writing and lore you want to discuss.
                    Solun uses that context to help you explore possibilities without taking over the story.
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
                      Selected lore as context
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-olive" />
                      Suggestions you review before using
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card-hover text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-success" />
                <h3 className="text-xl font-semibold mb-3">Backups and exports</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your manuscript and lore are stored on your device. Use the backup and export tools to keep copies where you want them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Find your next answer
                </h2>
                <p className="text-lg text-muted-foreground">
                  Practical notes for the features you will use most
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
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-4xl xl:max-w-5xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Still have a question?</h2>
                <p className="text-muted-foreground">
                  Start with the guides, browse the FAQs, or contact us directly.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="card-hover text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-phthalo" />
                  <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Find answers to common questions
                  </p>
                  <Link to="/faqs" className="btn btn-ghost w-full">Browse FAQs</Link>
                </div>

                <div className="card-hover text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-olive" />
                  <h3 className="text-lg font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Read practical writing and product notes
                  </p>
                  <Link to="/blog" className="btn btn-ghost w-full">Read the Blog</Link>
                </div>

                <div className="card-hover text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-success" />
                  <h3 className="text-lg font-semibold mb-2">Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get help from a real person
                  </p>
                  <Link to="/contact" className="btn btn-ghost w-full">Contact Support</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section border-t border-border/50">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to write your story?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl prose-reading-comfortable mx-auto">
              Download Solun and give your next idea somewhere to grow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="btn btn-primary"
                aria-label="Download Solun for free"
              >
                {tone.cta('download')}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/features"
                className="btn btn-ghost"
                aria-label="Explore features"
              >
                {tone.cta('secondary')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
