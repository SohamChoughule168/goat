import type { ReactNode } from "react";
import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import MobileCtaBar from "@/components/leads/mobile-cta-bar";
import RevealController from "@/components/motion/reveal-controller";

// Client-only: animates [data-reveal] elements on interior pages via the shared
// gsap/ScrollTrigger controller. Respects prefers-reduced-motion.

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="inst-main inst-page flex-1">
        {children}
        <RevealController />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
