"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { motion } from "motion/react";
import { useThreeCanvas, getParticleCount, getGeometryDetail } from "@/components/premium";
import { DESIGN_COLORS, MOTION_VARIANTS, INTERACTIONS, SPRINGS } from "@/components/premium";

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
  color: string;
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
    color: DESIGN_COLORS.primary.main,
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
    color: DESIGN_COLORS.secondary.main,
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
    color: DESIGN_COLORS.accent.purple,
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
    color: DESIGN_COLORS.accent.orange,
  },
];

export default function PremiumScrollWipeV2() {
  const { canvasRef, context, performanceLevel } = useThreeCanvas("scroll-wipe-v2", { cameraZ: 45 });
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  // Scroll progress for animations - use state to avoid SSR issues
  const [scrollY, setScrollY] = useState(0);
  const scrollProgress = typeof window !== "undefined" ? scrollY / (window.innerHeight * 3) : 0;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!context) return;

    const { scene, animate, stop } = context;
    const particleCount = getParticleCount("wipe", performanceLevel);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.004;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.004;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;

      sizes[i] = Math.random() * 0.8 + 0.3;
      phases[i] = Math.random() * Math.PI * 2;

      // Color based on vertical position
      const yNorm = (positions[i3 + 1] + 30) / 60;
      let color = new THREE.Color();
      if (yNorm < 0.25) color.set(DESIGN_COLORS.primary.main);
      else if (yNorm < 0.5) color.set(DESIGN_COLORS.secondary.main);
      else if (yNorm < 0.75) color.set(DESIGN_COLORS.accent.purple);
      else color.set(DESIGN_COLORS.accent.orange);
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    geometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const animateFn = () => {
      if (!particlesRef.current || !geometryRef.current) return;
      const time = performance.now() * 0.001;
      const scroll = scrollProgress;

      const positions = geometryRef.current.attributes.position.array as Float32Array;
      const velocities = geometryRef.current.attributes.velocity.array as Float32Array;
      const phases = geometryRef.current.attributes.phase.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1] + 0.002;
        positions[i3 + 2] += velocities[i3 + 2];

        velocities[i3] *= 0.995;
        velocities[i3 + 1] *= 0.995;
        velocities[i3 + 2] *= 0.995;

        // Horizontal drift based on phase
        positions[i3] += Math.sin(time * 0.5 + phases[i]) * 0.002;

        // Recycle
        if (positions[i3 + 1] > 35) {
          positions[i3] = (Math.random() - 0.5) * 55;
          positions[i3 + 1] = -35;
          positions[i3 + 2] = (Math.random() - 0.5) * 35;
        }
      }
      geometryRef.current.attributes.position.needsUpdate = true;

      particlesRef.current!.rotation.y += 0.00003;
    };

    animate(animateFn);

    return () => {
      stop();
      geometry.dispose();
      material.dispose();
    };
  }, [context, performanceLevel, scrollProgress]);

  return (
    <motion.section 
      className="scroll-wipe-v2" 
      aria-labelledby="home-wipe"
      variants={MOTION_VARIANTS.section}
    >
      <div className="wipe-bg">
        <canvas ref={canvasRef} className="wipe-canvas" aria-hidden="true" />
      </div>

      <div className="inst-shell">
        <motion.div 
          className="wipe-header" 
          variants={MOTION_VARIANTS.section}
        >
          <p className="inst-label">The four surfaces</p>
          <h2 className="inst-h2 mt-5 max-w-[34ch]">
            Wiped in as you<br />
            <span className="inst-serif">scroll down.</span>
          </h2>
        </motion.div>

        <div className="wipe-grid">
          {WIPE_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              className={`wipe-card wipe-card-${card.direction}`}
              variants={MOTION_VARIANTS.card}
              style={{ 
                borderColor: card.color,
                transitionDelay: `${card.delay}s`
              }}
              {...INTERACTIONS.card}
            >
              <div className="wipe-image-wrap">
                <motion.img
                  src={card.src}
                  alt={card.alt}
                  width={card.width}
                  height={card.height}
                  decoding="async"
                  loading="lazy"
                  className="wipe-image"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ borderColor: card.color }}
                />
                <motion.div 
                  className="wipe-shine" 
                  aria-hidden="true"
                  initial={{ x: "-100%" }}
                  whileInView={{ x: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}40, transparent)` }}
                />
                <div className="wipe-image-glare" aria-hidden="true" style={{ borderColor: card.color }} />
              </div>
              <motion.div 
                className="wipe-content glass-morph" 
                variants={MOTION_VARIANTS.staggerItem}
                style={{ borderColor: card.color }}
                {...INTERACTIONS.card}
              >
                <span className="wipe-index">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="wipe-title">{card.title}</h3>
                <p className="wipe-body">{card.body}</p>
                <Link href={card.href} className="wipe-link" {...INTERACTIONS.link}>
                  <span>Open</span>
                  <span className="wipe-arrow" aria-hidden="true" style={{ color: card.color }}>→</span>
                </Link>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}