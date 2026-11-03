"use client";

import Link from "next/link";
import ScrollImageReveal from "@/components/media/scroll-image-reveal";

interface AppleFeature {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
  badge: string;
}

const APPLE_FEATURES: AppleFeature[] = [
  {
    title: "Digital Presence",
    subtitle: "Websites that perform",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    href: "/services/web-development/",
    badge: "01",
  },
  {
    title: "Admissions System",
    subtitle: "Track every enquiry",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping blank sheets",
    href: "/services/ai-driven-websites/",
    badge: "02",
  },
  {
    title: "Student Portal",
    subtitle: "One place for learners",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
    href: "/services/digital-marketing/",
    badge: "03",
  },
];

/**
 * Apple Showcase — sticky image on scroll with scaling text cards.
 * Pure CSS position: sticky + transform — no WebGL.
 */
export default function AppleShowcase() {
  return (
    <section className="inst-section apple-section" aria-labelledby="home-apple">
      <div className="inst-shell apple-inner">
        <div className="apple-copy">
          <p className="inst-label apple-label-reveal">Three modules</p>
          <h2 className="inst-display-xl apple-headline-reveal max-w-[40ch]">
            One accountable<br />
            <span className="inst-serif">team.</span>
          </h2>
          <p className="inst-body mt-5 apple-lede-reveal max-w-[42ch] text-[var(--ink-2)]">
            Digital presence, admissions system and student portal — built as one
            connected system, not three separate vendors.
          </p>
        </div>

        <div className="apple-sticky-wrap">
          <div className="apple-sticky">
            {APPLE_FEATURES.map((feature, index) => (
              <article key={feature.title} className="apple-card">
                <Link href={feature.href} className="apple-link">
                  <div className="apple-image-wrap">
                    <ScrollImageReveal
                      src={feature.image}
                      alt={feature.imageAlt}
                      width={500}
                      height={375}
                      revealDelay={index * 0.1}
                      className="apple-image"
                    />
                    <span className="apple-badge">{feature.badge}</span>
                  </div>
                  <div className="apple-content">
                    <h3 className="apple-title">{feature.title}</h3>
                    <p className="apple-subtitle">{feature.subtitle}</p>
                    <span className="apple-arrow">→</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
