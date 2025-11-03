import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FileText, Shield, Cookie, Lock, Database, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const legalDocuments = [
  {
    title: "Terms of Service",
    description: "Our terms of service covering license to use, acceptable use, intellectual property, AI features disclaimers, and more.",
    href: "/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data. Information about data retention, your rights, and our security practices.",
    href: "/privacy",
    icon: Shield,
  },
  {
    title: "Cookies Policy",
    description: "Details about how we use cookies, including categories, cookie table, and how to manage your preferences.",
    href: "/cookies",
    icon: Cookie,
  },
  {
    title: "Security & Disclosure",
    description: "Information about our security practices, vulnerability disclosure policy, and data protection measures.",
    href: "/legal#security",
    icon: Lock,
  },
  {
    title: "Data Requests",
    description: "How to request access to your data, request data deletion, or exercise your data subject rights.",
    href: "/legal#data-requests",
    icon: Database,
  },
];

export default function Legal() {
  return (
    <>
      <Helmet>
        <title>Legal Center - Solun</title>
        <meta
          name="description"
          content="Access all legal documents including Terms of Service, Privacy Policy, Cookies Policy, and information about security and data requests."
        />
        <link rel="canonical" href="https://solun.app/legal" />
        <meta property="og:title" content="Legal Center - Solun" />
        <meta property="og:description" content="Access all legal documents and policies for Solun." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solun.app/legal" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="section">
        <div className="container max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Legal Center</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All legal documents, policies, and information in one place. Stay informed about your rights and our responsibilities.
            </p>
          </div>

          {/* Legal Documents Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {legalDocuments.map((doc) => {
              const Icon = doc.icon;
              return (
                <Link
                  key={doc.href}
                  to={doc.href}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                >
                  <Card className="h-full card-hover border-border/50 transition-all group-hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 rounded-lg bg-phthalo/10 group-hover:bg-phthalo/20 transition-colors">
                          <Icon className="h-6 w-6 text-phthalo" aria-hidden="true" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-phthalo group-hover:translate-x-1 transition-all" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl mb-2">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {doc.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Security & Disclosure Section */}
          <section id="security" className="mb-12">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-phthalo/10">
                    <Lock className="h-5 w-5 text-phthalo" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Security & Disclosure</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground mb-4">
                  We take security seriously and are committed to protecting your data and privacy.
                </p>
                <h3 className="text-lg font-semibold mb-2">Security Practices</h3>
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                  <li>End-to-end encryption for data in transit</li>
                  <li>Encryption at rest for stored data</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Secure authentication and access controls</li>
                  <li>Compliance with industry-standard security practices</li>
                </ul>
                <h3 className="text-lg font-semibold mb-2">Vulnerability Disclosure</h3>
                <p className="text-muted-foreground mb-4">
                  If you discover a security vulnerability, please report it responsibly to{" "}
                  <a href="mailto:security@solun.app" className="text-phthalo hover:underline">
                    security@solun.app
                  </a>
                  . We appreciate responsible disclosure and will work with you to address any issues promptly.
                </p>
                <p className="text-sm text-muted-foreground">
                  For more detailed information about our security practices, please see our{" "}
                  <Link to="/privacy#data-storage" className="text-phthalo hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Data Requests Section */}
          <section id="data-requests" className="mb-12">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-phthalo/10">
                    <Database className="h-5 w-5 text-phthalo" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Data Requests</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-muted-foreground mb-4">
                  You have the right to access, modify, or delete your personal data at any time.
                </p>
                <h3 className="text-lg font-semibold mb-2">Your Data Rights</h3>
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                  <li><strong>Access:</strong> Request a copy of all personal data we hold about you</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                  <li><strong>Restriction:</strong> Request limitation of data processing in certain circumstances</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                </ul>
                <h3 className="text-lg font-semibold mb-2">How to Submit a Request</h3>
                <p className="text-muted-foreground mb-2">
                  To exercise any of these rights, please contact us at:
                </p>
                <p className="mb-4">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@solun.app" className="text-phthalo hover:underline">
                    privacy@solun.app
                  </a>
                  <br />
                  <strong>Subject Line:</strong> Data Request - [Your Request Type]
                </p>
                <p className="text-sm text-muted-foreground">
                  We will respond to your request within 30 days as required by applicable data protection laws. For more information about your rights, please see our{" "}
                  <Link to="/privacy#your-rights" className="text-phthalo hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Quick Links */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Need help? Contact us at{" "}
              <a href="mailto:legal@solun.app" className="text-phthalo hover:underline font-medium">
                legal@solun.app
              </a>{" "}
              or visit our{" "}
              <Link to="/contact" className="text-phthalo hover:underline font-medium">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

