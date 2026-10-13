import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Database, FileText, MessageSquare, Pause, Play, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { StoryWorkspace } from "@/components/StoryWorkspace";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import PrismDemo from "@/components/ui/prism-demo";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { analytics } from "@/lib/analytics";
import { getDetailedPlatformInfo, type Platform } from "@/lib/platform";
import "@/styles/landing.css";

const features = [
  {
    icon: FileText,
    title: "Get the words down",
    description: "A quiet place for chapters, scenes, and scraps of dialogue—so you can stop arranging your tools and start writing.",
    detail: "Markdown · DOCX · PDF",
  },
  {
    icon: Database,
    title: "Remember the good stuff",
    description: "Keep the names, places, secrets, and loose threads that make your story yours close at hand while you write.",
    detail: "Lore Vault",
  },
  {
    icon: MessageSquare,
    title: "A second pair of eyes",
    description: "When a scene needs another angle, ask for ideas grounded in the world you have already made. You stay in charge of every word.",
    detail: "Ideas when you want them",
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
  const [storyHovered, setStoryHovered] = useState(false);
  const [storyFocused, setStoryFocused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    analytics.track({ name: "hero_view" });
    setPlatform(getDetailedPlatformInfo().platform);
  }, []);

  useEffect(() => {
    if (storyPaused || storyHovered || storyFocused || prefersReducedMotion) return;
    const timer = window.setInterval(() => setStoryIndex((index) => (index + 1) % storyCards.length), 6500);
    return () => window.clearInterval(timer);
  }, [storyIndex, storyPaused, storyHovered, storyFocused, prefersReducedMotion]);

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

      <div className="landing min-h-screen overflow-hidden">
        <section className="relative overflow-hidden border-b border-black/10" aria-labelledby="hero-heading">
          <div className="pointer-events-none absolute inset-[-18%_-10%] opacity-85 [mask-image:radial-gradient(ellipse_at_center,black_42%,transparent_76%)]" aria-hidden="true">
            <PrismDemo />
          </div>
          <div className="container hero-layout relative z-10">
            <div className="relative z-10 min-w-0 max-w-3xl">
              <p className="hero-intro"><span aria-hidden="true" />A desktop writing studio for your stories</p>
              <h1 id="hero-heading" className="hero-title">A world<br />waiting to<br />be written.</h1>
              <p className="hero-description">
                The first sentence. The intricate world. The idea that won’t leave you alone. Bring them together in Solun.
              </p>
              <div className="mt-10 flex max-w-full flex-col gap-3 sm:flex-row sm:items-center">
                <GradientButton asChild className="group px-7">
                  <Link
                    to="/download"
                    onClick={() => analytics.track({ name: "cta_click", properties: { location: "hero", destination: "download", platform } })}
                  >
                    Download Solun
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </GradientButton>
                <Button asChild variant="ghost" size="lg" className="justify-start px-5 text-phthalo sm:justify-center">
                  <a href="#inside-solun">See how it works</a>
                </Button>
              </div>
              <p className="hero-availability">Free to start. Yours to keep.<span>For Windows, macOS & Linux.</span></p>
            </div>

            <div
              className="hero-story relative min-w-0"
              onMouseEnter={() => setStoryHovered(true)}
              onMouseLeave={() => setStoryHovered(false)}
              onFocusCapture={() => setStoryFocused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setStoryFocused(false);
              }}
              role="region"
              aria-roledescription="carousel"
              aria-label="Story excerpts"
            >
              <div className="hero-story-stack">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-[2.5deg] border border-black/10 bg-[#e6eadf]/80 shadow-sm" aria-hidden="true" />
                <div className="absolute inset-0 -translate-x-2 translate-y-1 rotate-[-4deg] border border-black/10 bg-[#f1eee3]/90 shadow-sm" aria-hidden="true" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={story.chapter}
                    aria-live={storyPaused || storyFocused || prefersReducedMotion ? "polite" : "off"}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18, rotate: 1.5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -14, rotate: -4, scale: 0.98 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="relative border border-black/10 bg-[#faf8f0]/95 p-5 shadow-[0_28px_80px_rgba(14,20,17,.16)] backdrop-blur-sm sm:p-6"
                  >
                    <div className="story-card-meta">
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

        <div className="landing-assurance container"><span><FileText size={17} aria-hidden="true" />A focused manuscript editor</span><span><Database size={17} aria-hidden="true" />A home for your story world</span><span><Shield size={17} aria-hidden="true" />Local-first by design</span></div>

        <section id="inside-solun" className="studio-section" aria-labelledby="studio-heading">
          <div className="container">
            <div className="studio-heading"><h2 id="studio-heading">Less between you<br />and the next sentence.</h2><div><p>A manuscript on one side. Your world close at hand. A little help when you ask for it.</p><p className="studio-invitation">Explore the studio below. It’s yours to try.</p></div></div>
            <StoryWorkspace />
            <div className="studio-caption"><span>A sample story, to show you around.</span><Link to="/features">Explore all features <ArrowRight size={16} aria-hidden="true" /></Link></div>
          </div>
        </section>

        <section className="writing-section" aria-labelledby="writing-heading"><div className="container"><div className="writing-heading"><h2 id="writing-heading">For the whole<br />life of a story.</h2><p>From a line scribbled at midnight to a world you know by heart. Keep it all in one writing space.</p></div><div className="writing-features">{features.map((feature) => <article key={feature.title}><feature.icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{feature.title}</h3><p>{feature.description}</p><span>{feature.detail}</span></article>)}</div><div className="ownership-note"><Shield size={22} aria-hidden="true" /><p><strong>Your story belongs to you.</strong> Keep your work locally, control your backups, and export when you’re ready.</p><Link to="/docs">Read the guide <ArrowRight size={16} aria-hidden="true" /></Link></div></div></section>

        <section className="landing-questions" aria-labelledby="questions-heading"><div className="container questions-layout"><div><h2 id="questions-heading">A few things<br />before you begin.</h2><Link to="/faqs">More questions? <ArrowRight size={16} aria-hidden="true" /></Link></div><Accordion type="single" collapsible>
          <AccordionItem value="free"><AccordionTrigger>Can I start writing for free?</AccordionTrigger><AccordionContent>Yes. The manuscript editor, Lore Vault, backups, and exports are included in Free. Download the desktop app and start without signing up.</AccordionContent></AccordionItem>
          <AccordionItem value="devices"><AccordionTrigger>Where can I use Solun?</AccordionTrigger><AccordionContent>Solun is a desktop writing studio for Windows, macOS, and Linux. You can explore this preview on your phone, then download the app on your computer.</AccordionContent></AccordionItem>
          <AccordionItem value="ai"><AccordionTrigger>Do I have to use AI?</AccordionTrigger><AccordionContent>No. Your writing space and Lore Vault work without AI. Pro adds optional assistance when you want another perspective; you choose what to share and what to keep.</AccordionContent></AccordionItem>
          <AccordionItem value="export"><AccordionTrigger>Can I take my writing with me?</AccordionTrigger><AccordionContent>Yes. Export your manuscript to Markdown, DOCX, or PDF, and keep backups you control. Your work remains yours.</AccordionContent></AccordionItem>
        </Accordion></div></section>

        <section className="landing-finale" aria-labelledby="cta-heading"><div className="container"><div className="finale-mark" aria-hidden="true"><BookOpen size={32} strokeWidth={1} /></div><h2 id="cta-heading">Every world begins<br />with a single sentence.</h2><p>Give yours a place to grow.</p><div className="finale-actions"><GradientButton asChild><Link to="/download">Download Solun <ArrowRight size={17} aria-hidden="true" /></Link></GradientButton><Button asChild variant="ghost" size="lg"><Link to="/pricing">Find your plan</Link></Button></div><span className="finale-note">Free to start. Windows, macOS & Linux.</span></div></section>
      </div>
    </>
  );
}
