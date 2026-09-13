import { Search, HelpCircle, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tone } from "@/copy/tone";
import { analytics } from "@/lib/analytics";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "New to Solun? Start here.",
    items: [
      {
        id: "what-is-solun",
        question: "What is Solun?",
        answer: "Solun is a local-first desktop writing studio for fiction. It combines a focused editor, a structured Lore Vault, and optional AI assistance that can use context you choose.",
      },
      {
        id: "download-install",
        question: "How do I download and install Solun?",
        answer: "Visit the Download page and choose the installer for Windows, macOS, or Linux. Public installers will appear there as each platform release becomes available.",
      },
      {
        id: "first-story",
        question: "How do I create my first story?",
        answer: "Click 'New Story' in the sidebar, choose a title and genre, then start writing on your first page. Solun uses a page-by-page writing flow that helps you focus on one section at a time.",
      },
      {
        id: "lore-vault-basics",
        question: "What is the Lore Vault and how do I use it?",
        answer: "The Lore Vault is a structured database where you store characters, places, items, events, and their relationships. Navigate to the Lore tab to add your first entry. Everything you add connects together, creating a web of knowledge that powers AI conversations about your world.",
      },
    ],
  },
  {
    id: "pricing-licensing",
    title: "Pricing & Licensing",
    description: "Understanding costs and licenses.",
    items: [
      {
        id: "pricing-model",
        question: "How much does Solun cost?",
        answer: "The desktop editor, Lore Vault, local backups, and exports are free. Pro adds AI writing assistance and a monthly usage allowance. Visit the Pricing page for current details.",
      },
      {
        id: "subscription-types",
        question: "What plans are available?",
        answer: "Solun currently offers Free and Pro plans for individual writers. Team collaboration is not currently offered.",
      },
      {
        id: "license-validation",
        question: "How does license validation work?",
        answer: "Free writing features do not require an account. Solun verifies your signed-in account before enabling subscription-based AI assistance.",
      },
      {
        id: "trial-period",
        question: "Is there a free trial?",
        answer: "The writing workspace is free to use, so you can evaluate the editor and Lore Vault before deciding whether to subscribe for AI assistance.",
      },
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Your data, your control.",
    items: [
      {
        id: "data-storage",
        question: "Where is my data stored?",
        answer: "Your stories and Lore Vault are stored locally on your device in SQLite. Solun does not automatically sync manuscript content to the cloud.",
      },
      {
        id: "data-privacy",
        question: "Is my writing data private?",
        answer: "Your manuscript and lore stay on your device. When you make an AI request, the prompt and context you selected are sent securely to the AI service for processing. See the Privacy Policy for the full data flow.",
      },
      {
        id: "offline-mode",
        question: "Does Solun work offline?",
        answer: "The editor, Lore Vault, local saves, and exports work without a network connection. Signing in, billing, updates, and AI assistance require internet access.",
      },
      {
        id: "data-export",
        question: "Can I export my data?",
        answer: "Yes, you can export your stories in multiple formats (Markdown, PDF, DOCX) and export your Lore Vault as JSON. Your data is always portable, and you're never locked in.",
      },
    ],
  },
  {
    id: "ai-lore-vault",
    title: "AI & Lore Vault",
    description: "Using your world as context.",
    items: [
      {
        id: "ai-context",
        question: "How does Solun give AI context?",
        answer: "Solun can include relevant Lore Vault entries and selected manuscript text with an AI request. That context helps the response fit your world, but you should still review every suggestion.",
      },
      {
        id: "lore-vault-structure",
        question: "How should I structure my Lore Vault?",
        answer: "Add entities like characters, places, and items with rich descriptions. Create relationships between entities (e.g., 'Character A knows Character B', 'Event X happened at Location Y'). The more detailed and interconnected your lore, the better AI responses will be.",
      },
      {
        id: "ai-consistency",
        question: "How does AI maintain consistency with my lore?",
        answer: "AI can use relevant lore as context when you ask a question, but it does not guarantee continuity. Treat its response as a suggestion and check important details against your manuscript and Lore Vault.",
      },
      {
        id: "vector-search",
        question: "What is vector search and why is it important?",
        answer: "Vector search allows Solun to find semantically similar content in your Lore Vault. When you ask 'What motivates Character X?', it searches for related information even if you don't use exact keywords. This makes the AI understand context and relationships.",
      },
    ],
  },
  {
    id: "desktop",
    title: "Desktop",
    description: "Platforms and local data.",
    items: [
      {
        id: "desktop-app",
        question: "Is Solun a desktop app?",
        answer: "Yes. The writing workspace is a desktop app. This website provides product information, downloads, account access, billing, documentation, and support.",
      },
      {
        id: "system-requirements",
        question: "What are the system requirements?",
        answer: "Planned desktop support covers Windows 10+, macOS 11+, and common 64-bit Linux distributions. Check the Download page for the platforms available in the current release.",
      },
      {
        id: "sync-between-devices",
        question: "Can I sync my work between devices?",
        answer: "Automatic cloud sync is not currently available. Use local backups and exports to move or protect your work.",
      },
      {
        id: "account-browser-support",
        question: "Which browsers can I use for the website and account pages?",
        answer: "Use a current version of Chrome, Firefox, Safari, or Edge with JavaScript enabled.",
      },
    ],
  },
];

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const location = useLocation();

  // Track page view
  useEffect(() => {
    analytics.track({ name: 'page_view', properties: { page: 'faqs' } });
  }, []);

  // Handle deep linking to specific FAQ items
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.slice(1); // Remove #
      
      // Find the FAQ item by ID
      const allItems = FAQ_CATEGORIES.flatMap(cat => 
        cat.items.map(item => ({
          categoryId: cat.id,
          itemId: item.id,
          fullId: `${cat.id}-${item.id}`,
        }))
      );
      
      const targetItem = allItems.find(item => 
        item.itemId === hash || item.fullId === hash
      );

      if (targetItem) {
        const accordionItemId = targetItem.fullId;
        // Open the accordion item if not already open
        setOpenItems(prev => {
          if (prev.includes(accordionItemId)) {
            return prev;
          }
          return [...prev, accordionItemId];
        });
        
        // Scroll to the item after a short delay to ensure accordion is open
        setTimeout(() => {
          const element = document.getElementById(targetItem.itemId) || 
                         document.getElementById(accordionItemId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      }
    }

  }, [location.hash]);

  // Filter FAQs based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return FAQ_CATEGORIES;
    }

    const query = searchQuery.toLowerCase();

    return FAQ_CATEGORIES.map((category) => {
      const filteredItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );

      if (filteredItems.length === 0) {
        return null;
      }

      return {
        ...category,
        items: filteredItems,
      };
    }).filter((category): category is FAQCategory => category !== null);
  }, [searchQuery]);

  // Track analytics when accordion opens
  const handleAccordionChange = (value: string[]) => {
    setOpenItems(value);
    
    // Track which FAQ item was opened
    if (value.length > openItems.length) {
      const openedId = value.find(id => !openItems.includes(id));
      if (openedId) {
        analytics.track({
          name: "faq_opened",
          properties: {
            faq_id: openedId,
            category: openedId.split("-").slice(0, -1).join("-"),
          },
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>FAQs - Frequently Asked Questions | Solun</title>
        <meta
          name="description"
          content="Find answers about getting started with Solun, pricing, privacy, AI context, local storage, and desktop support."
        />
        <link rel="canonical" href="https://solun.app/faqs" />
        <meta property="og:title" content="FAQs - Frequently Asked Questions | Solun" />
        <meta
          property="og:description"
          content="Get answers to your questions about Solun's features, pricing, privacy, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/faqs" />
      </Helmet>

      <div className="section">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about Solun
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search frequently asked questions"
            />
          </div>

          {/* FAQ Categories */}
          {filteredCategories.length > 0 ? (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div key={category.id} id={category.id}>
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>

                  <Accordion
                    type="multiple"
                    value={openItems}
                    onValueChange={handleAccordionChange}
                    className="space-y-2"
                  >
                    {category.items.map((item) => {
                      const itemId = `${category.id}-${item.id}`;
                      return (
                        <AccordionItem
                          key={itemId}
                          value={itemId}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger
                            id={`${itemId}-trigger`}
                            aria-expanded={openItems.includes(itemId)}
                            className="text-left"
                          >
                            <span className="font-medium">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              id={item.id}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {item.answer.split("\n").map((paragraph, index) => (
                                <p key={index} className="mb-3 last:mb-0">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              {(() => {
                const emptyState = tone.empty('search');
                return (
                  <>
                    <h3 className="text-lg font-medium mb-2">{emptyState.title}</h3>
                    <p className="text-muted-foreground mb-6">
                      {emptyState.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                      >
                        {emptyState.cta}
                      </Button>
                      <Link to="/contact">
                        <Button>
                          {tone.cta('contact')}
                        </Button>
                      </Link>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 border-t border-border pt-12">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Didn't find your answer?</h2>
              <p className="text-muted-foreground">
                Can't find what you're looking for? We're here to help.
              </p>
              <Link to="/contact">
                <Button className="mt-4" aria-label="Contact us">
                  {tone.cta('contact')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

