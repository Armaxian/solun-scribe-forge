import { Helmet } from "react-helmet-async";

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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground">Terms of service content coming soon.</p>
        </div>
      </div>
    </div>
    </>
  );
}
