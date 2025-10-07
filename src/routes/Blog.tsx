import { Helmet } from "react-helmet-async";
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    slug: "introducing-lore-vault",
    title: "Introducing the Lore Vault: Your World's Memory",
    excerpt: "Discover how Solun's interconnected knowledge base revolutionizes world-building by keeping track of characters, places, and relationships automatically.",
    author: "Solun Team",
    date: "2024-10-15",
    readTime: "5 min read",
    category: "Features",
    featured: true,
    image: "/placeholder.svg"
  },
  {
    slug: "writing-with-ai-context",
    title: "Writing with AI That Knows Your World",
    excerpt: "Explore how RAG-powered chat uses your Lore Vault to provide context-aware writing assistance and plot suggestions.",
    author: "Alex Chen",
    date: "2024-10-10",
    readTime: "7 min read",
    category: "AI",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    slug: "offline-first-architecture",
    title: "Why Offline-First Matters for Creative Work",
    excerpt: "Learn about Solun's SQLite-based architecture and why keeping your data local and private is crucial for world-building.",
    author: "Maria Rodriguez",
    date: "2024-10-05",
    readTime: "6 min read",
    category: "Technology",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    slug: "continuity-engine-deep-dive",
    title: "The Continuity Engine: Never Forget a Detail",
    excerpt: "A deep dive into how Solun automatically tracks character arcs, plot threads, and timeline consistency across your entire work.",
    author: "Jordan Smith",
    date: "2024-09-28",
    readTime: "8 min read",
    category: "Features",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    slug: "version-control-for-writers",
    title: "Version Control for Writers: Branch Your Stories",
    excerpt: "Discover how built-in versioning lets you experiment with plot changes while preserving every draft and idea.",
    author: "Sam Taylor",
    date: "2024-09-20",
    readTime: "4 min read",
    category: "Workflow",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    slug: "olive-cream-theme-story",
    title: "The Story Behind the Olive + Cream Theme",
    excerpt: "Learn about the design philosophy behind Solun's premium minimal aesthetic and why it creates the perfect writing environment.",
    author: "Design Team",
    date: "2024-09-15",
    readTime: "3 min read",
    category: "Design",
    featured: false,
    image: "/placeholder.svg"
  }
];

const categories = ["All", "Features", "AI", "Technology", "Workflow", "Design"];

export default function Blog() {
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
        <meta property="og:image" content="https://solun.app/og-image-blog.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solun Blog - World-Building & AI Writing Insights" />
        <meta name="twitter:description" content="Stories and insights from the Solun team about world-building, AI-powered creativity, and writing workflows." />
        <meta name="twitter:image" content="https://solun.app/og-image-blog.png" />
      </Helmet>

      <div className="min-h-screen bg-[#FFF8E7]">
        {/* Hero Section */}
        <section className="section">
          <div className="container mx-auto px-4">
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

        {/* Category Filter */}
        <section className="section-tight border-b border-border/50">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {blogPosts.find(post => post.featured) && (
          <section className="section-tight">
            <div className="container">
              <div className="mx-auto max-w-4xl">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phthalo/10 text-phthalo text-sm font-medium">
                    <Tag className="h-3 w-3" />
                    Featured
                  </span>
                </div>

                {(() => {
                  const featuredPost = blogPosts.find(post => post.featured)!;
                  return (
                    <Link to={`/blog/${featuredPost.slug}`} className="block">
                      <div className="card-hover overflow-hidden">
                        <div className="aspect-video bg-gradient-subtle flex items-center justify-center mb-6">
                          <div className="text-center space-y-4">
                            <Calendar className="h-12 w-12 text-phthalo/40 mx-auto" />
                            <p className="text-muted-foreground font-medium">Featured Post Image</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {featuredPost.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
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
                            <ArrowRight className="h-4 w-4" />
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
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.filter(post => !post.featured).map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="block h-full">
                  <div className="card-hover h-full">
                    <div className="aspect-video bg-gradient-subtle rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Calendar className="h-8 w-8 text-phthalo/40 mx-auto" />
                        <p className="text-xs text-muted-foreground">Post Image</p>
                      </div>
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
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Stay in the loop
                </h2>
                <p className="text-muted-foreground">
                  Get notified about new posts, feature updates, and writing tips
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-phthalo"
                />
                <button className="btn btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Pagination */}
        <section className="section border-t border-border/50">
          <div className="container">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
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
