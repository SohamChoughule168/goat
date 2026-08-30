import SmoothScroll from "@/components/v6/smooth-scroll";
import Preloader from "@/components/v6/preloader";
import Nav from "@/components/v6/nav";
import Hero from "@/components/v6/hero";
import Manifesto from "@/components/v6/manifesto";
import CraftChapters from "@/components/v6/craft-chapters";
import AiLab from "@/components/v6/ai-lab";
import WorkStrip from "@/components/v6/work-strip";
import Testimonials from "@/components/v6/testimonials";
import Pricing from "@/components/v6/pricing";
import Team from "@/components/v6/team";
import ProcessLine from "@/components/v6/process-line";
import FooterCta from "@/components/v6/footer-cta";
import ForceDark from "@/components/v6/force-dark";

export default function HomePage() {
  return (
    <SmoothScroll>
      <ForceDark />
      <main id="main" className="relative" data-v6>
        <Preloader />
        <Nav />
        <Hero />
        <Manifesto />
        <CraftChapters />
        <AiLab />
        <WorkStrip />
        <Testimonials />
        <Pricing />
        <Team />
        <ProcessLine />
        <FooterCta />
      </main>
    </SmoothScroll>
  );
}