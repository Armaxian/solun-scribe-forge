import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Check, X, Star, Users, Crown, Sparkles, ChevronRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

import { analytics } from "@/lib/analytics";

const plans = [
  {
    name: "Free",
    description: "Perfect for exploring Solun and getting started",
    price: "$0",
    period: "forever",
    icon: Sparkles,
    popular: false,
    features: [
      { name: "Distraction-free editor", included: true },
      { name: "Basic Lore Vault (up to 100 entities)", included: true },
      { name: "Local AI chat (limited)", included: true },
      { name: "Version control (3 versions)", included: true },
      { name: "Offline-first architecture", included: true },
      { name: "Priority support", included: false },
      { name: "Advanced continuity checking", included: false },
      { name: "Team collaboration", included: false },
      { name: "Cloud sync", included: false }
    ]
  },
  {
    name: "Pro",
    description: "Everything you need for serious world-building",
    price: "$19",
    period: "per month",
    icon: Crown,
    popular: true,
    features: [
      { name: "Distraction-free editor", included: true },
      { name: "Unlimited Lore Vault entities", included: true },
      { name: "Full RAG-powered AI chat", included: true },
      { name: "Unlimited version control", included: true },
      { name: "Advanced continuity engine", included: true },
      { name: "Priority email support", included: true },
      { name: "Export options (PDF, EPUB)", included: true },
      { name: "Team collaboration", included: false },
      { name: "Cloud sync", included: false }
    ]
  },
  {
    name: "Team",
    description: "Collaborative world-building for groups",
    price: "$49",
    period: "per month",
    icon: Users,
    popular: false,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Up to 10 team members", included: true },
      { name: "Real-time collaboration", included: true },
      { name: "Shared Lore Vault", included: true },
      { name: "Team continuity tracking", included: true },
      { name: "Priority phone support", included: true },
      { name: "Admin dashboard", included: true },
      { name: "Advanced permissions", included: true },
      { name: "Cloud sync & backup", included: true }
    ]
  }
];

const featureCategories = [
  { name: "Core Writing", features: ["Distraction-free editor"] },
  { name: "World-Building", features: ["Lore Vault", "Continuity engine", "Version control"] },
  { name: "AI Features", features: ["RAG-powered chat", "Context awareness"] },
  { name: "Collaboration", features: ["Team features", "Real-time editing"] },
  { name: "Support", features: ["Support level", "Response time"] },
  { name: "Platform", features: ["Offline-first", "Cross-platform"] }
];

export default function Pricing() {
  useEffect(() => {
    analytics.track({ name: 'pricing_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Solun Pricing - Free & Pro Plans for World-Builders</title>
        <meta name="description" content="Choose the perfect Solun plan. Free forever plan available. Pro plan at $19/month with unlimited Lore Vault and RAG-powered AI chat. Team plans for collaborative writing." />
        <link rel="canonical" href="https://solun.app/pricing" />
        <meta property="og:title" content="Solun Pricing - AI Writing Workspace Plans" />
        <meta property="og:description" content="Free and Pro plans for writers and world-builders. Unlimited Lore Vault, RAG-powered chat, and offline-first architecture." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/pricing" />
        <meta property="og:image" content="https://solun.app/og-image-pricing.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun Pricing - AI Writing Workspace Plans" />
        <meta name="twitter:description" content="Free and Pro plans for writers and world-builders. Unlimited Lore Vault, RAG-powered chat, and offline-first architecture." />
        <meta name="twitter:image" content="https://solun.app/og-image-pricing.png" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section">
          <div className="container mx-auto px-4">
            <div className="mx-auto md:mx-0 container-narrow text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Fair pricing for
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  creative writers
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Start free, upgrade when you need more. No hidden fees, no surprises.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="section-tight">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`card-hover relative ${
                    plan.popular ? 'ring-2 ring-phthalo shadow-medium' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-hero text-cream px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-xl bg-muted mb-4">
                      <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-phthalo' : 'text-olive'}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-success flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <Link
                      to="/download"
                      className={`btn w-full ${
                        plan.popular ? 'btn-primary' : 'btn-ghost'
                      }`}
                    >
                      {plan.name === 'Free' ? 'Download Free' : `Get ${plan.name}`}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="section bg-gradient-subtle">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Compare all features
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to know about our pricing plans
                </p>
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-6 font-semibold">Features</th>
                        {plans.map((plan) => (
                          <th key={plan.name} className="text-center p-6 font-semibold min-w-[120px]">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {plans[0].features.map((feature, index) => (
                        <tr key={index} className="border-b border-border/20">
                          <td className="p-6 font-medium">{feature.name}</td>
                          {plans.map((plan) => (
                            <td key={plan.name} className="text-center p-6">
                              {plan.features[index].included ? (
                                <Check className="h-5 w-5 text-success mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-tight">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Everything you need to know about Solun pricing
                </p>
              </div>

              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade at any time?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your current billing cycle.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">Is there a desktop app?</h3>
                  <p className="text-muted-foreground">
                    Yes, Solun offers native desktop applications for Windows, macOS, and Linux. The desktop app license is sold separately from the web version.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop App Notice */}
        <section className="section border-t border-border/50 bg-muted/20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="card-hover text-center">
                <Info className="h-12 w-12 mx-auto mb-4 text-info" />
                <h3 className="text-xl font-semibold mb-3">Desktop App License</h3>
                <p className="text-muted-foreground mb-4">
                  The Solun desktop application is available as a separate purchase. It includes all web features plus native performance optimizations and offline capabilities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/download" className="btn btn-ghost">
                    Web Version (Free)
                  </Link>
                  <Link to="/download" className="btn btn-primary">
                    Desktop App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section border-t border-border/50">
          <div className="container text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start writing?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of writers who trust Solun with their creative process
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="btn btn-primary"
              >
                Start Free Today
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/features"
                className="btn btn-ghost"
              >
                View Features
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
