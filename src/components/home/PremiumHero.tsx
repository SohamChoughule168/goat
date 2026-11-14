"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThreeCanvas, getParticleCount, PARTICLE_PRESETS } from "@/components/premium/ThreeProvider";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { institutionHero } from "@/content/institution";

interface PremiumHeroProps {
  className?: string;
}

export default function PremiumHero({ className = "" }: PremiumHeroProps) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { canvasRef, context, performanceLevel } = useThreeCanvas("hero", { cameraZ: 40 });
  const particlesRef = useRef<THREE.Points | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    if (reduced || !context) {
      setLoaded(true);
      return;
    }

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("hero", performanceLevel);

    // Main particle field
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const hues = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;

      sizes[i] = Math.random() * 1.2 + 0.4;
      alphas[i] = Math.random() * 0.4 + 0.15;
      hues[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("hue", new THREE.BufferAttribute(hues, 1));

    // Shader material for particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x14d896) },
        uColor2: { value: new THREE.Color(0x3b82f6) },
        uColor3: { value: new THREE.Color(0xd946ef) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        attribute float hue;
        varying float vAlpha;
        varying float vHue;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vAlpha = alpha;
          vHue = hue;
          vPosition = position;

          vec3 pos = position;

          // Subtle floating motion
          pos.y += sin(uTime * 0.3 + position.x * 0.1) * 0.5;
          pos.x += cos(uTime * 0.2 + position.y * 0.1) * 0.3;
          pos.z += sin(uTime * 0.15 + position.z * 0.05) * 0.2;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vHue;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

          vec3 color = mix(uColor1, uColor2, vHue);
          color = mix(color, uColor3, sin(vPosition.y * 0.1 + vPosition.x * 0.1) * 0.5 + 0.5);

          float glow = 1.0 - length(gl_PointCoord - vec2(0.5)) * 2.0;
          color += vec3(1.0, 1.0, 1.0) * glow * 0.3;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    // Central morphing sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(3, performanceLevel === "high" ? 32 : performanceLevel === "medium" ? 24 : 16);
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x14d896) },
        uColor2: { value: new THREE.Color(0x3b82f6) },
        uColor3: { value: new THREE.Color(0xd946ef) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;

          vec3 pos = position;

          // Morphing animation
          float noise = sin(uTime * 0.5 + position.x * 2.0) *
                       cos(uTime * 0.3 + position.y * 2.0) *
                       sin(uTime * 0.2 + position.z * 2.0);

          pos += normal * noise * 0.3;

          // Mouse influence
          vec3 mouseDir = normalize(vec3(uMouse.x * 10.0, uMouse.y * 10.0, 5.0));
          float mouseDist = length(position - mouseDir * 15.0);
          if (mouseDist < 8.0) {
            float force = (1.0 - mouseDist / 8.0) * 0.5;
            pos += normal * force;
          }

          vPosition = pos;
          vNormal = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

          vec3 color = mix(uColor1, uColor2, sin(uTime * 0.3 + vPosition.y * 0.5) * 0.5 + 0.5);
          color = mix(color, uColor3, sin(uTime * 0.2 + vPosition.x * 0.5) * 0.5 + 0.5);

          float glow = fresnel * 0.8;
          vec3 finalColor = color + vec3(1.0) * glow * 0.2;

          float alpha = 0.3 + fresnel * 0.4;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereRef.current = sphere;
    scene.add(sphere);

    // Ring system
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(8 + i * 2, 12 + i * 2, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: [0x14d896, 0x3b82f6, 0xd946ef][i],
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2;
      ring.rotation.z = i * 0.5;
      scene.add(ring);
      rings.push(ring);
    }
    ringsRef.current = rings;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    // Animation
    const animateFn = () => {
      timeRef.current += 0.016;

      // Update particle uniforms
      (particles.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      (particles.material as THREE.ShaderMaterial).uniforms.uMouse.value.set(
        mouseRef.current.x * 10,
        mouseRef.current.y * 10
      );

      // Update sphere uniforms
      (sphere.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      (sphere.material as THREE.ShaderMaterial).uniforms.uMouse.value.set(
        mouseRef.current.x * 10,
        mouseRef.current.y * 10
      );

      // Animate particles
      const positions = geometry.attributes.position.array as Float32Array;
      const velocities = geometry.attributes.velocity.array as Float32Array;
      const hues = geometry.attributes.hue.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Orbital motion
        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
        const theta = Math.atan2(positions[i3 + 1], positions[i3]);
        const phi = Math.acos(positions[i3 + 2] / radius);

        const newTheta = theta + 0.0002 * (0.5 + hues[i] * 0.5);
        const newPhi = phi + 0.0001 * (0.5 - hues[i]);

        positions[i3] = radius * Math.sin(phi) * Math.cos(newTheta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(newTheta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Vertical breathing
        positions[i3 + 1] += Math.sin(timeRef.current * 0.5 + hues[i] * 10) * 0.02;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      // Sphere rotation
      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.0005;
        sphereRef.current.rotation.x += 0.0002;
      }

      // Rings rotation
      ringsRef.current.forEach((ring, i) => {
        ring.rotation.y += 0.0001 * (i + 1);
        ring.rotation.z += 0.00005 * (i + 1);
      });

      // Camera subtle movement
      camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.01;
      camera.position.y += (-mouseRef.current.y * 2 - camera.position.y) * 0.01;
      camera.lookAt(0, 0, 0);
    };

    animate(animateFn);

    // Load image and reveal
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      setTimeout(() => setRevealed(true), 100);
    };
    img.src = institutionHero.src;

    // Cleanup
    return () => {
      if (canvas) canvas.removeEventListener("mousemove", handleMouseMove);
      stop();
      geometry.dispose();
      particleMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      rings.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
    };
  }, [reduced, context, performanceLevel]);

  if (reduced) {
    return (
      <section className={`premium-hero ${className}`} aria-labelledby="home-hero">
        <div className="premium-hero-bg">
          <img
            src={institutionHero.src}
            srcSet={institutionHero.srcSet}
            sizes="(max-width: 1023px) 100vw, 1200px"
            width={institutionHero.width}
            height={institutionHero.height}
            alt={institutionHero.alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="premium-hero-img"
          />
        </div>
        <div className="premium-hero-overlay" />
        <PremiumHeroContent loaded={true} revealed={true} />
      </section>
    );
  }

  return (
    <section className={`premium-hero ${className}`} aria-labelledby="home-hero">
      <div className="premium-hero-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="premium-hero-canvas"
          aria-hidden="true"
        />
      </div>
      <div className="premium-hero-atmosphere" aria-hidden="true" />
      <PremiumHeroContent loaded={loaded} revealed={revealed} />
    </section>
  );
}

function PremiumHeroContent({ loaded = true, revealed = false }: { loaded: boolean; revealed: boolean }) {
  return (
    <>
      <div className="premium-hero-specular" aria-hidden="true" />
      <div className="inst-shell premium-hero-shell">
        <div className="premium-hero-copy">
          <p className={`inst-label premium-label-reveal ${revealed ? "revealed" : ""}`} style={{ transitionDelay: "0ms" }}>
            Independent studio / Mumbai / Est. 2024
          </p>
          <h1 id="home-hero" className={`inst-display-monument premium-headline premium-headline-reveal ${revealed ? "revealed" : ""}`} style={{ transitionDelay: "100ms" }}>
            <span className="headline-line">One system.</span>
            <span className="headline-line inst-serif">Every branch.</span>
          </h1>
          <p className={`inst-lede premium-lede premium-lede-reveal ${revealed ? "revealed" : ""}`} style={{ transitionDelay: "300ms" }}>
            We design and build the public site, admissions path and student systems that institutes actually run on. One accountable team, from diagnosis to handover.
          </p>
          <p className={`premium-proof premium-proof-reveal ${revealed ? "revealed" : ""}`} style={{ transitionDelay: "400ms" }}>
            <span className="premium-proof-dot" aria-hidden="true" />
            Verified build: PRV Financial Services, live since April 2025.
          </p>
          <div className="premium-actions" style={{ transitionDelay: "500ms" }}>
            <a href="/#fit-check" className="btn btn-primary btn-magnetic btn-lg premium-cta specular" data-magnetic-label="Check fit in 60 seconds">
              <span className="btn-content">
                Check fit in 60 seconds
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 10, flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="btn-shine specular" aria-hidden="true" />
            </a>
            <a href="/work" className="btn btn-secondary btn-lg premium-cta glass-liquid" data-magnetic-label="See the proof">
              See the proof
            </a>
          </div>
        </div>

        <aside className="premium-plate glass-liquid specular" aria-label="The operating layers: four of eight operating layers">
          <div className="premium-plate-head">
            <span className="inst-label">The operating layers</span>
            <span className="inst-num text-[0.625rem] uppercase tracking-[0.12em] text-[var(--ink-3)]">01 — 08</span>
          </div>
          <dl className="premium-layer-legend">
            {[
              { index: "01", title: "Brand", meta: "Identity and governance" },
              { index: "02", title: "Website", meta: "Public front door" },
              { index: "03", title: "Admissions", meta: "Enquiry to enrolment" },
              { index: "04", title: "Intelligence", meta: "One reporting layer" },
            ].map((layer) => (
              <Fragment key={layer.index}>
                <dt className="premium-legend-item premium-legend-reveal">
                  <span className="premium-legend-index">{layer.index}</span>
                  <span className="premium-legend-title">{layer.title}</span>
                </dt>
                <dd key={`${layer.index}-def`} className="premium-legend-meta premium-legend-reveal">{layer.meta}</dd>
              </Fragment>
            ))}
          </dl>
          <p className="premium-caption mt-6 max-w-[38ch] text-[0.8125rem] leading-relaxed text-[var(--ink-3)]">Four of eight layers, from brand to intelligence.</p>
        </aside>
      </div>

      <dl className="inst-shell premium-ledger premium-ledger-reveal">
        <div className="premium-ledger-item premium-ledger-reveal">
          <dt className="premium-ledger-label">Operating layers</dt>
          <dd className="premium-ledger-value">01 — 08</dd>
        </div>
        <div className="premium-ledger-item premium-ledger-reveal" style={{ transitionDelay: "80ms" }}>
          <dt className="premium-ledger-label">Capabilities</dt>
          <dd className="premium-ledger-value">18</dd>
        </div>
        <div className="premium-ledger-item premium-ledger-reveal" style={{ transitionDelay: "160ms" }}>
          <dt className="premium-ledger-label">Accessibility target</dt>
          <dd className="premium-ledger-value">WCAG 2.2 AA</dd>
        </div>
        <div className="premium-ledger-item premium-ledger-reveal" style={{ transitionDelay: "240ms" }}>
          <dt className="premium-ledger-label">Ownership</dt>
          <dd className="premium-ledger-value">100% yours</dd>
        </div>
      </dl>
    </>
  );
}

import { Fragment } from "react";