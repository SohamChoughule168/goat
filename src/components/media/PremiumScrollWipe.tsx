"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { useThreeCanvas, getParticleCount } from "@/components/premium/ThreeProvider";

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

export default function ScrollWipe() {
  const { canvasRef, context, performanceLevel } = useThreeCanvas("scroll-wipe", { cameraZ: 40 });
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!context) return;

    const { scene, animate, stop } = context;
    const particleCount = getParticleCount("wipe", performanceLevel);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

      sizes[i] = Math.random() * 0.6 + 0.2;

      const color = new THREE.Color();
      color.setHSL(0.45 + Math.random() * 0.1, 0.8, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const animateFn = () => {
      if (!particlesRef.current || !geometryRef.current) return;

      const positions = geometryRef.current.attributes.position.array as Float32Array;
      const velocities = geometryRef.current.attributes.velocity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        velocities[i3] *= 0.99;
        velocities[i3 + 1] *= 0.99;
        velocities[i3 + 2] *= 0.99;

        if (positions[i3 + 1] > 30) {
          positions[i3] = (Math.random() - 0.5) * 50;
          positions[i3 + 1] = -30;
          positions[i3 + 2] = (Math.random() - 0.5) * 30;
        }
        if (positions[i3] > 25) positions[i3] = -25;
        if (positions[i3] < -25) positions[i3] = 25;
        if (positions[i3 + 2] > 20) positions[i3 + 2] = -20;
        if (positions[i3 + 2] < -20) positions[i3 + 2] = 20;
      }
      geometryRef.current.attributes.position.needsUpdate = true;

      particlesRef.current!.rotation.y += 0.00005;
    };

    animate(animateFn);

    return () => {
      stop();
      geometry.dispose();
      material.dispose();
    };
  }, [context, performanceLevel]);

  return (
    <section className="inst-section-tight wipe-section wipe-section-premium" aria-labelledby="home-wipe">
      <div className="wipe-bg">
        <canvas ref={canvasRef} className="wipe-canvas" aria-hidden="true" />
      </div>

      <div className="inst-shell">
        <div className="wipe-header wipe-header-premium">
          <p className="inst-label wipe-label-reveal">The four surfaces</p>
          <h2 className="inst-h2 mt-5 wipe-headline-reveal max-w-[34ch]">
            Wiped in as you<br />
            <span className="inst-serif">scroll down.</span>
          </h2>
        </div>

        <div className="wipe-grid wipe-grid-premium">
          {WIPE_CARDS.map((card, index) => (
            <article key={card.title} className={`wipe-card wipe-card-${card.direction} wipe-card-premium magnetic specular glass-liquid`}>
              <div className="wipe-image-wrap wipe-image-wrap-premium">
                <img
                  src={card.src}
                  alt={card.alt}
                  width={card.width}
                  height={card.height}
                  decoding="async"
                  loading="lazy"
                  className="wipe-image wipe-image-premium specular"
                />
                <div className="wipe-shine wipe-shine-premium" aria-hidden="true" />
                <div className="wipe-image-glare specular" aria-hidden="true" />
              </div>
              <div className="wipe-content wipe-content-premium glass-liquid specular">
                <span className="wipe-index">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="wipe-title">{card.title}</h3>
                <p className="wipe-body">{card.body}</p>
                <Link href={card.href} className="wipe-link wipe-link-premium magnetic specular">
                  <span>Open</span>
                  <span className="wipe-arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}