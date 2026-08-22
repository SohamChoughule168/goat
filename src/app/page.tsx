import Hero from "@/components/home/hero";
import ProofStrip from "@/components/home/proof-strip";
import Manifesto from "@/components/home/manifesto";
import CapabilityConstellation from "@/components/home/constellation";
import SelectedWork from "@/components/home/selected-work";
import Process from "@/components/home/process";
import MetricsBand from "@/components/home/metrics-band";
import Differentiator from "@/components/home/differentiator";
import InsightsPreview from "@/components/home/insights-preview";
import FinalCta from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Manifesto />
      <CapabilityConstellation />
      <SelectedWork />
      <Process />
      <MetricsBand />
      <Differentiator />
      <InsightsPreview />
      <FinalCta />
    </>
  );
}
