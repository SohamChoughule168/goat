"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface PinItem {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
}

const PIN_ITEMS: PinItem[] = [
  {
    title: "Real materials",
    body: "Every surface is a photograph, not a render.",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
  },
  {
    title: "No 3D objects",
    body: "Images and video move in 3D CSS space — no WebGL.",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
  },
  {
    title: "Scroll-driven",
    body: "Everything responds to your scroll position.",
    image: "/media/institution/sequence-05-1600.webp",
    imageAlt: "Quiet room at dusk",
  },
];

/**
 * Pin Section — sticky section where content changes as you scroll.
 * Pure CSS position: sticky — no WebGL.
 */
export default function PinSection() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const container = containerRef.current;
    let frame = 0;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(1, rect.height - viewport);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const index = Math.min(PIN_ITEMS.length - 1, Math.floor(progress * PIN_ITEMS.length));
      setActive(index);
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <section className="inst-section pin-section" aria-labelledby="home-pin">
      <div className="inst-shell pin-inner">
        <div className="pin-copy">
          <p className="inst-label">How it works</p>
          <h2 className="inst-h2 mt-5 pin-headline-reveal max-w-[40ch]">
            Scroll through<br />
            <span className="inst-serif">the system.</span>
          </h2>
        </div>

        <div className="pin-wrap" ref={containerRef}>
          <div className="pin-spacer" />
          <div className="pin-content">
            {PIN_ITEMS.map((item, index) => (
              <article key={item.title} className={`pin-card ${index === active ? "pin-active" : ""}`}>
                <div className="pin-image">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="pin-image-img"
                  />
                </div>
                <div className="pin-text">
                  <h3 className="pin-title">{item.title}</h3>
                  <p className="pin-body">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="pin-spacer" />
        </div>
      </div>
    </section>
  );
}
