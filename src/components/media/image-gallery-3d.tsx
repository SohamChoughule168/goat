"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface FloatImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  x: string;
  y: string;
  scale: string;
  rotate: string;
  delay: string;
}

const FLOAT_IMAGES: FloatImage[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 400,
    height: 500,
    x: "10%",
    y: "20%",
    scale: "0.8",
    rotate: "-3deg",
    delay: "0s",
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    alt: "Overlapping blank sheets",
    width: 300,
    height: 400,
    x: "55%",
    y: "10%",
    scale: "0.6",
    rotate: "5deg",
    delay: "0.5s",
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 350,
    height: 450,
    x: "70%",
    y: "40%",
    scale: "0.7",
    rotate: "-2deg",
    delay: "1s",
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    alt: "Paper sheets in warm afternoon light",
    width: 450,
    height: 550,
    x: "5%",
    y: "50%",
    scale: "0.85",
    rotate: "3deg",
    delay: "1.5s",
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    alt: "Quiet room at dusk",
    width: 300,
    height: 400,
    x: "60%",
    y: "70%",
    scale: "0.65",
    rotate: "-4deg",
    delay: "2s",
  },
];

export default function ImageGallery3D() {
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
      const offset = (centerY - viewportCenter) / viewportCenter;

      const images = container.querySelectorAll<HTMLElement>(".float-image");
      images.forEach((img, index) => {
        const strength = 0.15 + index * 0.05;
        const moveY = offset * strength * 40;
        const moveX = offset * strength * 20;
        img.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${parseFloat(img.dataset.rotate || "0")}deg) scale(${img.dataset.scale || "1"})`;
      });

      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <section className="inst-section-tight gallery-section" aria-labelledby="home-gallery">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label">Material studies</p>
            <h2 className="inst-h2 mt-5 max-w-[28ch]">
              Real materials.<br />
              <span className="inst-serif">No renders.</span>
            </h2>
          </div>
        </div>

        <div className="gallery-wrap" ref={containerRef} style={{ perspective: "1000px" }}>
          {FLOAT_IMAGES.map((img, index) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
              decoding="async"
              className="float-image"
              data-rotate={img.rotate}
              data-scale={img.scale}
              style={{
                left: img.x,
                top: img.y,
                transform: `rotate(${img.rotate}) scale(${img.scale})`,
                transition: `opacity 0.6s var(--ease-state) ${img.delay}`,
                opacity: reduced ? 1 : 0,
              }}
            />
          ))}
          <div className="gallery-gradient" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
