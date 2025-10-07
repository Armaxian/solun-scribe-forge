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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground">Privacy policy content coming soon.</p>
        </div>
      </div>
    </div>
    </>
  );
}
