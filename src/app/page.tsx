import Hero from "@/components/home/hero";
import ProofStrip from "@/components/home/proof-strip";
import SelectedWork from "@/components/home/selected-work";
import PracticeAreas from "@/components/home/practice-areas";
import WideStatement from "@/components/home/wide-statement";
import MechanismStrip from "@/components/home/mechanism-strip";
import Commitments from "@/components/home/commitments";
import FinalCta from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <SelectedWork />
      <PracticeAreas />
      <WideStatement />
      <MechanismStrip />
      <Commitments />
      <FinalCta />
    </>
  );
}
