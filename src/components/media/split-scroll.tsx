"use client";

import Link from "next/link";
import ScrollImageReveal from "@/components/media/scroll-image-reveal";

interface SplitCard {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  body: string;
  href: string;
}

const SPLIT_CARDS: SplitCard[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 600,
    height: 450,
    title: "Digital Presence",
    body: "Fast, accessible public sites built for coaching institutes.",
    href: "/services/web-development/",
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 600,
    height: 450,
    title: "Admissions System",
    body: "A single pipeline with source tagging and reporting.",
    href: "/services/ai-driven-websites/",
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    alt: "Quiet room at dusk",
    width: 600,
    height: 450,
    title: "Student Portal",
    body: "Role-based access for students, parents and staff.",
    href: "/services/digital-marketing/",
  },
];

/**
 * Split Scroll — left column scrolls normally, right column pins with
 * images revealing as you scroll past each card.
 * Pure CSS position: sticky — no WebGL.
 */
export default function SplitScroll() {
  return (
    <section className="inst-section-tight split-section" aria-labelledby="home-split-scroll">
      <div className="inst-shell split-inner">
        <div className="split-copy">
          <p className="inst-label split-label-reveal">Three modules</p>
          <h2 className="inst-h2 mt-5 split-headline-reveal max-w-[34ch]">
            Scroll to see<br />
            <span className="inst-serif">each module.</span>
          </h2>
        </div>

        <div className="split-wrap">
          <div className="split-scroll">
            {SPLIT_CARDS.map((card, index) => (
              <article key={card.title} className="split-card">
                <ScrollImageReveal
                  src={card.src}
                  alt={card.alt}
                  width={card.width}
                  height={card.height}
                  revealDelay={index * 0.1}
                  className="split-image"
                />
                <div className="split-content">
                  <span className="split-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="split-title">{card.title}</h3>
                  <p className="split-body">{card.body}</p>
                  <Link href={card.href} className="split-link">
                    Learn more
                    <span className="split-arrow">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="split-pin">
            {SPLIT_CARDS.map((card, index) => (
              <div
                key={card.title}
                className={`split-pin-card ${index === 0 ? "split-active" : ""}`}
                style={{
                  backgroundImage: `url(${card.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "24px",
                  border: "1px solid var(--rule)",
                  boxShadow: "0 40px 100px rgba(17, 18, 15, 0.08)",
                  transition: "opacity 0.5s var(--ease-state), transform 0.5s var(--ease-state)",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
