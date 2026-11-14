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
  
  const particlesRef = useRef<THREE.Points | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (reduced || prefersReducedMotion || !context) {
      setLoaded(true);
      setRevealed(true);
      return;
    }

    const { scene, camera, animate, stop } = context;
    cameraRef.current = camera;
    const particleCount = getParticleCount("hero", performanceLevel);
    const sphereDetail = getGeometryDetail("sphere", performanceLevel);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const hues = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;

      sizes[i] = Math.random() * 2 + 0.8;
      hues[i] = Math.random();
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("hue", new THREE.BufferAttribute(hues, 1));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(DESIGN_COLORS.primary.main) },
        uColor2: { value: new THREE.Color(DESIGN_COLORS.secondary.main) },
        uColor3: { value: new THREE.Color(DESIGN_COLORS.accent.purple) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute float hue;
        attribute float phase;
        varying float vAlpha;
        varying float vHue;
        varying vec3 vPosition;
        varying float vPhase;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uScroll;
        uniform float uPixelRatio;

        void main() {
          vAlpha = size;
          vHue = hue;
          vPosition = position;
          vPhase = phase;

          vec3 pos = position;
          float orbitSpeed = 0.04 + hue * 0.15;
          float angle = uTime * orbitSpeed + phase;
          float r = length(pos.xy);
          pos.x = r * cos(angle);
          pos.y = r * sin(angle);
          pos.z += sin(uTime * 0.4 + hue * 6.0 + phase) * 1.2;
          pos.y += uScroll * 30.0 * (0.5 + hue * 0.8);

          float mouseDist = length(vec2(uMouse.x - pos.x * 0.06, uMouse.y - pos.y * 0.06));
          if (mouseDist < 10.0) {
            float force = (1.0 - mouseDist / 10.0) * 3.0;
            vec2 mouseDir = normalize(vec2(uMouse.x * 20.0 - pos.x, uMouse.y * 20.0 - pos.y));
            pos.xy += mouseDir * force;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (500.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vHue;
        varying vec3 vPosition;
        varying float vPhase;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.02, dist) * vAlpha;
          vec3 color = mix(uColor1, uColor2, vHue);
          color = mix(color, uColor3, sin(vPosition.y * 0.08 + vPosition.x * 0.08 + uTime * 0.2) * 0.5 + 0.5);
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          color += vec3(1.0, 1.0, 1.0) * glow * 0.5 * vAlpha;
          float pulse = sin(uTime * 2.0 + vPhase) * 0.1 + 0.9;
          color *= pulse;
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

    const sphereGeometry = new THREE.IcosahedronGeometry(5, sphereDetail);
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(DESIGN_COLORS.primary.main) },
        uColor2: { value: new THREE.Color(DESIGN_COLORS.secondary.main) },
        uColor3: { value: new THREE.Color(DESIGN_COLORS.accent.purple) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uScroll;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vec3 pos = position;
          float noise1 = sin(uTime * 0.4 + pos.x * 2.5) * cos(uTime * 0.3 + pos.y * 2.5) * sin(uTime * 0.2 + pos.z * 2.5);
          float noise2 = sin(uTime * 0.7 + pos.x * 1.8) * cos(uTime * 0.5 + pos.y * 1.8) * 0.5;
          float noise3 = sin(uTime * 1.2 + pos.x * 1.2) * 0.3;
          float totalNoise = noise1 + noise2 + noise3;
          pos += normal * totalNoise * 0.5;
          float scrollMorph = uScroll * 0.6;
          pos += normal * scrollMorph * 0.4;
          vec3 mouseDir = normalize(vec3(uMouse.x * 25.0, uMouse.y * 25.0, 12.0));
          float mouseDist = length(pos - mouseDir * 30.0);
          if (mouseDist < 15.0) {
            float force = (1.0 - mouseDist / 15.0) * 1.5;
            pos += normal * force;
          }
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        void main() {
          vec3 viewDir = normalize(-vWorldPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
          vec3 color = mix(uColor1, uColor2, sin(uTime * 0.25 + vWorldPosition.y * 0.3) * 0.5 + 0.5);
          color = mix(color, uColor3, sin(uTime * 0.18 + vWorldPosition.x * 0.3) * 0.5 + 0.5);
          float glow = fresnel * 0.9;
          vec3 finalColor = color + vec3(1.0) * glow * 0.3;
          float pulse = sin(uTime * 1.0) * 0.05 + 0.95;
          finalColor *= pulse;
          float alpha = 0.2 + fresnel * 0.6;
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

    const glowGeometry = new THREE.SphereGeometry(7, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(DESIGN_COLORS.primary.main) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float uTime;
        uniform vec3 uColor;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          float pulse = sin(uTime * 0.6) * 0.3 + 0.7;
          vec3 color = uColor * pulse;
          float alpha = fresnel * 0.15 * pulse;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glowRef.current = glow;
    scene.add(glow);

    const rings: THREE.Mesh[] = [];
    const ringColors = [
      DESIGN_COLORS.primary.main,
      DESIGN_COLORS.secondary.main,
      DESIGN_COLORS.accent.purple,
    ];

    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.RingGeometry(9 + i * 3, 12 + i * 3, 128);
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(ringColors[i]) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          void main() {
            float dist = length(vUv - vec2(0.5));
            float ring = smoothstep(0.46, 0.5, dist) - smoothstep(0.5, 0.54, dist);
            float pulse = sin(uTime * 0.8 + vUv.x * 20.0) * 0.2 + 0.8;
            gl_FragColor = vec4(uColor, ring * pulse * 0.35);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2;
      ring.rotation.z = i * 0.7;
      scene.add(ring);
      rings.push(ring);
    }
    ringsRef.current = rings;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const animateFn = () => {
      timeRef.current += 0.016;
      const scroll = scrollYRef.current / window.innerHeight;
      
      if (particlesRef.current) {
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.set(
          mouseRef.current.x * 25,
          mouseRef.current.y * 25
        );
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uScroll.value = scroll;
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.uResolution.value.set(
          canvasRef.current?.clientWidth || 1920,
          canvasRef.current?.clientHeight || 1080
        );
      }

      if (sphereRef.current) {
        (sphereRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
        (sphereRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.set(
          mouseRef.current.x * 25,
          mouseRef.current.y * 25
        );
        (sphereRef.current.material as THREE.ShaderMaterial).uniforms.uScroll.value = scroll;
      }

      if (glowRef.current) {
        (glowRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      }

      ringsRef.current.forEach((ring: THREE.Mesh, index: number) => {
        (ring.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
        ring.rotation.y += 0.0003 * (index + 1);
        ring.rotation.z += 0.00015 * (index + 1);
      });

      const positions = geometry.attributes.position.array as Float32Array;
      const hues = geometry.attributes.hue.array as Float32Array;
      const phases = geometry.attributes.phase.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2);
        const theta = Math.atan2(positions[i3 + 1], positions[i3]);
        const orbitSpeed = 0.00012 * (0.5 + hues[i] * 0.8);
        
        positions[i3] = radius * Math.cos(theta + orbitSpeed + phases[i] * 0.001);
        positions[i3 + 1] = radius * Math.sin(theta + orbitSpeed + phases[i] * 0.001);
        positions[i3 + 2] += Math.sin(timeRef.current * 0.25 + hues[i] * 4 + phases[i]) * 0.015;
        positions[i3 + 1] += scroll * 0.6 * (0.5 + hues[i]);
      }

      geometry.attributes.position.needsUpdate = true;

      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.0004;
        sphereRef.current.rotation.x += 0.0002;
      }

      if (cameraRef.current) {
        cameraRef.current.position.x += (mouseRef.current.x * 4 - cameraRef.current.position.x) * 0.008;
        cameraRef.current.position.y += (-mouseRef.current.y * 4 - cameraRef.current.position.y) * 0.008;
        cameraRef.current.position.z += (-scroll * 15 - cameraRef.current.position.z + 60) * 0.01;
        cameraRef.current.lookAt(0, scroll * 8, 0);
      }
    };

    animate(animateFn);

    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      setTimeout(() => setRevealed(true), 200);
    };
    img.src = institutionHero.src;

    return () => {
      const canvas = canvasRef.current;
      if (canvas) canvas.removeEventListener("mousemove", handleMouseMove);
      stop();
      geometry.dispose();
      particleMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      ringsRef.current.forEach((r: THREE.Mesh) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
    };
  }, [reduced, context, performanceLevel, prefersReducedMotion]);

  if (reduced || prefersReducedMotion) {
    return (
      <section className={`premium-hero-v2 ${className}`} aria-labelledby="home-hero">
        <div className="hero-bg">
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
            className="hero-img"
          />
        </div>
        <div className="hero-overlay" />
        <HeroContent loaded={true} revealed={true} scrollY={0} />
      </section>
    );
  }

  return (
    <section className={`premium-hero-v2 ${className}`} aria-labelledby="home-hero">
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