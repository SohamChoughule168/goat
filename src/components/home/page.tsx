"use client";

/**
 * HOME PAGE - $100M Tier Architecture
 * 
 * Layout flow:
 * 1. Preloader (cinematic opening)
 * 2. Nav (sticky, auto-hide)
 * 3. Hero (DOM text + 3D monolith in persistent canvas)
 * 4. Manifesto (text reveal with liquid metal 3D)
 * 5. CraftChapters (DOM list + 3D primitives)
 * 6. AILab (DOM content + 3D neural network)
 * 7. WorkStrip (filterable cards with hover distortion)
 * 8. Testimonials (carousel with 3D tilt)
 * 9. Pricing (floating cards)
 * 10. Team (photo orbs)
 * 11. ProcessLine (timeline with 3D scrubber)
 * 12. FooterCTA (eclipse scene)
 * 
 * Key principle: Each DOM section hosts a 3D scene via <SectionView>.
 * The persistent canvas (mounted in layout) renders all of them.
 * Tunnel-rat keeps DOM scroll ↔ 3D camera in sync.
 */

import SmoothScroll from "@/components/v6/smooth-scroll";
import Preloader from "@/components/v6/preloader";
import Nav from "@/components/v6/nav";
import ForceDark from "@/components/v6/force-dark";
import { Hero } from "./hero";
import { Manifesto } from "./manifesto";
import { CraftChapters } from "./craft-chapters";
import { AILab } from "./ai-lab";
import { WorkStrip } from "./work-strip";
import { Testimonials } from "./testimonials";
import { Pricing } from "./pricing";
import { Team } from "./team";
import { ProcessLine } from "./process-line";
import { FooterCTA } from "./final-cta";

export default function HomePage() {
  return (
    <SmoothScroll>
      <ForceDark />
      <main id="main" className="relative" data-v6>
        <Preloader />
        <Nav />

        {/* === P0 Critical 3D Sections === */}
        <Hero />
        <Manifesto />
        <CraftChapters />
        <AILab />

        {/* === P1 Important 3D Sections === */}
        <WorkStrip />
        <Testimonials />
        <Team />
        <FooterCTA />

        {/* === P2 Polish 3D Sections === */}
        <Pricing />
        <ProcessLine />
      </main>
    </SmoothScroll>
  );
}
