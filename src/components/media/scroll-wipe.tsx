"use client";

import Link from "next/link";
import ScrollImageReveal from "@/components/media/scroll-image-reveal";

interface WipeCard {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  body: string;
  href: string;
  direction: "left" | "right" | "up" | "down";
  delay: number;
}

const WIPE_CARDS: WipeCard[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 900,
    height: 675,
    title: "Brand",
    body: "Identity, voice and rules that hold across every branch.",
    href: "/services/brand-management/",
    direction: "left",
    delay: 0,
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    alt: "Overlapping blank sheets",
    width: 900,
    height: 675,
    title: "Website",
    body: "The public front door, connected to the systems behind it.",
    href: "/services/web-development/",
    direction: "right",
    delay: 0.15,
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 900,
    height: 675,
    title: "Admissions",
    body: "Enquiry capture, follow-up and conversion in one path.",
    href: "/services/ai-driven-websites/",
    direction: "left",
    delay: 0.3,
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    alt: "Paper sheets in warm afternoon light",
    width: 900,
    height: 675,
    title: "Records",
    body: "Attendance, documents and communication on one file.",
    href: "/services/digital-marketing/",
    direction: "right",
    delay: 0.45,
  },
];

/**
 * Scroll Wipe — images wipe in from different directions as you scroll.
 * Each card uses clip-path animation for a premium reveal effect.
 * Pure CSS — no canvas, no WebGL.
 */
export default function ScrollWipe() {
  return (
    <section className="inst-section-tight wipe-section" aria-labelledby="home-wipe">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label wipe-label-reveal">The four surfaces</p>
            <h2 className="inst-h2 mt-5 wipe-headline-reveal max-w-[34ch]">
              Wiped in as you<br />
              <span className="inst-serif">scroll down.</span>
            </h2>
          </div>
        </div>

        <div className="wipe-grid">
          {WIPE_CARDS.map((card, index) => (
            <article key={card.title} className={`wipe-card wipe-card-${card.direction}`}>
              <div className="wipe-image-wrap">
                <ScrollImageReveal
                  src={card.src}
                  alt={card.alt}
                  width={card.width}
                  height={card.height}
                  revealDelay={card.delay}
                  className="wipe-image"
                />
                <div className="wipe-shine" />
              </div>
              <div className="wipe-content">
                <span className="wipe-index">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="wipe-title">{card.title}</h3>
                <p className="wipe-body">{card.body}</p>
                <Link href={card.href} className="wipe-link">
                  Open
                  <span className="wipe-arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
