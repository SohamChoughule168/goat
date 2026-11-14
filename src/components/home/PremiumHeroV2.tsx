"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { institutionHero } from "@/content/institution";
import { 
  useThreeCanvas, 
  getParticleCount, 
  getGeometryDetail,
  MOTION_VARIANTS,
  DESIGN_COLORS,
  SPRINGS,
  TRANSITIONS 
} from "@/components/premium";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface PremiumHeroV2Props {
  className?: string;
}

export default function PremiumHeroV2({ className = "" }: PremiumHeroV2Props) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  
  const { canvasRef, context, performanceLevel, prefersReducedMotion } = useThreeCanvas("hero-v2", { 
    cameraZ: 55,
    fov: 50,
    clearColor: 0x000000,
    clearAlpha: 0,
  });
  
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const scrollProgress = typeof window !== "undefined" ? Math.min(scrollY / window.innerHeight, 1) : 0;
  
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!context) return;

    const { scene, camera, animate, stop } = context;
    cameraRef.current = camera;
    camera.position.set(0, 0, 50);

    // 3D Architectural Layered Paper Scene
    const paperGroup = new THREE.Group();
    scene.add(paperGroup);

    // Procedural Blueprint Texture (Bone-white paper with fine architectural grid)
    const createBlueprintTexture = () => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 768;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#f5f1e8";
      ctx.fillRect(0, 0, 1024, 768);
      // Fine blueprint grid
      ctx.strokeStyle = "rgba(17, 18, 15, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 1024; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 768);
        ctx.stroke();
      }
      for (let y = 0; y <= 768; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }
      // Corner tick marks & frame
      ctx.strokeStyle = "rgba(31, 58, 218, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(32, 32, 960, 704);
      return new THREE.CanvasTexture(c);
    };

    // Procedural Ledger Texture (Ruled paper with margin)
    const createLedgerTexture = () => {
      const c = document.createElement("canvas");
      c.width = 768;
      c.height = 1024;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#faf7f0";
      ctx.fillRect(0, 0, 768, 1024);
      // Ruled ledger lines
      ctx.strokeStyle = "rgba(17, 18, 15, 0.08)";
      ctx.lineWidth = 1.2;
      for (let y = 80; y <= 980; y += 40) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(728, y);
        ctx.stroke();
      }
      // Cobalt vertical margin line
      ctx.strokeStyle = "rgba(31, 58, 218, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 40);
      ctx.lineTo(120, 984);
      ctx.stroke();
      return new THREE.CanvasTexture(c);
    };

    const blueprintTex = createBlueprintTexture();
    const ledgerTex = createLedgerTexture();

    // Sheet 1: Blueprint Ground Sheet (Base architectural plane)
    const sheet1Geo = new THREE.PlaneGeometry(36, 26);
    const sheet1Mat = new THREE.MeshStandardMaterial({
      map: blueprintTex,
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const sheet1 = new THREE.Mesh(sheet1Geo, sheet1Mat);
    sheet1.position.set(4, 1, -12);
    sheet1.rotation.set(0.06, -0.16, 0.03);
    paperGroup.add(sheet1);

    // Sheet 2: Institutional Ledger Sheet (Slanted floating document)
    const sheet2Geo = new THREE.PlaneGeometry(24, 32);
    const sheet2Mat = new THREE.MeshStandardMaterial({
      map: ledgerTex,
      roughness: 0.84,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const sheet2 = new THREE.Mesh(sheet2Geo, sheet2Mat);
    sheet2.position.set(14, -3, -4);
    sheet2.rotation.set(-0.06, -0.24, -0.05);
    paperGroup.add(sheet2);

    // Sheet 3: Translucent Architectural Vellum Strip (Layered foreground)
    const sheet3Geo = new THREE.PlaneGeometry(16, 22);
    const sheet3Mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    });
    const sheet3 = new THREE.Mesh(sheet3Geo, sheet3Mat);
    sheet3.position.set(-6, 3, 4);
    sheet3.rotation.set(0.08, 0.14, 0.02);
    paperGroup.add(sheet3);

    // Edge highlight on sheet 3
    const wireGeo = new THREE.EdgesGeometry(sheet3Geo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x1f3ad8, transparent: true, opacity: 0.75 });
    sheet3.add(new THREE.LineSegments(wireGeo, wireMat));

    // Directional Key Light
    const keyLight = new THREE.DirectionalLight(0xfffbf2, 2.6);
    keyLight.position.set(-15, 25, 30);
    scene.add(keyLight);

    // Ambient Room Fill (Warm bone/paper tint)
    const ambLight = new THREE.AmbientLight(0xf2eee5, 1.8);
    scene.add(ambLight);

    // Restrained Cobalt Light Sweep
    const cobaltLight = new THREE.DirectionalLight(0x1f3ad8, 3.2);
    cobaltLight.position.set(18, 14, 16);
    scene.add(cobaltLight);

    // Floating fine microscopic paper motes (35 particles)
    const moteCount = 35;
    const moteGeo = new THREE.BufferGeometry();
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 45;
      motePos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0x1f3ad8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const animateFn = (delta: number) => {
      timeRef.current += delta || 0.016;
      const t = timeRef.current;
      const scroll = typeof window !== "undefined" ? window.scrollY / (window.innerHeight || 800) : 0;

      // Restrained cobalt light sweep oscillation
      cobaltLight.position.x = 18 + Math.sin(t * 0.7) * 12;
      cobaltLight.position.y = 12 + Math.cos(t * 0.5) * 8;

      // Independent pointer tilt with smooth damping
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      sheet1.rotation.y = -0.16 + mx * 0.04;
      sheet1.rotation.x = 0.06 - my * 0.03;

      sheet2.rotation.y = -0.22 + mx * 0.08;
      sheet2.rotation.x = -0.06 - my * 0.06;

      sheet3.rotation.y = 0.14 + mx * 0.12;
      sheet3.rotation.x = 0.08 - my * 0.10;

      // Subtle atmospheric float
      sheet2.position.y = -2 + Math.sin(t * 0.7) * 0.35;
      sheet3.position.y = 3 + Math.cos(t * 0.8) * 0.45;

      // Camera push-in on scroll
      camera.position.z = 50 - Math.min(scroll, 1) * 8;
      sheet1.position.z = -10 - Math.min(scroll, 1) * 2.5;
      sheet2.position.z = -3 + Math.min(scroll, 1) * 2;
      sheet3.position.z = 4 + Math.min(scroll, 1) * 3;

      motes.rotation.y = t * 0.02;
    };

    animate(animateFn);

    setLoaded(true);
    const revealTimer = setTimeout(() => setRevealed(true), 60);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(revealTimer);
      stop();
      sheet1Geo.dispose();
      sheet1Mat.dispose();
      sheet2Geo.dispose();
      sheet2Mat.dispose();
      sheet3Geo.dispose();
      sheet3Mat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      blueprintTex.dispose();
      ledgerTex.dispose();
    };
  }, [reduced, context, performanceLevel, prefersReducedMotion]);


  return (
    <section className={`premium-hero-v2 ${className}`} aria-labelledby="home-hero">
      <div className="hero-bg" aria-hidden="true">
        <img
          src={institutionHero.src}
          srcSet={institutionHero.srcSet}
          sizes="(max-width: 1023px) 100vw, 1200px"
          width={institutionHero.width}
          height={institutionHero.height}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="hero-img"
          style={{ opacity: 0.28, objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      <div className="hero-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="hero-canvas"
          aria-hidden="true"
        />
      </div>

      <div className="hero-atmosphere" aria-hidden="true">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="hero-noise" aria-hidden="true" />

      <HeroContent loaded={loaded} revealed={revealed} scrollY={scrollY} />
    </section>
  );
}

function HeroContent({ 
  loaded = true, 
  revealed = false, 
  scrollY = 0 
}: { 
  loaded: boolean; 
  revealed: boolean; 
  scrollY: number;
}) {
  const scrollProgress = typeof window !== "undefined" ? Math.min(scrollY / window.innerHeight, 1) : 0;
  const scale = typeof window !== "undefined" ? 1 - scrollProgress * 0.05 : 1;
  const opacity = typeof window !== "undefined" ? Math.max(1 - scrollProgress / 0.3, 0) : 1;

  return (
    <>
      <div className="hero-specular" aria-hidden="true" />
      
      <motion.div 
        className="hero-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      >
        <div className="hero-copy">
          <motion.div
            className="meridian-badge"
            variants={MOTION_VARIANTS.section}
            custom={{ delay: 0 }}
            style={{ opacity: revealed ? 1 : 0 }}
          >
            <span className="meridian-badge-box" aria-hidden="true" />
            <span>OPERATING SYSTEMS FOR INSTITUTES · MUMBAI</span>
          </motion.div>
          
          <motion.h1 
            id="home-hero" 
            className="hero-headline text-gradient-animated kinetic-title"
            variants={MOTION_VARIANTS.section}
            custom={{ delay: 0.15 }}
          >
            <span className="headline-line kinetic-word kinetic-word-1">One system.</span>
            <br />
            <span className="headline-line kinetic-word kinetic-word-2 headline-serif">
              <span className="meridian-accent" data-text="Every branch.">Every branch.</span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="hero-lede kinetic-lede"
            variants={MOTION_VARIANTS.section}
            custom={{ delay: 0.3 }}
            style={{ opacity: revealed ? 1 : 0 }}
          >
            We design and build the public site, admissions path and student systems that institutes actually run on. One accountable team, from diagnosis to handover.
          </motion.p>
          
          <motion.p 
            className="hero-proof"
            variants={MOTION_VARIANTS.section}
            custom={{ delay: 0.4 }}
            style={{ opacity: revealed ? 1 : 0 }}
          >
            <span className="proof-dot" aria-hidden="true" />
            Verified build: PRV Financial Services, live since April 2025.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            variants={MOTION_VARIANTS.section}
            custom={{ delay: 0.5 }}
          >
            <Link 
              href="/#fit-check" 
              className="btn btn-primary btn-magnetic btn-lg hero-cta btn-premium-shine specular-sweep magnetic-premium"
              data-magnetic-label="Check fit in 60 seconds"
            >
              <span className="btn-content">
                Check fit in 60 seconds
                <ArrowRight size={18} strokeWidth={2} className="btn-arrow" aria-hidden="true" />
              </span>
              <span className="btn-shine" aria-hidden="true" />
            </Link>
            <Link 
              href="/work" 
              className="btn btn-secondary btn-lg hero-cta specular-sweep magnetic-premium"
              data-magnetic-label="See the proof"
            >
              See the proof
              <ArrowRight size={18} strokeWidth={2} className="btn-arrow" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <aside className="hero-panel glass-morph" aria-label="The operating layers: four of eight operating layers">
          <div className="panel-head">
            <span className="panel-label">The operating layers</span>
            <span className="panel-num">01 — 08</span>
          </div>
          <dl className="panel-legend">
            {[
              { index: "01", title: "Brand", meta: "Identity and governance" },
              { index: "02", title: "Website", meta: "Public front door" },
              { index: "03", title: "Admissions", meta: "Enquiry to enrolment" },
              { index: "04", title: "Intelligence", meta: "One reporting layer" },
            ].map((layer) => (
              <motion.div key={layer.index} variants={MOTION_VARIANTS.staggerItem}>
                <dt className="legend-item">
                  <span className="legend-index">{layer.index}</span>
                  <span className="legend-title">{layer.title}</span>
                </dt>
                <dd className="legend-meta">{layer.meta}</dd>
              </motion.div>
            ))}
          </dl>
          <motion.p 
            className="panel-caption" 
            variants={MOTION_VARIANTS.staggerItem}
            custom={{ delay: 0.4 }}
          >
            Four of eight layers, from brand to intelligence.
          </motion.p>
        </aside>
      </motion.div>

      <motion.dl 
        className="hero-metrics"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
      >
        <div className="metric-item">
          <dt className="metric-label">Operating layers</dt>
          <dd className="metric-value">01 — 08</dd>
        </div>
        <div className="metric-divider" aria-hidden="true" />
        <div className="metric-item">
          <dt className="metric-label">Capabilities</dt>
          <dd className="metric-value">18</dd>
        </div>
        <div className="metric-divider" aria-hidden="true" />
        <div className="metric-item">
          <dt className="metric-label">Accessibility target</dt>
          <dd className="metric-value">WCAG 2.2 AA</dd>
        </div>
        <div className="metric-divider" aria-hidden="true" />
        <div className="metric-item">
          <dt className="metric-label">Ownership</dt>
          <dd className="metric-value">100% yours</dd>
        </div>
      </motion.dl>
    </>
  );
}