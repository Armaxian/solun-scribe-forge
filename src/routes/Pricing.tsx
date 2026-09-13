import { Check, X, ChevronRight, Info } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Pricing as PricingBlock } from "@/components/ui/pricing";
import { tone } from "@/copy/tone";
import { analytics } from "@/lib/analytics";
import { STRIPE_LOOKUP_KEYS } from "@/lib/stripe";

const comparison = [
  { name: "Desktop writing editor", free: true },
  { name: "Lore Vault", free: true },
  { name: "Local backups and exports", free: true },
  { name: "Write without an account", free: true },
  { name: "AI writing assistance (sign-in required)", free: false },
];

export default function Pricing() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    analytics.track({ name: 'pricing_view' });

    // Handle checkout result from URL params
    const checkoutResult = searchParams.get('checkout');
    if (checkoutResult === 'cancelled') {
      const cancelToast = tone.toast("info", "Checkout was cancelled.");
      toast.info(cancelToast.title, {
        description: "Your payment was not processed. Feel free to try again when you're ready."
      });
      // Clean up URL params
      setSearchParams(prev => {
        prev.delete('checkout');
        return prev;
      });
    }
  }, [searchParams, setSearchParams]);

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      yearlyPrice: "0",
      period: "forever",
      features: [
        "Desktop writing editor",
        "Lore Vault for story details",
        "Local backups and exports",
        "All writing features included",
      ],
      description: "Write locally without an account",
      buttonText: "Download Free",
      href: "/download",
      isPopular: false,
      isFree: true,
    },
    {
      name: "Pro",
      price: "19",
      yearlyPrice: "16",
      period: "per month",
      features: [
        "Everything in Free",
        "AI writing assistance",
        "Context from your Lore Vault",
        "Monthly AI usage allowance",
      ],
      description: "Unlock AI assistance for your writing",
      buttonText: "Get Pro",
      href: "/pricing",
      isPopular: true,
      isFree: false,
      stripeLookupKeyMonthly: STRIPE_LOOKUP_KEYS.PRO_MONTHLY,
      stripeLookupKeyYearly: STRIPE_LOOKUP_KEYS.PRO_YEARLY,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Solun Pricing - Free & Pro Plans for World-Builders</title>
        <meta name="description" content="Explore Solun and write locally for free. Sign in and choose Pro when you want AI assistance." />
        <link rel="canonical" href="https://solun.app/pricing" />
        <meta property="og:title" content="Solun Pricing - AI Writing Workspace Plans" />
        <meta property="og:description" content="Free local writing and optional Pro AI assistance for writers and world-builders." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/pricing" />
        <meta property="og:image" content="https://solun.app/og-image-pricing.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun Pricing - AI Writing Workspace Plans" />
        <meta name="twitter:description" content="Free local writing and optional Pro AI assistance for writers and world-builders." />
        <meta name="twitter:image" content="https://solun.app/og-image-pricing.png" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4">
            <div className="mx-auto md:mx-0 container-narrow text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Fair pricing for
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  creative writers
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Explore and write without signing in. Create an account when you want AI assistance.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <PricingBlock
              plans={pricingPlans}
              title=""
              description=""
            />
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="section bg-gradient-subtle">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
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
                        {["Free", "Pro"].map((plan) => (
                          <th key={plan} className="text-center p-6 font-semibold min-w-[120px]">
                            {plan}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((feature, index) => (
                        <tr key={index} className="border-b border-border/20">
                          <td className="p-6 font-medium">{feature.name}</td>
                          {["Free", "Pro"].map((plan) => (
                            <td key={plan} className="text-center p-6">
                              {plan === "Pro" || feature.free ? (
                                <span><Check className="h-5 w-5 text-success mx-auto" aria-hidden="true" /><span className="sr-only">Included</span></span>
                              ) : (
                                <span><X className="h-5 w-5 text-muted-foreground mx-auto" aria-hidden="true" /><span className="sr-only">Not included</span></span>
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
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-3xl prose-reading-comfortable">
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
                    Manage or cancel your subscription from Account. The billing portal shows when a change takes effect. Local writing remains available without a subscription.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">Is there a desktop app?</h3>
                  <p className="text-muted-foreground">
                    Solun is a desktop writing app. Visit Downloads for available releases. An account is only needed for AI assistance and billing.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    Available payment methods and the full amount are shown securely at checkout. Prices shown here are in USD.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-muted-foreground">
                    See our Terms for the refund policy and contact support for help with a payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop App Notice */}
        <section className="section border-t border-border/50 bg-muted/20">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-4xl xl:max-w-5xl">
              <div className="card-hover text-center">
                <Info className="h-12 w-12 mx-auto mb-4 text-info" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-3">Start with local writing</h3>
                <p className="text-muted-foreground mb-4">
                  Download the desktop app and explore your writing workspace without an account. Sign in when you choose to use AI assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/download" className="btn btn-ghost">
                    Download Free
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
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start writing?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl prose-reading-comfortable mx-auto">
              Make room for your manuscript, your world, and your next idea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="btn btn-primary"
              >
                Start Free Today
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
