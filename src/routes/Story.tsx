import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Database, 
  Wand2, 
  BookOpen,
  HardDrive,
  Globe,
  Palette,
  Type
} from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function Story() {
  const { ref: letterRef, inView: letterInView } = useInView<HTMLDivElement>("100px");
  const { ref: principlesRef, inView: principlesInView } = useInView<HTMLDivElement>("100px");
  const { ref: techRef, inView: techInView } = useInView<HTMLDivElement>("100px");
  const { ref: ethosRef, inView: ethosInView } = useInView<HTMLDivElement>("100px");

  const designPrinciples = [
    {
      icon: Sparkles,
      title: "Cozy minimalism",
      description: "Every element exists to support your flow. No clutter, no distractions—just the essential tools you need to bring your world to life."
    },
    {
      icon: Database,
      title: "Continuity by default",
      description: "Your story maintains itself. Characters remember their past, places hold their history, and threads weave together automatically."
    },
    {
      icon: Wand2,
      title: "Context at your fingertips",
      description: "Ask about anything. The system knows your world, understands your lore, and helps you explore ideas without breaking flow."
    },
    {
      icon: BookOpen,
      title: "Your project is your canon",
      description: "Everything you create becomes part of your world's truth. No separate files, no forgotten notes—just one living document of your creation."
    }
  ];

  return (
    <>
      <Helmet>
        <title>The Solun Story - Why We Built This</title>
        <meta name="description" content="A letter from the founder about the creative pain Solun solves—continuity, lore sprawl, and context fatigue. Learn about our design principles and why we chose desktop + web." />
        <link rel="canonical" href="https://solun.app/story" />
        <meta property="og:title" content="The Solun Story - Why We Built This" />
        <meta property="og:description" content="A letter about the creative pain Solun solves—continuity, lore sprawl, and context fatigue. Learn about our design principles and offline-first architecture." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/story" />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-story.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="The Solun Story" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@solun_app" />
        <meta name="twitter:creator" content="@solun_app" />
        <meta name="twitter:title" content="The Solun Story - Why We Built This" />
        <meta name="twitter:description" content="A letter about the creative pain Solun solves—continuity, lore sprawl, and context fatigue." />
        <meta name="twitter:image" content="https://solun.app/og-image-story.png" />
      </Helmet>

      <div className="min-h-screen">
        {/* Opening Letter Section */}
        <section className="section" style={{ paddingBlock: 'var(--space-section)' }}>
          <div className="container max-w-4xl xl:max-w-5xl mx-auto px-4">
            <div 
              ref={letterRef}
              className={`prose-reading-comfortable mx-auto transition-opacity duration-700 ${letterInView ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="card border-2 border-phthalo/20 bg-white/90 shadow-medium p-8 md:p-12">
                <div 
                  className="mb-8"
                  style={{
                    fontFamily: "'Newsreader', 'Georgia', serif",
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                    color: 'hsl(var(--phthalo))',
                    textAlign: 'center'
                  }}
                >
                  A Letter
                </div>
                
                <div className="space-y-6 text-lg leading-relaxed text-foreground">
                  <p>
                    <span className="text-phthalo font-semibold">World-building comes with a special kind of pain.</span> Not the dramatic kind—the quiet, accumulating kind that chips away at your creative energy.
                  </p>
                  
                  <p>
                    You write a character's backstory in chapter three. Six months later, you can't remember their mother's name. You sketch out a city's layout, save it somewhere, and spend twenty minutes hunting for it when you need it again. You build intricate relationships between factions, then realize you've contradicted yourself two chapters ago.
                  </p>
                  
                  <p>
                    This is continuity fatigue. Lore sprawl. Context loss. The cognitive overhead of keeping a world alive in your head—and in scattered notes, documents, and mental models—is immense.
                  </p>
                  
                  <p>
                    Solun exists to solve this pain. Not with flashy features or marketing promises, but with architecture that respects how stories actually work: interconnected, layered, alive. A system where every detail lives in relationship to everything else. Where context is never lost, continuity is never broken, and your creative energy goes to writing—not remembering.
                  </p>
                  
                  <p className="text-phthalo font-medium italic pt-4 border-t border-border/40">
                    That's why we built this.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="mx-auto max-w-5xl xl:max-w-6xl border-t border-black/10 my-12" />

        {/* Design Principles Section */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Design principles</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Four ideas that guide every decision we make
              </p>
            </div>

            <div 
              ref={principlesRef}
              className={`grid md:grid-cols-2 gap-6 transition-opacity duration-700 ${principlesInView ? 'opacity-100' : 'opacity-0'}`}
            >
              {designPrinciples.map((principle, index) => (
                <div key={principle.title} className="card-hover p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-phthalo/10 flex-shrink-0">
                      <principle.icon className="h-6 w-6 text-phthalo" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground pt-1">
                      {principle.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-16">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="mx-auto max-w-5xl xl:max-w-6xl border-t border-black/10 my-12" />

        {/* Why Desktop + Web Section */}
        <section className="section-tight">
          <div className="container max-w-4xl xl:max-w-5xl mx-auto px-4">
            <div 
              ref={techRef}
              className={`transition-opacity duration-700 ${techInView ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why desktop + web</h2>
                <p className="text-lg text-muted-foreground">
                  The technical foundation that makes everything possible
                </p>
              </div>

              <div className="space-y-8">
                <div className="card bg-gradient-subtle p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <HardDrive className="h-8 w-8 text-phthalo flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Offline-first architecture</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Your stories live on your device. No cloud sync delays, no internet dependency, no data mining. You write, Solun saves—instantly, locally, privately.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Everything works even when you're disconnected. Because creativity doesn't wait for Wi‑Fi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-gradient-subtle p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <Database className="h-8 w-8 text-olive flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-2xl font-bold mb-3">SQLite + vector search</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Your Lore Vault isn't just a database—it's a knowledge graph with vector embeddings. Characters, places, events all connect and relate to each other.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        When you ask the AI about a character, it searches through semantic relationships, not just keywords. Context emerges naturally from your world's structure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-gradient-subtle p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <Globe className="h-8 w-8 text-phthalo flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Electron foundation</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Built on Electron, Solun runs natively on Windows, macOS, and Linux. One codebase, three platforms, consistent experience.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        You get the performance of a desktop app with the flexibility of web technology. And yes, there's a web version too—same engine, same features, different shell.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="mx-auto max-w-5xl xl:max-w-6xl border-t border-black/10 my-12" />

        {/* Brand Ethos Callout */}
        <section className="section-tight bg-gradient-subtle">
          <div className="container max-w-4xl xl:max-w-5xl mx-auto px-4">
            <div 
              ref={ethosRef}
              className={`text-center transition-opacity duration-700 ${ethosInView ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <Palette className="h-6 w-6 text-olive" aria-hidden="true" />
                <h2 className="text-2xl md:text-3xl font-bold">Brand ethos</h2>
                <Type className="h-6 w-6 text-olive" aria-hidden="true" />
              </div>
              
              <div className="card border-2 border-olive/30 bg-white/90 shadow-soft p-8 md:p-12 max-w-3xl mx-auto">
                <p className="text-lg md:text-xl leading-relaxed text-foreground mb-6">
                  Solun's <span className="text-phthalo font-semibold">olive-cream theme</span> isn't just a color choice—it's a commitment to a writing environment that feels calm, focused, and timeless.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Deep phthalo greens on warm cream backgrounds. Like writing on aged parchment with fine ink. Comfortable for hours of creation, easy on the eyes, beautiful in its simplicity.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Our typography honors the writing tradition—monospace fonts that echo typewriters and manuscripts, with careful attention to readability and rhythm. Every letter, every line, every space is considered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Links */}
        <section className="section border-t border-border/40">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/download"
                className="btn btn-primary typewriter min-h-[44px] px-8 py-3"
              >
                Download Solun
              </Link>
              <Link
                to="/about"
                className="btn btn-ghost typewriter min-h-[44px] px-8 py-3"
              >
                Learn more about us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

