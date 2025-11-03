import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Database,
  Lightbulb,
  Sparkles,
  Laptop,
  Globe,
  Shield,
  Lock,
  Download,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInView } from "@/hooks/useInView";
import { analytics } from "@/lib/analytics";
import { tone } from "@/copy/tone";

// What we do cards
const whatWeDoCards = [
  {
    icon: FileText,
    title: "Distraction-Free Editor",
    description: "A focused writing environment designed for flow. Write page by page, without interruptions.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Context-aware conversations that understand your world. Get suggestions powered by your own lore.",
  },
  {
    icon: Database,
    title: "RAG Context",
    description: "Retrieval-Augmented Generation ensures every AI response draws from your Lore Vault knowledge.",
  },
  {
    icon: Lightbulb,
    title: "Lore Vault",
    description: "Your world's interconnected memory. Characters, places, and timelines linked together.",
  },
];

// Timeline items
const timelineItems = [
  {
    icon: Sparkles,
    title: "Inception",
    description: "The idea: a writer-first tool that understands context, not just text.",
    year: "2024",
  },
  {
    icon: Laptop,
    title: "Prototypes",
    description: "Early experiments with offline-first architecture and vector embeddings.",
    year: "2024",
  },
  {
    icon: Download,
    title: "Desktop App",
    description: "Native desktop application with SQLite, vector extensions, and local-first design.",
    year: "2024",
  },
  {
    icon: Globe,
    title: "Web Companion",
    description: "Web interface for accessing your stories and lore from anywhere, securely synced.",
    year: "2024",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function About() {
  const { ref: heroRef, inView: heroInView } = useInView<HTMLDivElement>("-100px");
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>("100px");
  const { ref: timelineRef, inView: timelineInView } = useInView<HTMLDivElement>("100px");
  const { ref: trustRef, inView: trustInView } = useInView<HTMLDivElement>("100px");
  const { ref: ctaRef, inView: ctaInView } = useInView<HTMLDivElement>("100px");

  useEffect(() => {
    analytics.track({ name: 'page_view', properties: { page: 'about' } });
  }, []);

  return (
    <>
      <Helmet>
        <title>About Solun - Writer-First AI Workspace for World-Builders</title>
        <meta
          name="description"
          content="Learn about Solun's mission: a writer-first AI workspace with RAG-powered context, Lore Vault, and offline-first architecture. Built for serious world-builders."
        />
        <link rel="canonical" href="https://solun.app/about" />
        <meta property="og:title" content="About Solun - Writer-First AI Workspace" />
        <meta
          property="og:description"
          content="A writer-first tool that understands context. Built with RAG, Lore Vault, and offline-first architecture for world-builders who care about privacy and control."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/about" />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-about.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="About Solun - Writer-First AI Workspace" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@solun_app" />
        <meta name="twitter:creator" content="@solun_app" />
        <meta name="twitter:title" content="About Solun - Writer-First AI Workspace" />
        <meta
          name="twitter:description"
          content="A writer-first tool that understands context. Built with RAG, Lore Vault, and offline-first architecture."
        />
        <meta name="twitter:image" content="https://solun.app/og-image-about.png" />
        <meta name="twitter:image:alt" content="About Solun - Writer-First AI Workspace" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden"
          style={{ paddingBlock: "var(--space-hero)" }}
          aria-labelledby="about-hero-heading"
        >
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl relative z-10">
            <motion.div
              ref={heroRef}
              initial="initial"
              animate={heroInView ? "animate" : "initial"}
              variants={fadeInUp}
              className="mx-auto max-w-4xl text-center space-y-6"
            >
              <h1
                id="about-hero-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Writer-first.
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AI-powered.
                </span>
                <br />
                <span className="text-phthalo">Privacy-focused.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Solun is built for writers who want AI that understands their world, not just their
                words. With RAG-powered context, a Lore Vault that connects everything, and
                offline-first architecture that keeps your data yours.
              </p>
            </motion.div>
          </div>
        </section>

        <hr className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl border-t border-black/10 my-10" />

        {/* What We Do Section */}
        <section className="section-tight" aria-labelledby="what-we-do-heading">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <motion.div
              initial="initial"
              animate={gridInView ? "animate" : "initial"}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <h2 id="what-we-do-heading" className="text-3xl md:text-4xl font-bold mb-4">
                What we do
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Four core features working together to support your creative process
              </p>
            </motion.div>

            <motion.div
              ref={gridRef}
              initial="initial"
              animate={gridInView ? "animate" : "initial"}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {whatWeDoCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full card-hover border-border/50">
                    <CardHeader>
                      <div className="p-3 rounded-xl bg-phthalo/10 w-fit mb-4">
                        <card.icon className="h-6 w-6 text-phthalo" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl mb-2">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {card.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How We Work Timeline */}
        <section
          className="section bg-gradient-subtle"
          aria-labelledby="how-we-work-heading"
        >
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <motion.div
              initial="initial"
              animate={timelineInView ? "animate" : "initial"}
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <h2 id="how-we-work-heading" className="text-3xl md:text-4xl font-bold mb-4">
                How we work
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our journey from idea to desktop app to web companion
              </p>
            </motion.div>

            <motion.div
              ref={timelineRef}
              initial="initial"
              animate={timelineInView ? "animate" : "initial"}
              variants={staggerContainer}
              className="relative max-w-4xl mx-auto"
            >
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/30 transform md:-translate-x-1/2 hidden md:block" />

              <div className="space-y-12">
                {timelineItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Mobile: icon on left */}
                      <div className="flex md:hidden items-center gap-4">
                        <div className="p-3 rounded-xl bg-phthalo/10">
                          <item.icon className="h-6 w-6 text-phthalo" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <span className="text-sm text-muted-foreground">({item.year})</span>
                          </div>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>

                      {/* Desktop: alternating layout */}
                      <div className="hidden md:flex md:items-center md:gap-8 w-full">
                        {index % 2 === 0 ? (
                          <>
                            <div className="flex-1 text-right">
                              <div className="flex items-center justify-end gap-2 mb-2">
                                <span className="text-sm text-muted-foreground">{item.year}</span>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                              </div>
                              <p className="text-muted-foreground text-right">{item.description}</p>
                            </div>
                            <div className="relative z-10">
                              <div className="p-3 rounded-xl bg-phthalo/10">
                                <item.icon className="h-8 w-8 text-phthalo" aria-hidden="true" />
                              </div>
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-phthalo border-2 border-background" />
                            </div>
                            <div className="flex-1" aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            <div className="flex-1" aria-hidden="true" />
                            <div className="relative z-10">
                              <div className="p-3 rounded-xl bg-phthalo/10">
                                <item.icon className="h-8 w-8 text-phthalo" aria-hidden="true" />
                              </div>
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-phthalo border-2 border-background" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <span className="text-sm text-muted-foreground">({item.year})</span>
                              </div>
                              <p className="text-muted-foreground">{item.description}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust & Privacy Section */}
        <section
          className="section"
          aria-labelledby="trust-privacy-heading"
        >
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <motion.div
              ref={trustRef}
              initial="initial"
              animate={trustInView ? "animate" : "initial"}
              variants={fadeInUp}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-phthalo/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-phthalo/10">
                      <Shield className="h-8 w-8 text-phthalo" aria-hidden="true" />
                    </div>
                    <CardTitle id="trust-privacy-heading" className="text-2xl md:text-3xl">
                      Trust & Privacy
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Your data is yours. We built Solun with privacy and security as foundational
                    principles, not afterthoughts.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">Keys stored securely</h3>
                        <p className="text-sm text-muted-foreground">
                          API keys and sensitive data are encrypted locally using industry-standard
                          encryption. Never sent to our servers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">Offline-first where possible</h3>
                        <p className="text-sm text-muted-foreground">
                          Core features work entirely offline. Your stories and lore live on your
                          device, not in the cloud, unless you choose to sync.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">Local-first architecture</h3>
                        <p className="text-sm text-muted-foreground">
                          SQLite with vector extensions runs on your machine. Your data never
                          leaves your device without your explicit consent.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-phthalo mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold mb-1">Transparent practices</h3>
                        <p className="text-sm text-muted-foreground">
                          No data mining. No selling your information. No hidden telemetry. We're
                          transparent about what we collect and why.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Learn more about our privacy practices in our{" "}
                      <Link
                        to="/legal"
                        className="text-phthalo hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phthalo focus-visible:ring-offset-2 rounded"
                      >
                        Legal Center
                      </Link>
                      {" "}or view our{" "}
                      <Link
                        to="/privacy"
                        className="text-phthalo hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phthalo focus-visible:ring-offset-2 rounded"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="section border-t border-border/40"
          aria-labelledby="cta-heading"
        >
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center space-y-8 flex flex-col items-center">
            <motion.div
              ref={ctaRef}
              initial="initial"
              animate={ctaInView ? "animate" : "initial"}
              variants={fadeInUp}
              className="space-y-6"
            >
              <h2 id="cta-heading" className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to start writing?
              </h2>
              <div className="h-px w-12 bg-phthalo/30 mx-auto" />
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Download Solun for free and start building your world today. Available for Windows,
                macOS, and Linux.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <GradientButton
                  asChild
                  className="min-h-[44px]"
                  onClick={() => {
                    analytics.track({
                      name: "cta_click",
                      properties: { location: "about_page", destination: "download" },
                    });
                  }}
                >
                  <Link to="/download" className="flex items-center gap-2" aria-label="Download Solun">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {tone.cta('download')}
                  </Link>
                </GradientButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-phthalo text-phthalo hover:bg-phthalo/5 px-8 py-4 text-lg font-semibold rounded-xl min-h-[44px]"
                  asChild
                  onClick={() => {
                    analytics.track({
                      name: "cta_click",
                      properties: { location: "about_page", destination: "features" },
                    });
                  }}
                >
                  <Link to="/features" className="flex items-center gap-2" aria-label="Explore features">
                    {tone.cta('secondary')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}

