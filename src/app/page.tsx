import type { Metadata } from "next";
import Hero from "@/components/home/hero";
import ProofStrip from "@/components/home/proof-strip";
import Manifesto from "@/components/home/manifesto";
import Pillars from "@/components/home/pillars";
import SelectedWork from "@/components/home/selected-work";
import Process from "@/components/home/process";
import MetricsBand from "@/components/home/metrics-band";
import Differentiator from "@/components/home/differentiator";
import InsightsPreview from "@/components/home/insights-preview";
import FinalCta from "@/components/home/final-cta";
import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Manifesto />
      <Pillars />
      <SelectedWork />
      <Process />
      <MetricsBand />
      <Differentiator />
      <InsightsPreview />
      <FinalCta />
    </>
  );
}
