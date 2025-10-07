import { Helmet } from "react-helmet-async";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookies Policy - Solun</title>
        <meta name="description" content="Learn about how Solun uses cookies to enhance your experience. Understand our session cookies, analytics cookies, and how to manage your cookie preferences." />
        <link rel="canonical" href="https://solun.app/cookies" />
        <meta property="og:title" content="Cookies Policy - Solun" />
        <meta property="og:description" content="Learn about how Solun uses cookies to enhance your experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/cookies" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="section">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Cookies Policy</h1>
            <p className="text-muted-foreground">Last updated: October 7, 2025</p>
          </div>

          <nav className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#what-are-cookies" className="text-muted-foreground hover:text-foreground transition-colors">1. What Are Cookies</a></li>
              <li><a href="#how-we-use-cookies" className="text-muted-foreground hover:text-foreground transition-colors">2. How We Use Cookies</a></li>
              <li><a href="#types-of-cookies" className="text-muted-foreground hover:text-foreground transition-colors">3. Types of Cookies We Use</a></li>
              <li><a href="#session-cookies" className="text-muted-foreground hover:text-foreground transition-colors">4. Session Cookies</a></li>
              <li><a href="#analytics-cookies" className="text-muted-foreground hover:text-foreground transition-colors">5. Analytics Cookies</a></li>
              <li><a href="#third-party-cookies" className="text-muted-foreground hover:text-foreground transition-colors">6. Third-Party Cookies</a></li>
              <li><a href="#managing-cookies" className="text-muted-foreground hover:text-foreground transition-colors">7. Managing Your Cookie Preferences</a></li>
              <li><a href="#cookie-retention" className="text-muted-foreground hover:text-foreground transition-colors">8. Cookie Retention</a></li>
              <li><a href="#updates-policy" className="text-muted-foreground hover:text-foreground transition-colors">9. Updates to This Policy</a></li>
              <li><a href="#contact-cookies" className="text-muted-foreground hover:text-foreground transition-colors">10. Contact Us</a></li>
            </ul>
          </nav>

          <div className="prose prose-slate max-w-none">
            <section id="what-are-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p>Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences, improve user experience, and provide analytics about how the site is used.</p>
              <p>At Solun, we use cookies to enhance your writing workspace experience while respecting your privacy and giving you control over your data.</p>
            </section>

            <section id="how-we-use-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>To keep you logged in during your session</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze how our service is used and identify areas for improvement</li>
                <li>To ensure the security and proper functioning of our service</li>
                <li>To provide personalized features and content</li>
              </ul>
            </section>

            <section id="types-of-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              <p>We categorize cookies into different types based on their purpose and duration:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li><strong>Essential Cookies:</strong> Required for basic service functionality</li>
                <li><strong>Functional Cookies:</strong> Enhance your experience and remember your preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand service usage patterns</li>
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until deleted</li>
              </ul>
            </section>

            <section id="session-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Session Cookies</h2>
              <p>Session cookies are temporary cookies that are created when you visit our website and expire when you close your browser. These cookies are essential for:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Maintaining your login status during your browsing session</li>
                <li>Remembering items in your current writing session</li>
                <li>Ensuring secure access to your account</li>
                <li>Preventing unauthorized access to sensitive features</li>
              </ul>
              <p>Session cookies do not store personal information permanently and are automatically deleted when you close your browser.</p>
            </section>

            <section id="analytics-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Analytics Cookies</h2>
              <p>Analytics cookies help us understand how users interact with our writing workspace. These cookies collect anonymous information about:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Pages visited and time spent on each page</li>
                <li>Features used and user interactions</li>
                <li>Device and browser information (anonymized)</li>
                <li>General location data (country/region level only)</li>
              </ul>
              <p>All analytics data is aggregated and anonymized. We use this information to:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Improve the user experience and interface design</li>
                <li>Identify and fix technical issues</li>
                <li>Optimize performance and loading times</li>
                <li>Understand which features are most valuable to users</li>
              </ul>
              <p>We do not use analytics cookies to track individual users across other websites or services.</p>
            </section>

            <section id="third-party-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Third-Party Cookies</h2>
              <p>In some cases, we may use third-party services that set their own cookies. These include:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li><strong>Supabase:</strong> For secure data storage and authentication (session management)</li>
                <li><strong>Payment Processors:</strong> For secure payment processing when you subscribe to our service</li>
                <li><strong>Analytics Services:</strong> For understanding service usage (when enabled)</li>
              </ul>
              <p>Third-party cookies are subject to the respective third party's privacy policy. We carefully select our service providers to ensure they meet our privacy and security standards.</p>
            </section>

            <section id="managing-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Managing Your Cookie Preferences</h2>
              <p>You have several options to manage cookies:</p>

              <h3 className="text-lg font-medium mb-3">Browser Settings</h3>
              <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Block all cookies</li>
                <li>Block third-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Receive notifications when cookies are set</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">Essential vs. Non-Essential Cookies</h3>
              <p>Essential cookies cannot be disabled as they are required for basic service functionality. However, you can disable analytics and functional cookies without affecting core features.</p>

              <h3 className="text-lg font-medium mb-3">Cookie Management Tools</h3>
              <p>We respect Do Not Track signals and provide tools to help you manage your cookie preferences. If you disable certain cookies, some features may not function optimally.</p>
            </section>

            <section id="cookie-retention" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookie Retention</h2>
              <p>Our cookie retention periods vary based on their purpose:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Essential Cookies:</strong> Typically expire after 30 days of inactivity</li>
                <li><strong>Analytics Cookies:</strong> Retained for up to 2 years for trend analysis</li>
                <li><strong>Functional Cookies:</strong> Retained for up to 1 year or until you change your preferences</li>
              </ul>
              <p>You can clear cookies at any time through your browser settings.</p>
            </section>

            <section id="updates-policy" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Updates to This Policy</h2>
              <p>We may update this Cookies Policy from time to time to reflect changes in our practices or for legal reasons. When we make changes, we will update the "Last updated" date at the top of this page.</p>
              <p>We encourage you to review this policy periodically to stay informed about our cookie practices.</p>
            </section>

            <section id="contact-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p>If you have any questions about our use of cookies or this Cookies Policy, please contact us:</p>
              <p className="mt-4">
                <strong>Email:</strong> legal@solun.app<br />
                <strong>Address:</strong> [Company Address], Australia<br />
                <strong>Subject:</strong> Cookies Policy Inquiry
              </p>
            </section>

            <div className="mt-12 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This Cookies Policy was last updated on October 7, 2025. By continuing to use our service, you consent to our use of cookies as described in this policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
