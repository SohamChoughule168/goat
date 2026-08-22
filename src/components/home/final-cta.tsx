"use client";

import Link from "next/link";
import Magnetic from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export default function FinalCta() {
  return (
    <section className="section-y relative overflow-hidden border-t border-border">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden="true"
      />
      <div className="hairline-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="shell relative z-10 flex flex-col items-center text-center">
        <p data-reveal="fade" className="eyebrow mb-6">
          Start the conversation
        </p>
        <h2 data-reveal="up" className="display-1 max-w-4xl">
          Let&apos;s build something
          <span className="font-serif font-normal italic text-primary"> real.</span>
        </h2>
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
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/contact">Start a project</Link>
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
