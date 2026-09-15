import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Database, FileText, MessageSquare, Pause, Play, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import PrismDemo from "@/components/ui/prism-demo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { analytics } from "@/lib/analytics";
import { getDetailedPlatformInfo, getPlatformLabel, type Platform } from "@/lib/platform";

const features = [
  {
    icon: FileText,
    number: "01",
    title: "Get the words down",
    description: "A quiet place for chapters, scenes, and scraps of dialogue—so you can stop arranging your tools and start writing.",
    detail: "Markdown · DOCX · PDF",
  },
  {
    icon: Database,
    number: "02",
    title: "Remember the good stuff",
    description: "Keep the names, places, secrets, and loose threads that make your story yours close at hand while you write.",
    detail: "Lore Vault",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "A second pair of eyes",
    description: "When a scene needs another angle, ask for ideas grounded in the world you have already made. You stay in charge of every word.",
    detail: "Ideas when you want them",
  },
  {
    icon: Shield,
    number: "04",
    title: "Keep the story moving",
    description: "Find the detail you need, follow the thread, and get back to the scene before the spark goes cold.",
    detail: "Less hunting · More writing",
  },
];

const storyCards = [
  {
    chapter: "Chapter twelve",
    words: "1,842 words",
    excerpt: "The bells began before dawn, each note crossing the valley like a question no one wanted to answer.",
    linked: "The Glass Abbey · Elian Voss",
  },
  {
    chapter: "Field note seven",
    words: "623 words",
    excerpt: "At dusk, the moth market opened beneath the bridge. Every lantern sold there remembered a different summer.",
    linked: "Mothlight Market · Sen Vale",
  },
  {
    chapter: "Letter twenty-one",
    words: "914 words",
    excerpt: "Dear Juniper, the northbound train arrived empty again—except for a teacup that was still warm.",
    linked: "The Last Platform · Ada Wren",
  },
  {
    chapter: "Afterword",
    words: "1,106 words",
    excerpt: "They planted the key in the orchard and, by spring, every tree had grown a tiny golden door.",
    linked: "The Orchard Below · Mira Cael",
  },
];

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyPaused, setStoryPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    analytics.track({ name: "hero_view" });
    setPlatform(getDetailedPlatformInfo().platform);
  }, []);

  useEffect(() => {
    if (storyPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => setStoryIndex((index) => (index + 1) % storyCards.length), 6500);
    return () => window.clearInterval(timer);
  }, [storyIndex, storyPaused, prefersReducedMotion]);

  const platformLabel = getPlatformLabel(platform);
  const story = storyCards[storyIndex];

  return (
    <>
      <Helmet>
        <title>Solun — Write the story you keep thinking about</title>
        <meta name="description" content="Solun gives fiction writers a clear place to draft, remember every important detail, and bring a story to life." />
        <link rel="canonical" href="https://solun.app/" />
        <meta property="og:title" content="Solun — Write the story you keep thinking about" />
        <meta property="og:description" content="A clear, thoughtful writing space for your manuscript, characters, places, and all the ideas between them." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/" />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-home.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun — Write the story you keep thinking about" />
        <meta name="twitter:description" content="A clear, thoughtful writing space for your manuscript, characters, places, and all the ideas between them." />
        <meta name="twitter:image" content="https://solun.app/og-image-home.svg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Solun",
            description: "A thoughtful desktop writing studio for drafting fiction and keeping every important story detail close.",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Windows, macOS, Linux",
            url: "https://solun.app/download",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen overflow-hidden">
        <section className="relative overflow-hidden border-b border-black/10" aria-labelledby="hero-heading">
          <div className="pointer-events-none absolute inset-[-18%_-10%] opacity-85 [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_76%)]" aria-hidden="true">
            <PrismDemo />
          </div>
          <div className="container relative z-10 grid min-h-[calc(100svh-69px)] max-w-7xl min-w-0 items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
            <div className="relative z-10 min-w-0 max-w-3xl">
              <h1 id="hero-heading" className="display-serif max-w-full text-[clamp(3rem,8vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.055em] [overflow-wrap:anywhere] sm:[overflow-wrap:normal]">
                Write the story
                <span className="mt-2 block italic text-phthalo">you keep thinking about.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-foreground/70 md:text-xl">
                Solun gives you a clear place to draft, remember every important detail, and keep the story moving.
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
                  <a href="#inside-solun">See how it works</a>
                </Button>
              </div>
            </div>

            <div
              className="relative min-h-[390px] min-w-0 overflow-hidden sm:min-h-[480px] lg:min-h-[650px] lg:overflow-visible"
              role="region"
              aria-roledescription="carousel"
              aria-label="Story excerpts"
            >
              <div className="absolute bottom-8 right-3 w-[min(88%,390px)] sm:right-6 lg:right-0">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] border border-black/10 bg-[#e6eadf]/80 shadow-sm" aria-hidden="true" />
                <div className="absolute inset-0 -translate-x-2 translate-y-1 rotate-[-4deg] border border-black/10 bg-[#f1eee3]/90 shadow-sm" aria-hidden="true" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={story.chapter}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18, rotate: 1.5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, rotate: -4, scale: 0.98 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="relative border border-black/10 bg-[#faf8f0]/95 p-5 shadow-[0_28px_80px_rgba(14,20,17,.16)] backdrop-blur-sm sm:p-6"
                  >
                    <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-3 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                      <span>{story.chapter}</span><span>{story.words}</span>
                    </div>
                    <p className="display-serif min-h-[154px] text-2xl leading-relaxed text-foreground/85">
                      {story.excerpt}
                    </p>
                    <div className="mt-7 flex items-end justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-2 text-xs leading-5 text-phthalo">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Linked: {story.linked}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {!prefersReducedMotion && (
                          <button
                            type="button"
                            onClick={() => setStoryPaused((paused) => !paused)}
                            className="grid h-11 w-11 place-items-center rounded-full border border-phthalo/20 text-phthalo transition-colors hover:bg-phthalo hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phthalo focus-visible:ring-offset-2"
                            aria-label={storyPaused ? "Play story excerpts" : "Pause story excerpts"}
                          >
                            {storyPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setStoryIndex((index) => (index + 1) % storyCards.length)}
                          className="grid h-11 w-11 place-items-center rounded-full border border-phthalo/20 text-phthalo transition-colors hover:bg-phthalo hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phthalo focus-visible:ring-offset-2"
                          aria-label="Show next story excerpt"
                        >
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-2" aria-hidden="true">
                      {storyCards.map((card, index) => (
                        <span key={card.chapter} className={`h-1 rounded-full transition-all duration-500 ${index === storyIndex ? "w-8 bg-phthalo" : "w-2 bg-phthalo/20"}`} />
                      ))}
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <section id="inside-solun" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="features-heading">
          <div className="container max-w-7xl">
            <div className="grid gap-10 border-b border-black/10 pb-14 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
              <h2 id="features-heading" className="display-serif max-w-4xl text-4xl font-normal leading-tight tracking-[-0.035em] md:text-6xl">
                Everything you need to get from first idea to finished draft.
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
                <p className="label-mono text-white/55">A better way to keep going</p>
                <h2 id="flow-heading" className="display-serif mt-6 text-5xl font-normal leading-none tracking-[-0.04em] md:text-7xl">
                  Start.<br />Remember.<br /><span className="italic text-[#d7d8a7]">Keep going.</span>
                </h2>
              </div>
              <ol className="border-t border-white/20">
                {[
                  ["Draft", "Open a scene and get straight to the sentence that matters."],
                  ["Remember", "Keep characters, places, and turning points where you can find them."],
                  ["Keep going", "Follow the thread back into the manuscript and make the next page easier."],
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
            <p className="label-mono text-phthalo">Your next chapter starts here</p>
            <h2 id="cta-heading" className="display-serif mx-auto mt-7 max-w-4xl text-5xl font-normal leading-[1.02] tracking-[-0.04em] md:text-7xl">
              Make room for the story in your head.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-foreground/65">Download Solun, open a blank page, and see what comes out.</p>
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
