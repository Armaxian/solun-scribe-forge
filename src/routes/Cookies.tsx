import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

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
            <p className="text-muted-foreground">Last updated: January 3, 2025</p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link to="/legal" className="text-phthalo hover:underline">← Back to Legal Center</Link>
            </p>
          </div>

          <nav className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#what-are-cookies" className="text-muted-foreground hover:text-foreground transition-colors">1. What Are Cookies</a></li>
              <li><a href="#how-we-use-cookies" className="text-muted-foreground hover:text-foreground transition-colors">2. How We Use Cookies</a></li>
              <li><a href="#types-of-cookies" className="text-muted-foreground hover:text-foreground transition-colors">3. Categories of Cookies</a></li>
              <li><a href="#cookie-table" className="text-muted-foreground hover:text-foreground transition-colors">4. Cookie Table</a></li>
              <li><a href="#session-cookies" className="text-muted-foreground hover:text-foreground transition-colors">5. Session Cookies</a></li>
              <li><a href="#analytics-cookies" className="text-muted-foreground hover:text-foreground transition-colors">6. Analytics Cookies</a></li>
              <li><a href="#third-party-cookies" className="text-muted-foreground hover:text-foreground transition-colors">7. Third-Party Cookies</a></li>
              <li><a href="#managing-cookies" className="text-muted-foreground hover:text-foreground transition-colors">8. How to Manage Your Cookie Preferences</a></li>
              <li><a href="#cookie-retention" className="text-muted-foreground hover:text-foreground transition-colors">9. Cookie Retention Periods</a></li>
              <li><a href="#updates-policy" className="text-muted-foreground hover:text-foreground transition-colors">10. Updates to This Policy</a></li>
              <li><a href="#contact-cookies" className="text-muted-foreground hover:text-foreground transition-colors">11. Contact Us</a></li>
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
              <h2 className="text-2xl font-semibold mb-4">3. Categories of Cookies</h2>
              <p>We categorize cookies into two main categories based on their purpose:</p>
              
              <h3 className="text-lg font-medium mb-3 mt-4">Essential Cookies</h3>
              <p>These cookies are strictly necessary for the Service to function properly. They enable core functionality such as authentication, security, and session management. Essential cookies cannot be disabled as they are required for basic service operation.</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Authentication cookies (keep you logged in)</li>
                <li>Session management cookies (maintain your session state)</li>
                <li>Security cookies (prevent unauthorized access)</li>
                <li>CSRF protection cookies (prevent cross-site request forgery)</li>
              </ul>

              <h3 className="text-lg font-medium mb-3 mt-6">Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with our Service by collecting and reporting anonymized information. Analytics cookies are optional and can be disabled through your browser settings.</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Page view tracking (which pages are visited)</li>
                <li>Feature usage analytics (which features are used)</li>
                <li>Error tracking (to identify and fix bugs)</li>
                <li>Performance monitoring (to improve loading times)</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground italic">
                Note: We use PostHog for analytics, which is GDPR-compliant and respects Do Not Track signals. All analytics data is anonymized.
              </p>
            </section>

            <section id="cookie-table" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cookie Table</h2>
              <p className="mb-4">Below is a detailed table of cookies we use, organized by category:</p>
              
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-border rounded-lg">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="border border-border px-4 py-3 text-left font-semibold">Cookie Name</th>
                      <th className="border border-border px-4 py-3 text-left font-semibold">Category</th>
                      <th className="border border-border px-4 py-3 text-left font-semibold">Purpose</th>
                      <th className="border border-border px-4 py-3 text-left font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-3 font-mono text-sm">sb-*-auth-token</td>
                      <td className="border border-border px-4 py-3">Essential</td>
                      <td className="border border-border px-4 py-3">Authentication - keeps you logged in</td>
                      <td className="border border-border px-4 py-3">Session / 7 days</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="border border-border px-4 py-3 font-mono text-sm">ph_*</td>
                      <td className="border border-border px-4 py-3">Analytics</td>
                      <td className="border border-border px-4 py-3">PostHog analytics - tracks page views and feature usage</td>
                      <td className="border border-border px-4 py-3">Up to 2 years</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-3 font-mono text-sm">phc_*</td>
                      <td className="border border-border px-4 py-3">Analytics</td>
                      <td className="border border-border px-4 py-3">PostHog consent and session tracking</td>
                      <td className="border border-border px-4 py-3">Session</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="border border-border px-4 py-3 font-mono text-sm">Cookie preferences</td>
                      <td className="border border-border px-4 py-3">Essential</td>
                      <td className="border border-border px-4 py-3">Stores your cookie preference settings</td>
                      <td className="border border-border px-4 py-3">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Cookie names may vary based on the service provider (e.g., Supabase, PostHog). The "*" indicates variable characters that change per user or session. All cookies are set by solun.app or our authorized service providers.
              </p>
            </section>

            <section id="session-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Session Cookies</h2>
              <p>Session cookies are temporary cookies that are created when you visit our website and expire when you close your browser. These cookies are essential for:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Maintaining your login status during your browsing session</li>
                <li>Remembering your session state and preferences</li>
                <li>Ensuring secure access to your account</li>
                <li>Preventing unauthorized access to sensitive features</li>
              </ul>
              <p className="mt-4">Session cookies do not store personal information permanently and are automatically deleted when you close your browser. They are essential for the Service to function properly.</p>
            </section>

            <section id="analytics-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Analytics Cookies</h2>
              <p>Analytics cookies help us understand how users interact with our writing workspace. These cookies collect anonymous information about:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Pages visited and time spent on each page</li>
                <li>Features used and user interactions</li>
                <li>Device and browser information (anonymized)</li>
                <li>General location data (country/region level only)</li>
                <li>Error occurrences and performance metrics</li>
              </ul>
              <p className="mt-4">All analytics data is aggregated and anonymized. We use PostHog, a privacy-focused analytics platform that:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Is GDPR-compliant and respects Do Not Track signals</li>
                <li>Allows you to opt out of analytics tracking</li>
                <li>Does not track individual users across other websites</li>
                <li>Stores data securely with limited retention periods</li>
              </ul>
              <p className="mt-4">We use this information to:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Improve the user experience and interface design</li>
                <li>Identify and fix technical issues</li>
                <li>Optimize performance and loading times</li>
                <li>Understand which features are most valuable to users</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground italic">
                For more information about PostHog's privacy practices, see <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-phthalo hover:underline">PostHog's Privacy Policy</a>.
              </p>
            </section>

            <section id="third-party-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Third-Party Cookies</h2>
              <p>In some cases, we use third-party services that set their own cookies. These include:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li><strong>Supabase:</strong> For secure data storage and authentication (sets essential session and authentication cookies)</li>
                <li><strong>PostHog:</strong> For analytics and error tracking (sets analytics cookies when enabled)</li>
                <li><strong>Payment Processors:</strong> For secure payment processing when you subscribe (may set temporary cookies for transaction security)</li>
              </ul>
              <p className="mt-4">Third-party cookies are subject to the respective third party's privacy policy. We carefully select our service providers to ensure they meet our privacy and security standards:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Supabase: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-phthalo hover:underline">Privacy Policy</a></li>
                <li>PostHog: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-phthalo hover:underline">Privacy Policy</a></li>
              </ul>
            </section>

            <section id="managing-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. How to Manage Your Cookie Preferences</h2>
              <p>You have several options to manage cookies and control how they are used:</p>

              <h3 className="text-lg font-medium mb-3 mt-6">Browser Settings</h3>
              <p>You can control cookies through your browser settings. Most modern browsers allow you to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Block all cookies (may break essential functionality)</li>
                <li>Block third-party cookies (recommended for privacy)</li>
                <li>Delete existing cookies</li>
                <li>Clear cookies when you close your browser</li>
                <li>Receive notifications when cookies are set</li>
                <li>Manage cookies on a per-site basis</li>
              </ul>
              <p className="mb-4">To access cookie settings:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>Chrome/Edge:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Other browsers:</strong> Check your browser's help documentation</li>
              </ul>

              <h3 className="text-lg font-medium mb-3 mt-6">Essential vs. Analytics Cookies</h3>
              <p><strong>Essential Cookies:</strong> These cannot be disabled as they are required for basic service functionality (authentication, session management). Disabling essential cookies will prevent you from using the Service.</p>
              <p className="mt-4"><strong>Analytics Cookies:</strong> These are optional and can be disabled without affecting core features. You can disable analytics cookies through:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Your browser settings (block third-party cookies)</li>
                <li>Browser extensions that block tracking</li>
                <li>Do Not Track (DNT) browser setting (we respect DNT signals)</li>
                <li>Contacting us to request analytics opt-out</li>
              </ul>

              <h3 className="text-lg font-medium mb-3 mt-6">Opting Out of Analytics</h3>
              <p>To opt out of PostHog analytics specifically:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Enable Do Not Track in your browser settings</li>
                <li>Use a browser extension that blocks PostHog</li>
                <li>Contact us at <a href="mailto:privacy@solun.app" className="text-phthalo hover:underline">privacy@solun.app</a> to request opt-out</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground italic">
                Note: Disabling analytics cookies will not affect your ability to use the Service. You may still see basic error tracking for debugging purposes, but detailed analytics will be disabled.
              </p>
            </section>

            <section id="cookie-retention" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Cookie Retention Periods</h2>
              <p>Our cookie retention periods vary based on their purpose and category:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li><strong>Session Cookies:</strong> Deleted automatically when you close your browser</li>
                <li><strong>Essential Authentication Cookies:</strong> Typically expire after 7 days of inactivity or when you log out</li>
                <li><strong>Analytics Cookies:</strong> Retained for up to 2 years for trend analysis and service improvement</li>
                <li><strong>Preference Cookies:</strong> Retained for up to 1 year or until you change your preferences</li>
              </ul>
              <p className="mt-4">You can clear cookies at any time through your browser settings. However, clearing essential cookies may log you out and require you to sign in again.</p>
            </section>

            <section id="updates-policy" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Updates to This Policy</h2>
              <p>We may update this Cookies Policy from time to time to reflect changes in our practices, new cookie technologies, or for legal reasons. When we make changes, we will:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Update the "Last updated" date at the top of this page</li>
                <li>Notify users of material changes via email (if you have provided an email address)</li>
                <li>Post a notice on our website for significant changes</li>
              </ul>
              <p className="mt-4">We encourage you to review this policy periodically to stay informed about our cookie practices. Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>
            </section>

            <section id="contact-cookies" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>If you have any questions about our use of cookies or this Cookies Policy, please contact us:</p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:legal@solun.app" className="text-phthalo hover:underline">legal@solun.app</a><br />
                <strong>Privacy Inquiries:</strong> <a href="mailto:privacy@solun.app" className="text-phthalo hover:underline">privacy@solun.app</a><br />
                <strong>Address:</strong> [Company Address], Australia<br />
              </p>
              <p className="mt-4">
                For general inquiries, visit our <Link to="/contact" className="text-phthalo hover:underline">Contact page</Link> or our <Link to="/legal" className="text-phthalo hover:underline">Legal Center</Link>.
              </p>
            </section>

            <div className="mt-12 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This Cookies Policy was last updated on January 3, 2025. By continuing to use our service, you consent to our use of cookies as described in this policy. You can manage your cookie preferences at any time through your browser settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
