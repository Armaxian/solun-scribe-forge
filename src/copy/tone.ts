/**
 * Solun Tone API
 * 
 * Single source of truth for the Solun voice: playful, intimate, witty,
 * cute, premium, and writer-centric. This API generates consistent microcopy
 * across the application.
 */

type CtaKind = 'primary' | 'secondary' | 'download' | 'try' | 'contact' | 'learn';
type ToastKind = 'success' | 'error' | 'info';
type ErrorKind = 'notFound' | 'network' | 'auth' | 'form' | 'generic';
type EmptyKind = 'blog' | 'lore' | 'search' | 'downloads';
type LoadingKind = 'general' | 'skeleton';

type FormLabelKey = 
  | 'name'
  | 'email'
  | 'subject'
  | 'message'
  | 'licenseKey'
  | 'password'
  | 'confirmPassword'
  | 'search';

interface FormLabels {
  label: string;
  placeholder?: string;
  validation: {
    required: string;
    minLength?: (min: number) => string;
    maxLength?: (max: number) => string;
    pattern?: string;
    email?: string;
    match?: string;
  };
}

/**
 * Tone API for generating Solun-branded copy
 */
export const tone = {
  /**
   * Generate a greeting message
   * @param name - Optional user name for personalization
   */
  greet(name?: string): string {
    if (name) {
      const greetings = [
        `Hey ${name}, welcome back`,
        `Welcome back, ${name}`,
        `Nice to see you again, ${name}`,
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    return "Welcome back, writer";
  },

  /**
   * Generate call-to-action text
   * @param kind - Type of CTA needed
   */
  cta(kind: CtaKind): string {
    const ctas: Record<CtaKind, string[]> = {
      primary: [
        "Start your chapter",
        "Begin your story",
        "Create your world",
        "Start writing",
      ],
      secondary: [
        "Tell me a story",
        "Explore features",
        "See what's possible",
        "Learn more",
      ],
      download: [
        "Bring Solun home",
        "Download for free",
        "Get Solun",
        "Download Solun",
      ],
      try: [
        "Open a fresh page",
        "Try it free",
        "Start your trial",
        "Give it a go",
      ],
      contact: [
        "Whisper to support",
        "Get in touch",
        "Say hello",
        "Contact us",
      ],
      learn: [
        "Tell me a story",
        "Learn more",
        "Discover how",
        "Find out more",
      ],
    };

    const options = ctas[kind];
    return options[Math.floor(Math.random() * options.length)];
  },

  /**
   * Generate toast notification messages
   * @param kind - Type of toast (success, error, info)
   * @param detail - Optional additional context
   */
  toast(kind: ToastKind, detail?: string): { title: string; description: string } {
    const toasts: Record<ToastKind, { title: string[]; description: (detail?: string) => string }> = {
      success: {
        title: [
          "Saved",
          "Done!",
          "Perfect!",
          "All set!",
        ],
        description: (detail) => detail || "Your future self sends a wink.",
      },
      error: {
        title: [
          "My bad—that didn't land",
          "Oops, that slipped",
          "Hmm, not quite",
        ],
        description: (detail) => {
          // Check if detail mentions rate limiting
          if (detail?.toLowerCase().includes('rate limit') || detail?.toLowerCase().includes('too many')) {
            return detail.includes("We're pacing ourselves") ? detail : "We're pacing ourselves. Try in a minute.";
          }
          return detail || "Fix the red bits and try again.";
        },
      },
      info: {
        title: [
          "Just so you know",
          "Quick heads up",
          "FYI",
        ],
        description: (detail) => detail || "Here's what's happening",
      },
    };

    const config = toasts[kind];
    const title = config.title[Math.floor(Math.random() * config.title.length)];
    const description = config.description(detail);

    return { title, description };
  },

  /**
   * Generate error messages
   * @param kind - Type of error
   * @param detail - Optional additional context
   */
  error(kind: ErrorKind, detail?: string): string {
    const errors: Record<ErrorKind, string[]> = {
      notFound: [
        "This page wandered off somewhere",
        "Looks like this page took a wrong turn",
        "This page seems to have vanished",
      ],
      network: [
        "Connection hiccup—check your internet",
        "Can't reach the server right now",
        "Network's being a bit finicky",
      ],
      auth: [
        "Sign in needed",
        "Please sign in to continue",
        "Let's get you signed in",
      ],
      form: [
        "Something's not quite right",
        "Let's fix a few things",
        "A few tweaks needed",
      ],
      generic: [
        "Something unexpected happened",
        "We hit a snag",
        "Oops, that's not supposed to happen",
      ],
    };

    const options = errors[kind];
    const base = options[Math.floor(Math.random() * options.length)];
    
    if (detail) {
      return `${base}. ${detail}`;
    }
    
    return base;
  },

  /**
   * Generate empty state messages
   * @param kind - Type of empty state
   */
  empty(kind: EmptyKind): { title: string; description: string; cta?: string } {
    const empties: Record<EmptyKind, { title: string; description: string; cta?: string }> = {
      blog: {
        title: "No posts yet",
        description: "Check back soon—we're brewing something special",
        cta: "Explore features",
      },
      lore: {
        title: "Your world is quiet—for now.",
        description: "Every story starts somewhere. Add your first entry to begin building your Lore Vault.",
        cta: "Add your first entry",
      },
      search: {
        title: "Nothing found",
        description: "Try different words or check your spelling",
        cta: "Clear search",
      },
      downloads: {
        title: "Nothing to grab yet. Soon, promise.",
        description: "New versions will appear here when they're ready. Check back soon!",
        cta: "Refresh",
      },
    };

    return empties[kind];
  },

  /**
   * Generate loading skeleton microcopy
   * @param kind - Type of loading state
   */
  loading(kind: LoadingKind = 'general'): string {
    const loadings: Record<LoadingKind, string[]> = {
      general: [
        "Sharpening pencils…",
        "Warming the typewriter…",
        "Preparing your workspace…",
        "Loading your world…",
      ],
      skeleton: [
        "Sharpening pencils…",
        "Warming the typewriter…",
        "Gathering your stories…",
        "Preparing…",
      ],
    };

    const options = loadings[kind];
    return options[Math.floor(Math.random() * options.length)];
  },

  /**
   * Generate form labels and validation messages
   * @param labelKey - The form field identifier
   */
  form(labelKey: FormLabelKey): FormLabels {
    const forms: Record<FormLabelKey, FormLabels> = {
      name: {
        label: "Name",
        placeholder: "Your name",
        validation: {
          required: "Don't leave me hanging, babe.",
          minLength: (min) => `Name needs at least ${min} characters`,
          maxLength: (max) => `Name can't be more than ${max} characters`,
        },
      },
      email: {
        label: "Email",
        placeholder: "you@example.com",
        validation: {
          required: "Don't leave me hanging, babe.",
          email: "That email looks shy. Double-check it, bro.",
        },
      },
      subject: {
        label: "Subject",
        placeholder: "What's this about?",
        validation: {
          required: "Don't leave me hanging, babe.",
          minLength: (min) => `Subject needs at least ${min} characters`,
          maxLength: (max) => `Subject can't be more than ${max} characters`,
        },
      },
      message: {
        label: "Message",
        placeholder: "Tell us what's on your mind...",
        validation: {
          required: "Don't leave me hanging, babe.",
          minLength: (min) => `Message needs at least ${min} characters`,
          maxLength: (max) => `Message can't be more than ${max} characters`,
        },
      },
      licenseKey: {
        label: "License Key",
        placeholder: "SOLUN-PRO-XXXX-XXXX",
        validation: {
          required: "Don't leave me hanging, babe.",
          pattern: "License key can only have letters, numbers, and hyphens",
        },
      },
      password: {
        label: "Password",
        placeholder: "Enter your password",
        validation: {
          required: "Don't leave me hanging, babe.",
          minLength: (min) => `Password needs at least ${min} characters`,
        },
      },
      confirmPassword: {
        label: "Confirm Password",
        placeholder: "Enter your password again",
        validation: {
          required: "Don't leave me hanging, babe.",
          match: "Passwords don't match",
        },
      },
      search: {
        label: "Search",
        placeholder: "What are you looking for?",
        validation: {
          required: "Don't leave me hanging, babe.",
        },
      },
    };

    return forms[labelKey];
  },

  /**
   * Reusable one-liner snippets with Solun voice
   */
  snippets: {
    writingAmbiance: "Pages smell like coffee and ambition",
    welcome: "Welcome to your writing sanctuary",
    emptyVault: "Every world starts with a single entry",
    offline: "Your words work even when the internet doesn't",
    saving: "Your words are safe with us",
    versioning: "Every draft matters",
    consistency: "Your world stays consistent, automatically",
    privacy: "Your stories, your vault, your control",
    support: "We're here when you need us",
    comingSoon: "Something lovely is brewing",
  },
};

