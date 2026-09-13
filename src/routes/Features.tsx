import { ArrowRight, Database, FileText, MessageSquare, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";

const features = [
  {
    icon: FileText,
    eyebrow: "Manuscript",
    title: "Stay with the sentence",
    description: "Solun keeps the writing surface quiet while the practical work happens around it. Organize local projects, move through long drafts, and export without rebuilding your manuscript in another tool.",
    points: ["Focused rich-text editor", "Automatic local saves", "Markdown, DOCX, and PDF export"],
  },
  {
    icon: Database,
    eyebrow: "Lore Vault",
    title: "Give every detail a home",
    description: "Characters, places, items, relationships, and timelines sit beside the manuscript. A detail can stay useful long after the note where it first appeared.",
    points: ["Structured lore entries", "Relationships and timeline notes", "Cross-references to your writing"],
  },
  {
    icon: MessageSquare,
    eyebrow: "AI assistance",
    title: "Ask with context",
    description: "Bring selected passages and relevant lore into an AI conversation when you want another perspective. Suggestions remain suggestions: you decide what belongs in the story.",
    points: ["Context from selected writing and lore", "Usage shown in your account", "Internet connection and Pro subscription required"],
  },
  {
    icon: Shield,
    eyebrow: "Local-first",
    title: "Keep the archive on your device",
    description: "Your manuscript, lore, and backups are stored locally in SQLite. Solun does not automatically sync your writing to the cloud.",
    points: ["Device-local project data", "Backups and exports you control", "Only chosen context leaves the device for AI"],
  },
];

export default function Features() {
  return (
    <>
      <Helmet>
        <title>Features — Solun writing studio</title>
        <meta name="description" content="Explore Solun’s focused editor, Lore Vault, optional context-aware AI assistance, and local-first storage." />
        <link rel="canonical" href="https://solun.app/features" />
        <meta property="og:title" content="Features — Solun writing studio" />
        <meta property="og:description" content="A focused editor, structured Lore Vault, optional AI assistance, and local-first storage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/features" />
      </Helmet>

      <div className="min-h-screen">
        <section className="border-b border-black/10 py-24 md:py-32" aria-labelledby="features-heading">
          <div className="container max-w-7xl">
            <p className="label-mono text-phthalo">Four parts, one workspace</p>
            <h1 id="features-heading" className="display-serif mt-7 max-w-5xl text-6xl font-normal leading-[.95] tracking-[-.05em] md:text-8xl">
              Everything your story needs to stay <span className="italic text-phthalo">within reach.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground/65 md:text-xl">
              Solun brings the manuscript and the thinking around it into one desktop studio, while keeping the work itself on your device.
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
            <p className="label-mono text-white/55">Your first project is free</p>
            <h2 id="feature-cta-heading" className="display-serif mx-auto mt-7 max-w-4xl text-5xl font-normal leading-[1.02] tracking-[-.04em] md:text-7xl">
              Open the door. Keep the world inside.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/65">Write locally without an account. Add a Pro subscription only if you want AI assistance.</p>
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
