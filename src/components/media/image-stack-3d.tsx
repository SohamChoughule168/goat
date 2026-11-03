"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface StackImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  rotate: string;
  scale: string;
  delay: string;
  zIndex: number;
}

const STACK_IMAGES: StackImage[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 800,
    height: 600,
    rotate: "-2deg",
    scale: "1.0",
    delay: "0s",
    zIndex: 5,
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    alt: "Overlapping blank sheets",
    width: 750,
    height: 560,
    rotate: "3deg",
    scale: "0.94",
    delay: "0.15s",
    zIndex: 4,
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 700,
    height: 520,
    rotate: "-4deg",
    scale: "0.88",
    delay: "0.3s",
    zIndex: 3,
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    alt: "Paper sheets in warm afternoon light",
    width: 650,
    height: 480,
    rotate: "2deg",
    scale: "0.82",
    delay: "0.45s",
    zIndex: 2,
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    alt: "Quiet room at dusk",
    width: 600,
    height: 440,
    rotate: "-1deg",
    scale: "0.76",
    delay: "0.6s",
    zIndex: 1,
  },
];

/**
 * Image Stack 3D — images stacked in 3D space that separate on scroll.
 *
 * As the user scrolls through this section, the stack fans out with
 * each image rotating and translating differently. Pure CSS 3D —
 * no WebGL, no 3D models, just images in 3D space.
 */
export default function ImageStack3D() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const container = containerRef.current;
    let frame = 0;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const scrollY = window.scrollY;
      const centerY = rect.top + rect.height / 2 - scrollY;
      const viewportCenter = window.innerHeight / 2;
      const offset = Math.min(1, Math.max(0, (viewportCenter - centerY) / viewportCenter));

      const images = container.querySelectorAll<HTMLElement>(".stack-image");
      images.forEach((img, index) => {
        const data = img.dataset;
        const separation = offset * 60 * (index + 1); // each image separates more
        const rx = parseFloat(data.rotate || "0") + offset * 5;
        const ry = offset * 8 * (index % 2 === 0 ? 1 : -1);
        const scale = parseFloat(data.scale || "1") + offset * 0.04 * index;

        img.style.transform = `translateY(${separation}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
        img.style.zIndex = String(data.zindex ? parseInt(data.zindex) + index : 0);
      });

      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <section className="inst-section-tight stack-section" aria-labelledby="home-stack-3d">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label">Material stack</p>
            <h2 className="inst-h2 mt-5 max-w-[28ch]">
              Layers in <span className="inst-serif">three dimensions.</span>
            </h2>
          </div>
        </div>

        <div className="stack-wrap" ref={containerRef} style={{ perspective: "1200px" }}>
          {STACK_IMAGES.map((img, index) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
              decoding="async"
              className="stack-image"
              data-rotate={img.rotate}
              data-scale={img.scale}
              data-zindex={String(img.zIndex)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${img.rotate}) scale(${img.scale})`,
                borderRadius: "16px",
                border: "1px solid var(--rule-strong)",
                boxShadow: "0 30px 80px rgba(17, 18, 15, 0.08)",
                transition: `opacity 0.6s var(--ease-state) ${img.delay}`,
                opacity: reduced ? 1 : 0,
                willChange: "transform",
              }}
            />
          ))}
          <div className="stack-gradient" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
