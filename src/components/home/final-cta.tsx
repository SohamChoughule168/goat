"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { site } from "@/content/site";
import { useGlobalScrollProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor, useAdaptiveQuality } from "@/components/v6/performance-optimizer";

export function FooterCTA() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hero3DHovered, setHero3DHovered] = useState(false);

  const globalProgress = useGlobalScrollProgress();
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const intensity = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;

  // Mouse tracking for 3D parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Dynamic import for the 3D scene
  const FooterCTAScene3D = dynamic(
    () => import("@/components/canvas/scenes/FooterCTAScene").then(m => m.FooterCTAScene),
    { ssr: false, loading: () => null }
  );

  return (
    <section id="footer-cta" className="section-y border-t border-border relative" aria-label="Start a project">
      {/* 3D Background Scene */}
      <div className="hero-3d-canvas absolute inset-0 z-0 pointer-events-none">
        <FooterCTAScene3D
          scrollProgress={globalProgress}
          mousePos={mousePos}
          hovered={hero3DHovered}
          intensity={intensity}
        />
      </div>

      <div className="shell relative z-10">
        <p className="micro">Next step</p>
        <h2 className="display-2 mt-4 max-w-[22ch]">
          Tell us what you&rsquo;re building. We&rsquo;ll tell you what it takes.
        </h2>
        <p className="lede mt-5 text-sm">
          An honest assessment, a clear scope, and a reply within one business day.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Start a project
          </Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export default FooterCTA;
