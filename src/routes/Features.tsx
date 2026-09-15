import { ArrowRight, Database, FileText, MessageSquare, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";

const features = [
  {
    icon: FileText,
    eyebrow: "The page",
    title: "Get out of your own way",
    description: "Open Solun and get straight to the work. Write scenes, move through long drafts, and shape the story without wrestling with your writing tools.",
    points: ["A clear, focused writing space", "Your work saved as you go", "Easy export when the draft is ready"],
  },
  {
    icon: Database,
    eyebrow: "Your world",
    title: "Never lose the detail that makes it yours",
    description: "Keep names, places, histories, secrets, and story threads close to the manuscript. When you need a detail, it is there—not buried in an old note.",
    points: ["Characters, places, and objects", "Connections between story details", "A clearer view of the world you are building"],
  },
  {
    icon: MessageSquare,
    eyebrow: "When you need a nudge",
    title: "Find a way forward",
    description: "Stuck on a scene or unsure what comes next? Get a fresh perspective based on the parts of your story you choose. Keep the ideas you love and leave the rest.",
    points: ["Fresh ideas for difficult scenes", "Help shaped by your story", "You decide what belongs on the page"],
  },
  {
    icon: Shield,
    eyebrow: "Your writing space",
    title: "A place that feels like yours",
    description: "Your stories are there when you sit down to write, without feeds, notifications, or a maze of settings competing for your attention.",
    points: ["A private space for your projects", "Backups and exports you control", "No distractions between you and the page"],
  },
];

export default function Features() {
  return (
    <>
      <Helmet>
        <title>Features — Solun writing studio</title>
        <meta name="description" content="See how Solun helps you write, remember your story world, and keep moving when the next scene is hard." />
        <link rel="canonical" href="https://solun.app/features" />
        <meta property="og:title" content="Features — Solun writing studio" />
        <meta property="og:description" content="A clear writing space, a home for story details, and a little help when you need a way forward." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/features" />
      </Helmet>

      <div className="min-h-screen">
        <section className="border-b border-black/10 py-24 md:py-32" aria-labelledby="features-heading">
          <div className="container max-w-7xl">
            <p className="label-mono text-phthalo">Made for the way stories actually happen</p>
            <h1 id="features-heading" className="display-serif mt-7 max-w-5xl text-6xl font-normal leading-[.95] tracking-[-.05em] md:text-8xl">
              Write the story. <span className="italic text-phthalo">Keep the world.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/65 md:text-xl">
              Solun gives you one clear place for the draft, the details, and the ideas that make the story worth finishing.
            </p>
          </div>
        </section>

        <section aria-label="Solun features">
          <div className="container max-w-7xl">
            {features.map((feature, index) => (
              <article key={feature.eyebrow} className="grid gap-10 border-b border-black/10 py-20 md:py-28 lg:grid-cols-[.6fr_1.4fr]">
                <div className="flex items-start justify-between lg:block">
                  <span className="label-mono text-foreground/35">0{index + 1}</span>
                  <feature.icon className="mt-0 h-8 w-8 text-phthalo lg:mt-10 lg:h-10 lg:w-10" aria-hidden="true" />
                </div>
                <div>
                  <p className="label-mono text-phthalo">{feature.eyebrow}</p>
                  <h2 className="display-serif mt-4 text-4xl font-normal tracking-[-.035em] md:text-6xl">{feature.title}</h2>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/65">{feature.description}</p>
                  <ul className="mt-10 grid gap-3 border-t border-black/10 pt-6 md:grid-cols-3">
                    {feature.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-6 text-foreground/70">
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-phthalo" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-phthalo py-24 text-white md:py-32" aria-labelledby="feature-cta-heading">
          <div className="container max-w-5xl text-center">
            <p className="label-mono text-white/55">Start with the part that matters</p>
            <h2 id="feature-cta-heading" className="display-serif mx-auto mt-7 max-w-4xl text-5xl font-normal leading-[1.02] tracking-[-.04em] md:text-7xl">
              The blank page is waiting.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/65">Download Solun and give the story in your head somewhere to go.</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <GradientButton asChild><Link to="/download">Download Solun</Link></GradientButton>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"><Link to="/pricing">View pricing</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
