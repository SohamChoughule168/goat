import type { ReactNode } from "react";
import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import MobileCtaBar from "@/components/leads/mobile-cta-bar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="inst-main inst-page flex-1">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
