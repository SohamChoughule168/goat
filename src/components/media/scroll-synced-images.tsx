"use client";

import ScrollImageReveal from "@/components/media/scroll-image-reveal";

interface SyncImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  delay: number;
}

const SYNC_IMAGES: SyncImage[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 600,
    height: 450,
    delay: 0,
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    alt: "Overlapping blank sheets",
    width: 500,
    height: 400,
    delay: 0.1,
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 550,
    height: 420,
    delay: 0.2,
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    alt: "Paper sheets in warm afternoon light",
    width: 650,
    height: 480,
    delay: 0.3,
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    alt: "Quiet room at dusk",
    width: 480,
    height: 380,
    delay: 0.4,
  },
];

/**
 * Scroll-synced Image Grid — images that reveal with clip-path animation
 * as the user scrolls. Staggered delays create a cascading effect.
 * Pure CSS — no canvas, no WebGL.
 */
export default function ScrollSyncedImages() {
  return (
    <section className="inst-section-tight sync-section" aria-labelledby="home-sync-images">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label">Evidence in motion</p>
            <h2 className="inst-h2 mt-5 max-w-[28ch]">
              Real materials.<br />
              <span className="inst-serif">Revealed as you scroll.</span>
            </h2>
          </div>
        </div>

        <div className="sync-grid">
          {SYNC_IMAGES.map((img, index) => (
            <figure key={img.src} className="sync-figure">
              <ScrollImageReveal
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                revealDelay={img.delay}
                className="sync-image"
              />
              <figcaption className="sync-caption">
                <span className="sync-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="sync-label">{img.alt}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
