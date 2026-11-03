"use client";

import ScrollImageReveal from "@/components/media/scroll-image-reveal";

interface RevealCard {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  delay: number;
}

const REVEAL_CARDS: RevealCard[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 700,
    height: 525,
    title: "Bone",
    subtitle: "Paper, identity, governance.",
    delay: 0,
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    alt: "Overlapping blank sheets",
    width: 600,
    height: 450,
    title: "Website",
    subtitle: "Public front door, connected.",
    delay: 0.15,
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 750,
    height: 560,
    title: "Ink",
    subtitle: "Admission, seat, batch in one move.",
    delay: 0.3,
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    alt: "Paper sheets in warm afternoon light",
    width: 650,
    height: 480,
    title: "Record",
    subtitle: "Attendance, documents, one file.",
    delay: 0.45,
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    alt: "Quiet room at dusk",
    width: 550,
    height: 410,
    title: "Handover",
    subtitle: "Accounts, code, runbook leave with you.",
    delay: 0.6,
  },
];

/**
 * Scroll Reveal Grid — staggered clip-path image reveals with captions.
 * Pure CSS — no canvas, no WebGL, no 3D objects.
 */
export default function ScrollRevealGrid() {
  return (
    <section className="inst-section-tight reveal-section" aria-labelledby="home-reveal-grid">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label">The five surfaces</p>
            <h2 className="inst-h2 mt-5 max-w-[30ch]">
              Revealed as you<br />
              <span className="inst-serif">scroll down.</span>
            </h2>
          </div>
        </div>

        <div className="reveal-grid">
          {REVEAL_CARDS.map((card, index) => (
            <article key={card.title} className="reveal-card">
              <ScrollImageReveal
                src={card.src}
                alt={card.alt}
                width={card.width}
                height={card.height}
                revealDelay={card.delay}
                className="reveal-image"
              />
              <div className="reveal-content">
                <span className="reveal-index">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="reveal-title">{card.title}</h3>
                <p className="reveal-subtitle">{card.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
