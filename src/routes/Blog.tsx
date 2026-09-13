import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Spotlight } from "@/components/ui/spotlight";
import { useNewsletter } from "@/hooks/use-newsletter";

const blogPosts = [
  {
    slug: "introducing-lore-vault",
    title: "Introducing the Lore Vault: Your World's Memory",
    excerpt: "See how structured characters, places, items, and relationships keep the details of a growing fictional world close at hand.",
    author: "Solun Team",
    date: "2024-10-15",
    readTime: "5 min read",
    category: "Features",
    featured: true,
    image: "/blog/introducing-lore-vault.svg"
  },
  {
    slug: "writing-with-ai-context",
    title: "Writing with AI That Knows Your World",
    excerpt: "Explore how selected Lore Vault context can make an AI conversation more relevant to your characters and world.",
    author: "Alex Chen",
    date: "2024-10-10",
    readTime: "7 min read",
    category: "AI",
    featured: false,
    image: "/blog/writing-with-ai-context.svg"
  }
];

export default function Blog() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const { subscribe, isSubmitting } = useNewsletter();
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubscribe = useCallback(() => {
    if (!email.trim()) {
      return; // Empty email - validation will be handled by the mutation
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    subscribe({ email, source: 'blog' });
    setEmail("");
  }, [email, subscribe, isSubmitting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Debounce the submission
    submitTimeoutRef.current = setTimeout(() => {
      handleSubscribe();
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Solun Blog - Stories, Updates & World-Building Insights</title>
        <meta name="description" content="Read the latest from the Solun team about world-building, AI-powered writing, creative workflows, and building better stories with technology." />
        <link rel="canonical" href="https://solun.app/blog" />
        <meta property="og:title" content="Solun Blog - World-Building & AI Writing Insights" />
        <meta property="og:description" content="Stories and insights from the Solun team about world-building, AI-powered creativity, and writing workflows." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/blog" />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content="https://solun.app/og-image-blog.svg" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Solun Blog - World-Building & AI Writing Insights" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@solun_app" />
        <meta name="twitter:creator" content="@solun_app" />
        <meta name="twitter:title" content="Solun Blog - World-Building & AI Writing Insights" />
        <meta name="twitter:description" content="Stories and insights from the Solun team about world-building, AI-powered creativity, and writing workflows." />
        <meta name="twitter:image" content="https://solun.app/og-image-blog.svg" />
        <meta name="twitter:image:alt" content="Solun Blog - World-Building & AI Writing Insights" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section relative overflow-hidden">
          <Spotlight className="top-12 left-16" />
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4">
            <div className="mx-auto md:mx-0 container-narrow text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Stories &
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Updates
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Insights, tutorials, and behind-the-scenes from the world of creative writing and world-building
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {blogPosts.find(post => post.featured) && (
          <section className="section-tight">
            <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
              <div className="mx-auto max-w-4xl xl:max-w-5xl">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phthalo/10 text-phthalo text-sm font-medium">
                    <Tag className="h-3 w-3" aria-hidden="true" />
                    Featured
                  </span>
                </div>

                {(() => {
                  const featuredPost = blogPosts.find(post => post.featured)!;
                  return (
                    <Link to={`/blog/${featuredPost.slug}`} className="block">
                      <div className="card-hover overflow-hidden">
                        <div className="aspect-video bg-gradient-subtle mb-6 rounded-lg overflow-hidden">
                          <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" aria-hidden="true" />
                              {featuredPost.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" aria-hidden="true" />
                              {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" aria-hidden="true" />
                              {featuredPost.readTime}
                            </span>
                          </div>

                          <h2 className="text-2xl md:text-3xl font-bold hover:text-phthalo transition-colors">
                            {featuredPost.title}
                          </h2>

                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {featuredPost.excerpt}
                          </p>

                          <div className="flex items-center gap-2 text-phthalo font-medium">
                            Read more
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
              {blogPosts.filter(post => !post.featured).map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="block h-full">
                  <div className="card-hover h-full">
                    <div className="aspect-video bg-gradient-subtle rounded-lg mb-4 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold line-clamp-2 hover:text-phthalo transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                        <span>{post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="section bg-gradient-subtle">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-2xl prose-reading-comfortable text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Stay in the loop
                </h2>
                <p className="text-muted-foreground">
                  Get notified about new posts, feature updates, and writing tips
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear error when user starts typing
                      if (emailError) setEmailError(null);
                    }}
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-3 rounded-xl border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-phthalo disabled:opacity-50 disabled:cursor-not-allowed ${
                      emailError ? "border-destructive" : "border-border"
                    }`}
                    aria-label="Email address for newsletter subscription"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "blog-email-error" : undefined}
                    required
                  />
                <button 
                  type="submit"
                  className="btn btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
                </div>
                {emailError && (
                  <p id="blog-email-error" className="text-sm font-medium text-destructive">
                    {emailError}
                  </p>
                )}
              </form>

              <p className="text-xs text-muted-foreground">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Pagination */}
        <section className="section border-t border-border/50">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Go to previous page">
                  Previous
                </button>
                <button className="px-3 py-2 rounded-lg bg-phthalo text-cream hover:bg-phthalo/90 transition-colors">
                  1
                </button>
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  2
                </button>
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                  3
                </button>
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors" aria-label="Go to next page">
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
