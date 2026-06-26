import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Hero } from "@/components/Hero";
import { BentoFeatures } from "@/components/BentoFeatures";
import { Pricing } from "@/components/Pricing";
import { SocialProof } from "@/components/SocialProof";
import { SignInModal } from "@/components/SignInModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mesh/AI — The AI-native data plane for automation at the edge" },
      {
        name: "description",
        content:
          "Mesh is an AI automation platform that ingests, reasons over, and routes your data with sub-100ms decisions. Multi-region SLA, lineage-grade audit, and a pricing matrix in USD, EUR and INR.",
      },
      {
        name: "keywords",
        content:
          "AI automation platform, data pipeline, LLM orchestration, edge AI, real-time inference",
      },
      { property: "og:title", content: "Mesh/AI — The AI-native data plane" },
      {
        property: "og:description",
        content:
          "Ingest, reason, and route your data with sub-100ms decisions. No orchestration code required.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mesh/AI" },
      {
        name: "twitter:description",
        content: "The AI-native data plane for automation at the edge.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Mesh/AI",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "19", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <>
      <span className="loader-bar" aria-hidden />
      <SiteHeader onSignInClick={() => setIsSignInOpen(true)} />
      <main>
        <Hero />
        <BentoFeatures />
        <Pricing />
        <SocialProof />
      </main>
      <SiteFooter />
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}
