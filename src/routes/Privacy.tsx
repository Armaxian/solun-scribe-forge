import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Solun</title>
        <meta name="description" content="Learn about how Solun protects your privacy and handles your data. Our offline-first approach ensures your writing stays private and secure." />
        <link rel="canonical" href="https://solun.app/privacy" />
        <meta property="og:title" content="Privacy Policy - Solun" />
        <meta property="og:description" content="Learn about how Solun protects your privacy and handles your data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/privacy" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="section">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: October 7, 2025</p>
        </div>

        <nav className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#introduction" className="text-muted-foreground hover:text-foreground transition-colors">1. Introduction</a></li>
            <li><a href="#information-collect" className="text-muted-foreground hover:text-foreground transition-colors">2. Information We Collect</a></li>
            <li><a href="#how-we-use" className="text-muted-foreground hover:text-foreground transition-colors">3. How We Use Your Information</a></li>
            <li><a href="#data-sharing" className="text-muted-foreground hover:text-foreground transition-colors">4. Data Sharing and Disclosure</a></li>
            <li><a href="#data-storage" className="text-muted-foreground hover:text-foreground transition-colors">5. Data Storage and Security</a></li>
            <li><a href="#data-retention" className="text-muted-foreground hover:text-foreground transition-colors">6. Data Retention</a></li>
            <li><a href="#your-rights" className="text-muted-foreground hover:text-foreground transition-colors">7. Your Rights</a></li>
            <li><a href="#cookies-analytics" className="text-muted-foreground hover:text-foreground transition-colors">8. Cookies and Analytics</a></li>
            <li><a href="#international-transfers" className="text-muted-foreground hover:text-foreground transition-colors">9. International Data Transfers</a></li>
            <li><a href="#childrens-privacy" className="text-muted-foreground hover:text-foreground transition-colors">10. Children's Privacy</a></li>
            <li><a href="#changes-policy" className="text-muted-foreground hover:text-foreground transition-colors">11. Changes to This Policy</a></li>
            <li><a href="#contact-privacy" className="text-muted-foreground hover:text-foreground transition-colors">12. Contact Us</a></li>
          </ul>
        </nav>

        <div className="prose prose-slate max-w-none">
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>At Solun, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered writing workspace service.</p>
            <p>We believe in transparency and giving you control over your data. Our offline-first approach ensures your writing content stays private and secure on your device whenever possible.</p>
          </section>

          <section id="information-collect" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium mb-3">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Email address (for account creation and communication)</li>
              <li>Name and profile information (optional)</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>

            <h3 className="text-lg font-medium mb-3">Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Service usage statistics and feature interactions</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP address and location data (anonymized)</li>
              <li>Session data and login timestamps</li>
            </ul>

            <h3 className="text-lg font-medium mb-3">Content Data</h3>
            <p>Your written content and documents created using our service. Content is stored locally on your device when possible, and optionally synchronized to our servers for cross-device access.</p>
          </section>

          <section id="how-we-use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Provide, maintain, and improve our writing workspace service</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Send service-related communications and updates</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section id="data-sharing" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our service (e.g., Supabase for data storage, payment processors)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to the sharing</li>
            </ul>
          </section>

          <section id="data-storage" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Storage and Security</h2>
            <p><strong>Data Storage:</strong> We use Supabase, a secure cloud database service, to store user account information and synchronized content. Supabase employs industry-standard encryption and security measures.</p>
            <p><strong>Security Measures:</strong> We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted data storage at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
            </ul>
          </section>

          <section id="data-retention" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Account Data:</strong> Retained for 7 years after account deactivation</li>
              <li><strong>Usage Analytics:</strong> Anonymized and aggregated data retained indefinitely for service improvement</li>
              <li><strong>Payment Information:</strong> Retained only as required for tax and accounting purposes</li>
              <li><strong>Content Data:</strong> Retained until you delete it or close your account</li>
            </ul>
            <p>You can request deletion of your account and associated data at any time.</p>
          </section>

          <section id="your-rights" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request transfer of your data in a structured format</li>
              <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            </ul>
            <p>To exercise these rights, please contact us at legal@solun.app.</p>
          </section>

          <section id="cookies-analytics" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Analytics</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience and analyze service usage. This includes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Essential Cookies:</strong> Required for basic service functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Session Cookies:</strong> Maintain your login status during your visit</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings or our cookie management tool. For more detailed information, see our <a href="/cookies" className="text-primary hover:underline">Cookies Policy</a>.</p>
          </section>

          <section id="international-transfers" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>
          </section>

          <section id="childrens-privacy" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>
          </section>

          <section id="changes-policy" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.</p>
          </section>

          <section id="contact-privacy" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <p className="mt-4">
              <strong>Email:</strong> legal@solun.app<br />
              <strong>Address:</strong> [Company Address], Australia<br />
              <strong>Data Protection Officer:</strong> privacy@solun.app
            </p>
          </section>

          <div className="mt-12 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy was last updated on October 7, 2025. By continuing to use our service, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
