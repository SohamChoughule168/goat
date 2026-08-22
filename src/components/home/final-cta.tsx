"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Magnetic from "@/components/motion/magnetic";
import KineticHeading from "@/components/motion/kinetic-heading";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export default function FinalCta() {
  return (
    <section className="section-y relative overflow-hidden border-t border-border" data-chapter="final">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e0b64f]/10 blur-[110px]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden" aria-hidden="true">
        <div className="floor-grid absolute inset-0 opacity-40" />
      </div>
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <p data-reveal="fade" className="eyebrow mb-6">
          Chapter VI — Start the conversation
        </p>
        <KineticHeading
          text="Let's build something real."
          as="h2"
          className="display-1 max-w-4xl"
          accentWords={[2, 3]}
        />
        <div className="spectral-line mt-8" aria-hidden="true" />
        <p data-reveal="up" data-reveal-delay="100" className="lede mt-7 text-center">
          Tell us what you&apos;re trying to achieve. You&apos;ll get an honest assessment,
          a clear scope, and a reply within one business day.
        </p>
        <div
          data-reveal="up"
          data-reveal-delay="180"
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <Button asChild size="lg" className="btn-forge h-12 px-8 text-base">
              <Link href="/contact">
                Start a project
                <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
          </Magnetic>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              Message on WhatsApp
            </a>
          </Button>
        </div>
        <p
          data-reveal="fade"
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
        >
          {site.hours.days} · {site.hours.time}
        </p>
      </div>
    </section>
  );
}
