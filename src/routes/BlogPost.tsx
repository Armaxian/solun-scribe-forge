import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

// This would typically come from a CMS or API
const blogPosts = [
  {
    slug: "introducing-lore-vault",
    title: "Introducing the Lore Vault: Your World's Memory",
    excerpt: "See how structured characters, places, items, and relationships keep the details of a growing fictional world close at hand.",
    content: `
      <p>World-building is both the most exciting and most challenging part of creative writing. You spend countless hours crafting intricate details about your characters, mapping out vast landscapes, and weaving complex relationships between elements. But as your world grows, so does the cognitive load of keeping everything straight.</p>

      <p>That's where the Lore Vault comes in—a revolutionary approach to world-building that treats your creative universe like a structured database, not just a collection of notes.</p>

      <h2>The Problem with Traditional World-Building</h2>

      <p>Most writers start with scattered notes: character sheets in Google Docs, world maps in image files, plot outlines in Evernote. This works fine for small projects, but as your world expands, you face several challenges:</p>

      <ul>
        <li><strong>Disconnected information:</strong> Characters exist in isolation from the places they inhabit</li>
        <li><strong>Manual cross-referencing:</strong> You have to remember that "the ancient oak in chapter 3" is the same tree mentioned in chapter 12</li>
        <li><strong>Timeline confusion:</strong> Events happen out of chronological order in your writing, but you need to track their actual sequence</li>
        <li><strong>Relationship complexity:</strong> As your cast grows, tracking who knows whom becomes impossible</li>
      </ul>

      <h2>How the Lore Vault Solves This</h2>

      <p>The Lore Vault treats your world as an interconnected set of characters, places, items, events, and the relationships between them. This structure keeps related details close when you need to check them.</p>

      <p>When you mention "Elara's crystal amulet" in your writing, the Lore Vault knows:</p>

      <ul>
        <li>Elara is a 27-year-old sorceress from the Northern Isles</li>
        <li>The amulet was given to her by her mentor, Archmage Thorne</li>
        <li>It contains a shard of the World Crystal, making it extremely valuable</li>
        <li>She received it after completing her apprenticeship three years ago</li>
      </ul>

      <h2>Relationship Mapping</h2>

      <p>You can connect related entries as your world grows. When a character visits a location for the first time, record the relationship or add the event to their timeline while the detail is fresh.</p>

      <p>Those connections make it easier to notice unexplored relationships and minor details that could become useful plot threads.</p>

      <h2>Timeline Intelligence</h2>

      <p>Events you add to a timeline give you a quick view of:</p>

      <ul>
        <li>What happened before and after any event</li>
        <li>Which characters were involved and how it affected them</li>
        <li>How long ago (in-world time) something occurred</li>
        <li>Where you may want to check the draft for timeline conflicts</li>
      </ul>

      <h2>Getting Started with the Lore Vault</h2>

      <p>The best part? You don't need to restructure your entire world-building process. Start small:</p>

      <ol>
        <li><strong>Add your main characters:</strong> Start with 2-3 key characters and their basic relationships</li>
        <li><strong>Map important locations:</strong> Add the settings that matter most to your plot</li>
        <li><strong>Track major events:</strong> Note the key moments that shape your story's timeline</li>
        <li><strong>Let it grow organically:</strong> As you write, add details when they become relevant</li>
      </ol>

      <p>The Lore Vault grows with your world, becoming more intelligent and helpful as you add more connections and details.</p>

      <h2>The Future of World-Building</h2>

      <p>The Lore Vault represents a fundamental shift in how writers can approach world-building. Instead of fighting against complexity, we embrace it—using technology to manage the intricate web of details that make rich, immersive worlds possible.</p>

      <p>Your imagination sets the boundaries of your world. The Lore Vault just makes sure you never get lost within them.</p>
    `,
    author: "Solun Team",
    date: "2024-10-15",
    readTime: "5 min read",
    category: "Features",
    tags: ["world-building", "lore", "database", "relationships", "timeline"]
  },
  {
    slug: "writing-with-ai-context",
    title: "Writing with AI That Knows Your World",
    excerpt: "Explore how selected Lore Vault context can make an AI conversation more relevant to your characters and world.",
    content: `
      <p>The promise of AI writing assistants has always been tempered by a fundamental limitation: they don't know your world. They can generate generic prose, suggest plot structures, or help with grammar—but they can't provide insights specific to your characters, your setting, or your plot.</p>

      <p>Solun can bring selected Lore Vault context into an AI conversation, giving the model useful details about your creative universe.</p>

      <h2>The Context Advantage</h2>

      <p>Adding specific information from your own content gives a language model more to work with. Instead of asking a generic AI "What should happen next in my fantasy novel?", you can ask contextual questions like:</p>

      <ul>
        <li>"Given Elara's fear of water from her childhood trauma, how might she react to crossing the flooded plains?"</li>
        <li>"What motivations would Thorne have for sending his apprentice on this particular quest?"</li>
        <li>"Are there any loose plot threads from the Battle of Three Rivers that I should address here?"</li>
      </ul>

      <h2>Context-Aware Suggestions</h2>

      <p>When you include relevant Lore Vault entries, the AI can make suggestions informed by the reality you have created. The result can still be wrong, so treat every response as material to review.</p>

      <p>When suggesting plot developments, it considers:</p>

      <ul>
        <li><strong>Character psychology:</strong> Based on backstories and established personality traits</li>
        <li><strong>World consistency:</strong> Respecting established lore and world rules</li>
        <li><strong>Timeline logic:</strong> Ensuring events happen in a coherent sequence</li>
        <li><strong>Relationship dynamics:</strong> Understanding how characters interact with each other</li>
      </ul>

      <h2>Seamless Integration</h2>

      <p>The chat interface is designed to work alongside your writing, not interrupt it. You can:</p>

      <ul>
        <li><strong>Highlight text</strong> and ask for analysis or suggestions about specific passages</li>
        <li><strong>Export responses</strong> directly into your editor as new content</li>
        <li><strong>Reference specific lore</strong> by mentioning character or place names</li>
        <li><strong>Iterate on ideas</strong> with conversational follow-ups</li>
      </ul>

      <h2>Beyond Writing Assistance</h2>

      <p>The contextual AI goes beyond just writing help. It can also help with world-building tasks like:</p>

      <ul>
        <li><strong>Character development:</strong> "What would be a believable motivation for this character's change of heart?"</li>
        <li><strong>Plot structuring:</strong> "Given the political tensions I've established, what conflicts might arise here?"</li>
        <li><strong>Lore expansion:</strong> "What cultural traditions might exist around this magical artifact?"</li>
        <li><strong>Consistency checking:</strong> "Does this new plot point contradict anything established earlier?"</li>
      </ul>

      <h2>Privacy and Control</h2>

      <p>You control which context accompanies an AI request. That selected material is sent securely to the AI service for processing; the rest of your manuscript and Lore Vault remain on your device.</p>

      <h2>The Writing Partner You've Been Waiting For</h2>

      <p>For the first time, AI writing assistance is contextual, personal, and deeply integrated with your creative process. It's not just a tool that helps you write—it's a partner that understands your world as well as you do.</p>

      <p>Ready to write with an AI that knows your characters by name and remembers every detail of your world? Welcome to the future of creative writing.</p>
    `,
    author: "Alex Chen",
    date: "2024-10-10",
    readTime: "7 min read",
    category: "AI",
    tags: ["AI", "writing assistance", "context", "lore"]
  },
  // Add more blog posts as needed...
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn btn-ghost">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Solun Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://solun.app/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} - Solun Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://solun.app/blog/${post.slug}`} />
        <meta property="og:site_name" content="Solun" />
        <meta property="og:image" content={`https://solun.app/blog/${post.slug}.svg`} />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@solun_app" />
        <meta name="twitter:creator" content="@solun_app" />
        <meta name="twitter:title" content={`${post.title} - Solun Blog`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`https://solun.app/blog/${post.slug}.svg`} />
        <meta name="twitter:image:alt" content={post.title} />
        <meta name="author" content={post.author} />
      </Helmet>

      <div className="min-h-screen">
        {/* Back Navigation */}
        <section className="section-tight border-b border-border/50">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="section">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-4xl prose-reading-comfortable">
              <div className="space-y-6">
                {/* Category & Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-phthalo/10 text-phthalo text-sm font-medium">
                    {post.category}
                  </span>
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center gap-6 text-muted-foreground border-b border-border/50 pb-8">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="section-tight">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl">
            <div className="grid grid-cols-1 3xl:grid-cols-[1fr_320px] gap-12 3xl:gap-16">
              {/* Main Article Content - Always stays at optimal reading width */}
              <article className="mx-auto max-w-4xl 3xl:mx-0 3xl:max-w-none prose-reading-comfortable prose prose-lg prose-invert">
                <div
                  className="prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-phthalo prose-code:text-phthalo prose-pre:bg-muted"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>
              
              {/* Secondary Column - Only visible on ultra-wide screens */}
              <aside className="hidden 3xl:block sticky top-24 h-fit">
                <div className="space-y-6">
                  <div className="card-hover p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="card-hover p-6">
                    <h3 className="text-lg font-semibold mb-4">Read More</h3>
                    <Link
                      to="/blog"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Blog
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Article Footer */}
        <section className="section border-t border-border/50">
          <div className="container max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
            <div className="mx-auto max-w-4xl prose-reading-comfortable">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Share this post:</span>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  to="/blog"
                  className="btn btn-ghost"
                >
                  More Articles
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
