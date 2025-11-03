import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Solun</title>
        <meta name="description" content="Read Solun's terms of service and usage agreement. Learn about your rights and responsibilities when using our AI writing workspace." />
        <link rel="canonical" href="https://solun.app/terms" />
        <meta property="og:title" content="Terms of Service - Solun" />
        <meta property="og:description" content="Read Solun's terms of service and usage agreement." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/terms" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="section">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 3, 2025</p>
          <p className="text-sm text-muted-foreground mt-2">
            <Link to="/legal" className="text-phthalo hover:underline">← Back to Legal Center</Link>
          </p>
        </div>

        <nav className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#acceptance" className="text-muted-foreground hover:text-foreground transition-colors">1. Acceptance of Terms</a></li>
            <li><a href="#license-to-use" className="text-muted-foreground hover:text-foreground transition-colors">2. License to Use</a></li>
            <li><a href="#description" className="text-muted-foreground hover:text-foreground transition-colors">3. Service Description</a></li>
            <li><a href="#user-accounts" className="text-muted-foreground hover:text-foreground transition-colors">4. User Accounts</a></li>
            <li><a href="#acceptable-use" className="text-muted-foreground hover:text-foreground transition-colors">5. Acceptable Use</a></li>
            <li><a href="#intellectual-property" className="text-muted-foreground hover:text-foreground transition-colors">6. Intellectual Property and Ownership</a></li>
            <li><a href="#ai-features" className="text-muted-foreground hover:text-foreground transition-colors">7. AI Features and Disclaimers</a></li>
            <li><a href="#availability" className="text-muted-foreground hover:text-foreground transition-colors">8. Service Availability</a></li>
            <li><a href="#updates" className="text-muted-foreground hover:text-foreground transition-colors">9. Updates and Modifications</a></li>
            <li><a href="#termination" className="text-muted-foreground hover:text-foreground transition-colors">10. Termination</a></li>
            <li><a href="#disclaimers" className="text-muted-foreground hover:text-foreground transition-colors">11. Disclaimers</a></li>
            <li><a href="#limitation-liability" className="text-muted-foreground hover:text-foreground transition-colors">12. Limitation of Liability</a></li>
            <li><a href="#refunds" className="text-muted-foreground hover:text-foreground transition-colors">13. Refunds and Payments</a></li>
            <li><a href="#governing-law" className="text-muted-foreground hover:text-foreground transition-colors">14. Governing Law</a></li>
            <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">15. Contact Information</a></li>
          </ul>
        </nav>

        <div className="prose prose-slate max-w-none">
          <section id="acceptance" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Solun ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            <p>These Terms of Service ("Terms") constitute a legally binding agreement between you and Solun. By creating an account, accessing, or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
          </section>

          <section id="license-to-use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. License to Use</h2>
            <p><strong>Grant of License:</strong> Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal or commercial purposes in accordance with these Terms.</p>
            <p><strong>License Restrictions:</strong> You may not:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Copy, modify, or create derivative works of the Service</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Remove any proprietary notices or labels</li>
              <li>Rent, lease, loan, or sublicense the Service</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to the Service or its related systems</li>
            </ul>
            <p><strong>Termination of License:</strong> This license terminates automatically if you breach any of these Terms. We reserve the right to revoke your license at any time for any reason.</p>
          </section>

          <section id="description" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
            <p>Solun is an AI-powered writing workspace designed to help users create and manage written content. The Service includes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Web-based writing tools and document management</li>
              <li>AI-assisted content generation features</li>
              <li>Lore Vault for world-building and knowledge management</li>
              <li>Offline-first architecture with optional cloud synchronization</li>
              <li>Desktop application for Windows, macOS, and Linux</li>
            </ul>
            <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.</p>
          </section>

          <section id="user-accounts" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p>To access certain features of the Service, you must register for an account. You agree to:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use or security breach</li>
              <li>Ensure you are at least 13 years of age (or the age of majority in your jurisdiction) to use the Service</li>
            </ul>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </section>

          <section id="acceptable-use" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Violate any applicable local, state, national, or international laws or regulations</li>
              <li>Infringe upon or violate the intellectual property rights or privacy rights of others</li>
              <li>Transmit, upload, or distribute any content that is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene</li>
              <li>Distribute malware, viruses, or other harmful code</li>
              <li>Harass, abuse, or harm others, including other users of the Service</li>
              <li>Attempt to gain unauthorized access to our systems, networks, or user accounts</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Use automated systems (bots, scrapers, etc.) to access the Service without permission</li>
              <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity</li>
              <li>Collect or store personal data about other users without their express permission</li>
            </ul>
            <p>We reserve the right to investigate and take appropriate legal action against anyone who, in our sole discretion, violates this provision, including reporting such activity to law enforcement authorities.</p>
          </section>

          <section id="intellectual-property" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property and Ownership</h2>
            <p><strong>Service Ownership:</strong> The Service and its original content, features, and functionality are owned by Solun and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. All rights not expressly granted are reserved.</p>
            <p><strong>Your Content Ownership:</strong> Content you create using the Service (including text, documents, and other materials) remains your intellectual property. You retain all rights, title, and interest in and to your content.</p>
            <p><strong>License to Solun:</strong> By uploading, posting, or submitting content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute your content solely for the purpose of providing and improving the Service. This license terminates when you delete your content or close your account, except that we may retain copies as necessary to comply with legal obligations.</p>
            <p><strong>AI-Generated Content:</strong> Content generated or assisted by AI features may incorporate elements from training data and may not be entirely original. You acknowledge that AI-generated content may not be eligible for copyright protection in some jurisdictions.</p>
            <p><strong>User Content Representations:</strong> You represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>You own or have the necessary rights to use and license your content</li>
              <li>Your content does not infringe upon the rights of any third party</li>
              <li>Your content complies with all applicable laws and these Terms</li>
            </ul>
          </section>

          <section id="ai-features" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. AI Features and Disclaimers</h2>
            <p><strong>AI-Powered Features:</strong> The Service includes AI-powered features such as content generation, suggestions, and context-aware assistance. These features are provided "as is" and may not always be accurate, complete, or appropriate for your needs.</p>
            <p><strong>AI Limitations:</strong> You acknowledge and agree that:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>AI-generated content may contain errors, inaccuracies, or biases</li>
              <li>AI suggestions are not professional advice and should not be relied upon as such</li>
              <li>You are responsible for reviewing, editing, and verifying all AI-generated content</li>
              <li>AI features may not understand context, nuance, or your specific requirements</li>
              <li>We do not guarantee the accuracy, completeness, or quality of AI-generated content</li>
            </ul>
            <p><strong>No Liability for AI Content:</strong> We are not responsible for any decisions, actions, or consequences arising from your use of AI-generated content. You assume full responsibility for all content created using AI features.</p>
            <p><strong>AI Training Data:</strong> Our AI features are trained on publicly available data. We do not use your content to train AI models without your explicit consent, as detailed in our <Link to="/privacy" className="text-phthalo hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section id="availability" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Service Availability</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not guarantee that the Service will be:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Available at all times or without interruption</li>
              <li>Error-free, secure, or free from viruses or other harmful components</li>
              <li>Able to meet your specific requirements or expectations</li>
            </ul>
            <p>We may temporarily suspend or limit access to the Service for maintenance, updates, or other operational reasons. We will make reasonable efforts to provide advance notice of planned downtime, but are not obligated to do so.</p>
            <p>You are responsible for maintaining backups of your content. We are not responsible for any loss of data resulting from service interruptions, system failures, or other technical issues.</p>
          </section>

          <section id="updates" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Updates and Modifications</h2>
            <p><strong>Service Updates:</strong> We may, at any time, modify, update, or discontinue features of the Service. We reserve the right to add new features or remove existing features at our discretion.</p>
            <p><strong>Terms Updates:</strong> We may modify these Terms at any time. We will notify you of material changes by:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last updated" date at the top of this page</li>
              <li>Sending an email notification for material changes (if you have provided an email address)</li>
            </ul>
            <p><strong>Continued Use:</strong> Your continued use of the Service after changes to these Terms constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using the Service and may close your account.</p>
          </section>

          <section id="termination" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p><strong>Termination by You:</strong> You may terminate your account at any time by contacting us or using account deletion features (if available).</p>
            <p><strong>Termination by Us:</strong> We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Violation of these Terms or our policies</li>
              <li>Conduct that we believe is harmful to other users, us, or third parties</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Extended periods of inactivity</li>
              <li>Non-payment of fees (for paid subscriptions)</li>
            </ul>
            <p><strong>Effect of Termination:</strong> Upon termination, your right to use the Service immediately ceases. We may delete or suspend access to your account and content. You are responsible for backing up your content before termination.</p>
            <p><strong>Survival:</strong> Sections of these Terms that by their nature should survive termination will survive, including but not limited to intellectual property rights, disclaimers, limitations of liability, and governing law provisions.</p>
          </section>

          <section id="disclaimers" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Disclaimers</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Implied warranties or conditions of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of intellectual property or other violation of rights</li>
              <li>Accuracy, reliability, or completeness of the Service or any content</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security of data transmission or storage</li>
            </ul>
            <p>We do not warrant that the Service will meet your requirements, that the operation of the Service will be uninterrupted or error-free, or that defects in the Service will be corrected.</p>
          </section>

          <section id="limitation-liability" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, in no event shall Solun, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from your use or inability to use the Service</li>
              <li>Damages resulting from unauthorized access to or alteration of your content or data</li>
              <li>Damages resulting from conduct or content of third parties on the Service</li>
              <li>Business interruption or loss of business information</li>
            </ul>
            <p>Our total liability to you for all claims arising from or related to the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim, or one hundred dollars ($100), whichever is greater.</p>
            <p>Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you. In such cases, our liability will be limited to the maximum extent permitted by law.</p>
          </section>

          <section id="refunds" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Refunds and Payments</h2>
            <p><strong>Payments:</strong> If you purchase a subscription or other paid feature, you agree to pay the fees specified at the time of purchase. All fees are in the currency specified and are non-refundable except as required by law or as explicitly stated.</p>
            <p><strong>Subscription Terms:</strong> Subscriptions automatically renew unless you cancel before the renewal date. You authorize us to charge the applicable subscription fee to your payment method on each renewal date.</p>
            <p><strong>Refunds:</strong> All payments are final. We do not offer refunds for subscription fees or one-time purchases except:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>As required by applicable consumer protection laws</li>
              <li>In the event of a billing error (you must contact us within 30 days of the charge)</li>
              <li>As explicitly stated in a separate refund policy</li>
            </ul>
            <p><strong>Price Changes:</strong> We reserve the right to change our pricing at any time. We will provide at least 30 days' notice of price increases for existing subscriptions. Price changes will apply to subsequent billing periods.</p>
            <p><strong>Failed Payments:</strong> If payment fails, we may suspend or terminate your access to paid features. You are responsible for maintaining valid payment information.</p>
          </section>

          <section id="governing-law" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Governing Law</h2>
            <p>These Terms shall be interpreted and governed by the laws of Australia, without regard to conflict of law provisions.</p>
            <p><strong>Jurisdiction:</strong> Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of Australia. You consent to the personal jurisdiction of such courts.</p>
            <p><strong>Dispute Resolution:</strong> Before filing a claim, you agree to contact us at legal@solun.app to attempt to resolve the dispute informally. If we cannot resolve the dispute within 60 days, either party may proceed with formal proceedings.</p>
            <p><strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.</p>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <p className="mt-4">
              <strong>Email:</strong>{" "}
              <a href="mailto:legal@solun.app" className="text-phthalo hover:underline">
                legal@solun.app
              </a>
              <br />
              <strong>Address:</strong> [Company Address], Australia
            </p>
            <p className="mt-4">
              For general inquiries, visit our <Link to="/contact" className="text-phthalo hover:underline">Contact page</Link>.
            </p>
          </section>

          <div className="mt-12 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              These Terms were last updated on January 3, 2025. We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
