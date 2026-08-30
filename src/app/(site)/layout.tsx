import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MotionProvider from "@/components/motion/motion-provider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
