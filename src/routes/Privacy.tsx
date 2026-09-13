import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

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
          <p className="text-muted-foreground">Last updated: January 3, 2025</p>
          <p className="text-sm text-muted-foreground mt-2">
            <Link to="/legal" className="text-phthalo hover:underline">← Back to Legal Center</Link>
          </p>
        </div>

        <nav className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
            <li><a href="#introduction" className="text-muted-foreground hover:text-foreground transition-colors">1. Introduction</a></li>
            <li><a href="#information-collect" className="text-muted-foreground hover:text-foreground transition-colors">2. Information We Collect</a></li>
            <li><a href="#lawful-basis" className="text-muted-foreground hover:text-foreground transition-colors">3. Lawful Basis for Processing</a></li>
            <li><a href="#how-we-use" className="text-muted-foreground hover:text-foreground transition-colors">4. How We Use Your Information</a></li>
            <li><a href="#data-sharing" className="text-muted-foreground hover:text-foreground transition-colors">5. Data Sharing and Disclosure</a></li>
            <li><a href="#data-storage" className="text-muted-foreground hover:text-foreground transition-colors">6. Data Storage and Security</a></li>
            <li><a href="#data-retention" className="text-muted-foreground hover:text-foreground transition-colors">7. Data Retention</a></li>
            <li><a href="#your-rights" className="text-muted-foreground hover:text-foreground transition-colors">8. Your Rights</a></li>
            <li><a href="#cookies-analytics" className="text-muted-foreground hover:text-foreground transition-colors">9. Cookies and Analytics</a></li>
            <li><a href="#data-location" className="text-muted-foreground hover:text-foreground transition-colors">10. Data Location and International Transfers</a></li>
            <li><a href="#childrens-privacy" className="text-muted-foreground hover:text-foreground transition-colors">11. Children's Privacy</a></li>
            <li><a href="#changes-policy" className="text-muted-foreground hover:text-foreground transition-colors">12. Changes to This Policy</a></li>
            <li><a href="#contact-privacy" className="text-muted-foreground hover:text-foreground transition-colors">13. Contact Us</a></li>
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
            <p>We collect information that you provide directly to us and information that is automatically collected when you use our Service.</p>
            
            <h3 className="text-lg font-medium mb-3 mt-6">Account Information</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Email address:</strong> Required for account creation, authentication, and communication</li>
              <li><strong>Name:</strong> Optional profile information you choose to provide</li>
              <li><strong>Password:</strong> Securely hashed and stored for authentication (we cannot see your actual password)</li>
              <li><strong>Account preferences:</strong> Settings and preferences you configure in the Service</li>
            </ul>

            <h3 className="text-lg font-medium mb-3">Telemetry and Usage Data</h3>
            <p className="mb-2">We collect limited telemetry data to improve the Service:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Service usage statistics:</strong> Feature usage, interactions, and performance metrics (anonymized)</li>
              <li><strong>Device information:</strong> Browser type, operating system, device type (for compatibility and optimization)</li>
              <li><strong>IP address:</strong> Anonymized and used for security and geographic analytics</li>
              <li><strong>Session data:</strong> Login timestamps, session duration (for security monitoring)</li>
              <li><strong>Error logs:</strong> Technical error information to diagnose and fix issues</li>
            </ul>
            <p className="text-sm text-muted-foreground italic">
              Note: Our local-first architecture means all your content remains on your device and is not transmitted to our servers except when you explicitly use AI assistance features.
            </p>

            <h3 className="text-lg font-medium mb-3">Content Data</h3>
            <p>Your written content and documents created using our desktop application:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Local storage:</strong> All manuscripts and lore are stored locally on your device in a local database</li>
              <li><strong>No automatic cloud sync:</strong> Cloud synchronization is currently disabled. Your writing does not automatically upload to our servers</li>
              <li><strong>AI context sharing:</strong> When you use AI writing assistance, your request and relevant manuscript and lore context are sent to our servers and AI provider</li>
              <li>We do not access, read, or analyze your manuscripts except for selected context during AI requests you initiate</li>
            </ul>

            <h3 className="text-lg font-medium mb-3 mt-6">AI Writing Assistant Data</h3>
            <p>When you use the AI writing assistance feature (requires subscription):</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>What is sent:</strong> Selected manuscript text, chosen Lore Vault entries, and your user ID</li>
              <li><strong>Where it goes:</strong> Data is transmitted to our Supabase Edge Functions, then forwarded to our AI provider for processing</li>
              <li><strong>AI provider:</strong> We use third-party AI services that process your requests according to their privacy policies</li>
              <li><strong>What we store:</strong> Usage metadata (request timestamps, token counts) for billing and abuse prevention—not your manuscript content</li>
              <li><strong>What is NOT sent:</strong> Local backups and version history are not automatically uploaded</li>
              <li><strong>Response handling:</strong> AI-generated suggestions are returned to your device where you review and choose whether to accept them</li>
            </ul>
            <p className="text-sm text-muted-foreground italic mt-2">
              Important: AI assistance requires an internet connection and active subscription. Your manuscripts remain on your device; the context included with your request is transmitted.
            </p>

            <h3 className="text-lg font-medium mb-3">Payment Information</h3>
            <p>Payment information is processed securely through third-party payment processors. We do not store full credit card numbers or sensitive payment data on our servers.</p>
          </section>

          <section id="lawful-basis" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Lawful Basis for Processing</h2>
            <p>We process your personal data based on the following lawful bases:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Contractual Necessity:</strong> To provide the Service and fulfill our contract with you (account creation, authentication, billing, and AI access)</li>
              <li><strong>Legitimate Interests:</strong> To improve the Service, ensure security, prevent fraud, and analyze usage patterns (telemetry, analytics)</li>
              <li><strong>Consent:</strong> Where you have provided explicit consent (newsletter subscriptions, optional features)</li>
              <li><strong>Legal Obligations:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          <section id="how-we-use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Provide, maintain, and improve our writing workspace service</li>
              <li>Authenticate users and manage accounts</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Send service-related communications and updates (transactional emails)</li>
              <li>Analyze anonymized usage patterns to enhance user experience and fix bugs</li>
              <li>Ensure security, prevent fraud, and detect unauthorized access</li>
              <li>Comply with legal obligations and respond to legal requests</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
            <p className="mt-4">We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
          </section>

          <section id="data-sharing" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our service (e.g., Supabase for data storage, payment processors)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to the sharing</li>
            </ul>
          </section>

          <section id="data-storage" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Storage and Security</h2>
            <p><strong>Data Storage:</strong> We use Supabase to store account, subscription, entitlement, and AI usage information. Manuscripts and Lore Vault content remain in the local desktop database.</p>
            <p><strong>Security Practices:</strong> We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Encryption in transit:</strong> SSL/TLS encryption for all data transmission between your device and our servers</li>
              <li><strong>Encryption at rest:</strong> All stored data is encrypted using industry-standard encryption algorithms</li>
              <li><strong>Access controls:</strong> Strict access controls and authentication requirements for our team members</li>
              <li><strong>Least-privilege access:</strong> Server-side billing and usage operations are separated from browser access</li>
              <li><strong>Secure authentication:</strong> Passwords are hashed using secure algorithms (we never store plaintext passwords)</li>
              <li><strong>Backup and disaster recovery:</strong> Regular backups with secure storage and recovery procedures</li>
            </ul>
            <p className="mt-4"><strong>Incident Response:</strong> In the event of a security breach, we will notify affected users and relevant authorities as required by applicable data protection laws.</p>
          </section>

          <section id="data-retention" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
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
            <h2 className="text-2xl font-semibold mb-4">8. Data Subject Rights</h2>
            <p>You have the following rights regarding your personal data (subject to applicable data protection laws):</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Right of Access:</strong> Request a copy of your personal data we hold (see <Link to="/legal#data-requests" className="text-phthalo hover:underline">Data Requests</Link>)</li>
              <li><strong>Right of Rectification:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right of Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data in a structured, machine-readable format</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of processing in certain circumstances</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              <li><strong>Right to Lodge a Complaint:</strong> Lodge a complaint with a supervisory authority if you believe your rights have been violated</li>
            </ul>
            <p className="mt-4"><strong>Exercising Your Rights:</strong> To exercise any of these rights, please contact us at <a href="mailto:privacy@solun.app" className="text-phthalo hover:underline">privacy@solun.app</a>. We will respond to your request within 30 days as required by applicable data protection laws.</p>
            <p className="mt-4">For more information about submitting data requests, see our <Link to="/legal#data-requests" className="text-phthalo hover:underline">Legal Center</Link>.</p>
          </section>

          <section id="cookies-analytics" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies and Analytics</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience and analyze service usage. For detailed information about our cookie usage, see our <Link to="/cookies" className="text-phthalo hover:underline">Cookies Policy</Link>.</p>
            
            <h3 className="text-lg font-medium mb-3 mt-4">Analytics (PostHog)</h3>
            <p>We use PostHog, a privacy-focused analytics platform, to understand how users interact with our Service. PostHog:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Is <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-phthalo hover:underline">GDPR compliant</a> and processes data in accordance with applicable data protection laws</li>
              <li>Collects anonymized usage data (page views, feature usage, errors) to help us improve the Service</li>
              <li>Does not collect personally identifiable information unless you are logged in (and even then, data is anonymized)</li>
              <li>Allows us to respect Do Not Track signals and provides options to disable analytics</li>
              <li>Stores data in secure, encrypted databases with limited retention periods</li>
            </ul>
            <p className="mt-4">You can opt out of analytics tracking through your browser settings or by contacting us. Disabling analytics will not affect core Service functionality.</p>
            
            <h3 className="text-lg font-medium mb-3 mt-4">Cookie Categories</h3>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Essential Cookies:</strong> Required for basic service functionality (authentication, session management)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our service (PostHog analytics)</li>
              <li><strong>Session Cookies:</strong> Maintain your login status during your visit (temporary, deleted when browser closes)</li>
            </ul>
            <p className="mt-4">You can manage cookie preferences through your browser settings. For more detailed information, see our <Link to="/cookies" className="text-phthalo hover:underline">Cookies Policy</Link>.</p>
          </section>

          <section id="data-location" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Data Location and International Transfers</h2>
            <p><strong>Data Location:</strong> Your data is primarily stored and processed in the following regions:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Account, billing, and usage data:</strong> Supabase servers in the configured project region</li>
              <li><strong>Analytics data:</strong> PostHog servers (US/EU, with GDPR compliance measures)</li>
              <li><strong>Content (desktop app):</strong> Stored locally on your device by default</li>
            </ul>
            <p className="mt-4"><strong>International Transfers:</strong> Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws (including GDPR, CCPA, and Australian Privacy Act) and implement appropriate safeguards, including:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Standard Contractual Clauses (SCCs) for data transfers outside the EEA</li>
              <li>Data processing agreements with service providers</li>
              <li>Compliance with applicable data protection frameworks</li>
              <li>Regular assessments of data transfer mechanisms</li>
            </ul>
            <p className="mt-4">If you are located in the European Economic Area (EEA), UK, or other regions with strict data protection laws, we take additional measures to protect your data in accordance with applicable regulations.</p>
          </section>

          <section id="childrens-privacy" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
            <p>Our service is not intended for children under 13 years of age (or the age of majority in your jurisdiction, if higher). We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take immediate steps to delete such information.</p>
            <p className="mt-4">If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:privacy@solun.app" className="text-phthalo hover:underline">privacy@solun.app</a>.</p>
          </section>

          <section id="changes-policy" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.</p>
          </section>

          <section id="contact-privacy" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <p className="mt-4">
              <strong>Privacy Inquiries:</strong> <a href="mailto:privacy@solun.app" className="text-phthalo hover:underline">privacy@solun.app</a><br />
              <strong>General Legal:</strong> <a href="mailto:legal@solun.app" className="text-phthalo hover:underline">legal@solun.app</a><br />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Note: Company address information will be provided upon official business registration.
            </p>
            <p className="mt-4">
              For data requests, see our <Link to="/legal#data-requests" className="text-phthalo hover:underline">Data Requests section</Link> in the Legal Center.
            </p>
          </section>

          <div className="mt-12 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy was last updated on January 3, 2025. By continuing to use our service, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
