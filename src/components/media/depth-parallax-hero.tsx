"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface ParallaxLayer {
  src: string;
  alt: string;
  width: number;
  height: number;
  depth: number; // 0 = back, 1 = front
  x: string;
  y: string;
  scale: string;
  rotate: string;
  blur: string;
  opacity: string;
  delay: string;
}

const PARALLAX_LAYERS: ParallaxLayer[] = [
  {
    src: "/media/institution/sequence-01-1600.webp",
    alt: "Paper sheets in morning light",
    width: 1200,
    height: 900,
    depth: 0,
    x: "10%",
    y: "10%",
    scale: "0.6",
    rotate: "-2deg",
    blur: "2px",
    opacity: "0.7",
    delay: "0s",
  },
  {
    src: "/media/institution/sequence-02-1600.webp",
    alt: "Overlapping blank sheets",
    width: 1000,
    height: 750,
    depth: 1,
    x: "40%",
    y: "20%",
    scale: "0.75",
    rotate: "3deg",
    blur: "1px",
    opacity: "0.85",
    delay: "0.2s",
  },
  {
    src: "/media/institution/sequence-03-1600.webp",
    alt: "Cobalt ink dispersing in water",
    width: 1100,
    height: 825,
    depth: 2,
    x: "65%",
    y: "35%",
    scale: "0.85",
    rotate: "-4deg",
    blur: "0px",
    opacity: "1",
    delay: "0.4s",
  },
  {
    src: "/media/institution/sequence-04-1600.webp",
    alt: "Paper sheets in warm afternoon light",
    width: 900,
    height: 675,
    depth: 1,
    x: "20%",
    y: "55%",
    scale: "0.7",
    rotate: "2deg",
    blur: "1px",
    opacity: "0.8",
    delay: "0.6s",
  },
  {
    src: "/media/institution/sequence-05-1600.webp",
    alt: "Quiet room at dusk",
    width: 800,
    height: 600,
    depth: 0,
    x: "60%",
    y: "65%",
    scale: "0.65",
    rotate: "-1deg",
    blur: "2px",
    opacity: "0.75",
    delay: "0.8s",
  },
];

/**
 * Depth Parallax Hero — multiple image layers at different Z depths
 * that scroll at different speeds, creating a 3D depth effect.
 * Pure CSS 3D transforms — no WebGL, no 3D models.
 */
export default function DepthParallaxHero() {
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

      const layers = container.querySelectorAll<HTMLElement>(".parallax-layer");
      layers.forEach((img, index) => {
        const layer = PARALLAX_LAYERS[index];
        if (!layer) return;
        const depth = layer.depth;
        // Deeper layers move less (parallax)
        const moveY = offset * (1 - depth * 0.3) * 60;
        const moveX = offset * (1 - depth * 0.2) * 30;
        const scale = parseFloat(layer.scale) + offset * 0.05 * depth;
        const rotate = parseFloat(layer.rotate) + offset * depth * 3;

        img.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale}) rotate(${rotate}deg)`;
        img.style.opacity = String(parseFloat(layer.opacity) * (0.7 + offset * 0.3));
      });

      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <section className="inst-section depth-hero-section" aria-labelledby="home-depth-hero">
      <div className="inst-shell depth-hero-inner">
        <div className="depth-hero-copy">
          <p className="inst-label depth-label-reveal">Depth & Dimension</p>
          <h1 className="inst-display-xl depth-headline-reveal">
            Materials in <span className="inst-serif">three-dimensional space.</span>
          </h1>
          <p className="inst-lede mt-5 depth-lede-reveal max-w-[42ch]">
            Every surface is a real photograph, layered in CSS 3D space.
            No renders, no models — just light, paper, glass, brass and ink.
          </p>
        </div>

        <div className="depth-hero-wrap" ref={containerRef} style={{ perspective: "1400px" }}>
          {PARALLAX_LAYERS.map((layer, index) => (
            <img
              key={layer.src}
              src={layer.src}
              alt={layer.alt}
              width={layer.width}
              height={layer.height}
              loading="lazy"
              decoding="async"
              className="parallax-layer"
              style={{
                position: "absolute",
                left: layer.x,
                top: layer.y,
                transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotate})`,
                filter: `blur(${layer.blur})`,
                opacity: layer.opacity,
                transition: `opacity 0.8s var(--ease-state) ${layer.delay}`,
                borderRadius: "24px",
                border: "1px solid var(--rule-strong)",
                boxShadow: "0 40px 120px rgba(17, 18, 15, 0.1)",
                willChange: "transform, opacity",
              }}
            />
          ))}
          <div className="depth-glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
