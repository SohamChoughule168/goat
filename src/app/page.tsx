import Hero from "@/components/home/hero";
import ProofStrip from "@/components/home/proof-strip";
import OfferingSplit from "@/components/home/offering-split";
import WideStatement from "@/components/home/wide-statement";
import MechanismStrip from "@/components/home/mechanism-strip";
import SelectedWork from "@/components/home/selected-work";
import InsightsPreview from "@/components/home/insights-preview";
import FinalCta from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <OfferingSplit />
      <WideStatement />
      <MechanismStrip />
      <SelectedWork />
      <InsightsPreview />
      <FinalCta />
    </>
  );
}
