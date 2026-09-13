import { ArrowRight, BookOpen, Database, FileText, MessageSquare, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import PrismDemo from "@/components/ui/prism-demo";
import { analytics } from "@/lib/analytics";
import { getDetailedPlatformInfo, getPlatformLabel, type Platform } from "@/lib/platform";

const features = [
  {
    icon: FileText,
    number: "01",
    title: "A calm place to draft",
    description: "Write long-form work in a focused desktop editor with automatic local saves and clean exports.",
    detail: "Markdown · DOCX · PDF",
  },
  {
    icon: Database,
    number: "02",
    title: "A memory for your world",
    description: "Keep characters, places, items, relationships, and timelines beside the manuscript they belong to.",
    detail: "Lore Vault · Local SQLite",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "AI with the right context",
    description: "Ask for help using the lore and passages you choose. Review every suggestion before it reaches your draft.",
    detail: "Optional · Subscription access",
  },
  {
    icon: Shield,
    number: "04",
    title: "Your work stays yours",
    description: "Manuscripts and lore live on your device. Solun sends context only when you make an AI request.",
    detail: "Local-first · No automatic sync",
  },
];

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    analytics.track({ name: "hero_view" });
    setPlatform(getDetailedPlatformInfo().platform);
  }, []);

  const platformLabel = getPlatformLabel(platform);

  return (
    <>
      <Helmet>
        <title>Solun — A local-first writing studio for fiction</title>
        <meta name="description" content="Write your manuscript, organize your world, and ask AI for help in one local-first desktop studio." />
        <link rel="canonical" href="https://solun.app/" />
        <meta property="og:title" content="Solun — A local-first writing studio for fiction" />
        <meta property="og:description" content="Your manuscript, your world, and the ideas between them — together on your desktop." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/" />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-home.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun — A local-first writing studio for fiction" />
        <meta name="twitter:description" content="Your manuscript, your world, and the ideas between them — together on your desktop." />
        <meta name="twitter:image" content="https://solun.app/og-image-home.svg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Solun",
            description: "A local-first desktop writing studio with a manuscript editor, Lore Vault, and optional AI assistance.",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Windows, macOS, Linux",
            url: "https://solun.app/download",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen overflow-hidden">
        <section className="relative border-b border-black/10" aria-labelledby="hero-heading">
          <div className="container grid min-h-[calc(100svh-69px)] max-w-7xl min-w-0 items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
            <div className="relative z-10 min-w-0 max-w-3xl">
              <p className="label-mono mb-7 flex items-center gap-3 text-phthalo">
                <span className="h-px w-8 bg-current" aria-hidden="true" />
                A desktop studio for fiction
              </p>
              <h1 id="hero-heading" className="display-serif max-w-full text-[clamp(3rem,8vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.055em] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                Hold a whole world
                <span className="mt-2 block italic text-phthalo">in one place.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-foreground/70 md:text-xl">
                Draft the story, map its lore, and explore new possibilities without scattering your work across a dozen tools.
              </p>
              <div className="mt-10 flex max-w-full flex-col gap-3 sm:flex-row sm:items-center">
                <GradientButton asChild className="group px-7">
                  <Link
                    to="/download"
                    onClick={() => analytics.track({ name: "cta_click", properties: { location: "hero", destination: "download", platform } })}
                  >
                    Download for {platformLabel}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </GradientButton>
                <Button asChild variant="ghost" size="lg" className="justify-start px-5 text-phthalo sm:justify-center">
                  <a href="#inside-solun">See what’s inside</a>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-2xl grid-cols-1 gap-5 border-t border-black/10 pt-6 text-sm sm:grid-cols-3 sm:gap-4">
                <div><dt className="text-foreground/45">Account</dt><dd className="mt-1 font-semibold">Not required to write</dd></div>
                <div><dt className="text-foreground/45">Storage</dt><dd className="mt-1 font-semibold">Local SQLite</dd></div>
                <div><dt className="text-foreground/45">AI</dt><dd className="mt-1 font-semibold">Only when you ask</dd></div>
              </dl>
            </div>

            <div className="relative min-h-[390px] min-w-0 overflow-hidden sm:min-h-[480px] lg:min-h-[650px] lg:overflow-visible" aria-hidden="true">
              <div className="absolute inset-[-8%_-22%_-8%_-12%] opacity-85 [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_76%)]">
                <PrismDemo />
              </div>
              <div className="absolute bottom-8 right-3 w-[min(88%,390px)] rotate-[-2deg] border border-black/10 bg-[#faf8f0]/90 p-5 shadow-[0_28px_80px_rgba(14,20,17,.16)] backdrop-blur-sm sm:right-6 sm:p-6 lg:right-0">
                <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-3 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                  <span>Chapter twelve</span><span>1,842 words</span>
                </div>
                <p className="display-serif text-2xl leading-relaxed text-foreground/85">
                  The bells began before dawn, each note crossing the valley like a question no one wanted to answer.
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs text-phthalo">
                  <BookOpen className="h-4 w-4" /><span>Linked: The Glass Abbey · Elian Voss</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="inside-solun" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="features-heading">
          <div className="container max-w-7xl">
            <div className="grid gap-10 border-b border-black/10 pb-14 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <p className="label-mono text-phthalo">Inside Solun</p>
              <h2 id="features-heading" className="display-serif max-w-4xl text-4xl font-normal leading-tight tracking-[-0.035em] md:text-6xl">
                The work behind the story, kept close to the story.
              </h2>
            </div>

            <div className="grid md:grid-cols-2">
              {features.map((feature) => (
                <article key={feature.number} className="group border-b border-black/10 py-10 md:p-10 md:[&:nth-child(odd)]:border-r">
                  <div className="mb-10 flex items-start justify-between">
                    <span className="label-mono text-foreground/35">{feature.number}</span>
                    <feature.icon className="h-7 w-7 text-phthalo transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" />
                  </div>
                  <h3 className="display-serif text-3xl font-normal tracking-[-0.025em]">{feature.title}</h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-foreground/65">{feature.description}</p>
                  <p className="label-mono mt-8 text-[11px] text-phthalo/75">{feature.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-phthalo py-24 text-white md:py-32" aria-labelledby="flow-heading">
          <div className="container max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="label-mono text-white/55">The writing loop</p>
                <h2 id="flow-heading" className="display-serif mt-6 text-5xl font-normal leading-none tracking-[-0.04em] md:text-7xl">
                  Write.<br />Connect.<br /><span className="italic text-[#d7d8a7]">Discover.</span>
                </h2>
              </div>
              <ol className="border-t border-white/20">
                {[
                  ["Draft", "Stay in the manuscript while ideas are moving."],
                  ["Connect", "Link a person, place, or thread before the detail slips away."],
                  ["Ask", "Bring selected context into an AI conversation when you need another angle."],
                ].map(([title, description], index) => (
                  <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/20 py-8 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline">
                    <span className="label-mono text-white/35">0{index + 1}</span>
                    <h3 className="display-serif text-3xl font-normal">{title}</h3>
                    <p className="col-start-2 leading-7 text-white/65 sm:col-start-3">{description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32" aria-labelledby="cta-heading">
          <div className="container max-w-5xl text-center">
            <p className="label-mono text-phthalo">Start with the blank page</p>
            <h2 id="cta-heading" className="display-serif mx-auto mt-7 max-w-4xl text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
              Your next world already has a first sentence.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-foreground/65">Explore and write locally for free. Sign in only when you want AI assistance.</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <GradientButton asChild><Link to="/download">Download Solun</Link></GradientButton>
              <Button asChild variant="outline" size="lg"><Link to="/pricing">View pricing</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
