"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getServicesByPillar, pillars } from "@/content/services";
import type { PillarSlug } from "@/content/services";
import { useThreeCanvas, getParticleCount, getGeometryDetail } from "@/components/premium";
import { DESIGN_COLORS, MOTION_VARIANTS, INTERACTIONS, SPRINGS } from "@/components/premium";

const outcomes: Record<string, string> = {
  "web-development": "A fast public site that carries the institution, not just describes it.",
  "mobile-app-development": "Student and parent access in the pocket, not another browser tab.",
  "ai-driven-websites": "Content and enquiry routing that answer before staff do.",
  "website-refurbishment": "An existing site brought back to speed, accessibility and credibility.",
  "digital-marketing": "Acquisition strategy tied to admissions, not impressions.",
  "social-media-marketing": "A consistent local presence without branch-level drift.",
  sem: "Paid search that buys intent, with cost per enquiry visible.",
  "generative-engine-optimization": "Presence in AI answers where parents now shortlist.",
  "answer-engine-optimization": "Structured answers for search surfaces that summarise.",
  "meta-advertising": "Campaigns that route to a named follow-up owner.",
  "google-business-profile": "Local discovery that matches the campus parents search for.",
  "google-marketplace": "Listings and offers that convert nearby demand.",
  "brand-management": "One identity and template system every branch can use.",
  "video-editing": "Consistent motion and video without an in-house edit desk.",
  "thumbnail-design": "Clicks earned honestly, with a repeatable visual system.",
  "online-events": "Webinars and open days that run without a production crew.",
  "google-ai-integration": "AI wired into the tools staff already use, with guardrails.",
  "talent-acquisition": "A hiring path that reflects the institution's standards.",
};

const pillarColors: Record<string, THREE.Color> = {
  build: new THREE.Color(DESIGN_COLORS.primary.main),
  grow: new THREE.Color(DESIGN_COLORS.secondary.main),
  content: new THREE.Color(DESIGN_COLORS.accent.purple),
  enable: new THREE.Color(DESIGN_COLORS.accent.orange),
};

function buildLedgerGroups() {
  let counter = 0;
  return pillars.map((pillar) => ({
    pillar,
    services: getServicesByPillar(pillar.slug as PillarSlug).map((service) => {
      counter += 1;
      return { service, number: String(counter).padStart(2, "0") };
    }),
  }));
}

const ledgerGroups = buildLedgerGroups();

interface CapabilityCard3DProps {
  service: { slug: string; title: string; tagline: string };
  number: string;
  pillarColor: THREE.Color;
  index: number;
  featured?: boolean;
}

function CapabilityCard3D({ service, number, pillarColor, index, featured }: CapabilityCard3DProps) {
  const [hovered, setHovered] = useState(false);
  const { canvasRef, context, performanceLevel } = useThreeCanvas(`capability-${service.slug}`, { cameraZ: 8 });
  const meshRef = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!context) return;

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("card", performanceLevel);
    const sphereDetail = getGeometryDetail("sphere", performanceLevel);

    // Central mesh with physical material
    const geometry = new THREE.IcosahedronGeometry(1.3, sphereDetail);
    const material = new THREE.MeshPhysicalMaterial({
      color: pillarColor,
      metalness: featured ? 0.1 : 0,
      roughness: 0.25,
      transmission: 0.35,
      thickness: 0.5,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 1.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Glow sphere
    const glowGeometry = new THREE.SphereGeometry(1.7, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: pillarColor },
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
          float pulse = sin(uTime * 0.8) * 0.3 + 0.7;
          vec3 color = uColor * pulse;
          float alpha = fresnel * 0.18 * pulse;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);
    glowRef.current = glow;

    // Ambient particles
    const pGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 2.2 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.004;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.004;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;

      sizes[i] = Math.random() * 0.12 + 0.04;
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    pGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometryRef.current = pGeometry;

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeometry, particleMaterial);
    particles.position.y = 0;
    scene.add(particles);
    particlesRef.current = particles;

    const animateFn = () => {
      const time = performance.now() * 0.001;

      if (meshRef.current) {
        meshRef.current.rotation.y += 0.0008;
        meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.08;
      }

      if (glowRef.current && glowRef.current.material instanceof THREE.ShaderMaterial) {
        glowRef.current.material.uniforms.uTime.value = time;
        glowRef.current.scale.setScalar(1 + Math.sin(time * 0.6) * 0.08);
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.00005;
      }
    };

    animate(animateFn);

    return () => {
      stop();
      if (meshRef.current) meshRef.current.geometry.dispose();
      if (meshRef.current && meshRef.current.material instanceof THREE.Material) meshRef.current.material.dispose();
      if (glowRef.current) {
        glowRef.current.geometry.dispose();
        if (glowRef.current.material instanceof THREE.Material) glowRef.current.material.dispose();
      }
      if (geometryRef.current) geometryRef.current.dispose();
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        if (particlesRef.current.material instanceof THREE.Material) particlesRef.current.material.dispose();
      }
    };
  }, [pillarColor, context, performanceLevel]);

  return (
    <motion.div 
      className={`ledger-card-v2 ${featured ? "ledger-card-v2--featured" : ""}`}
      variants={MOTION_VARIANTS.card}
      {...INTERACTIONS.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="ledger-card-canvas">
        <canvas ref={canvasRef} className="ledger-card-canvas" aria-hidden="true" />
        <div className="ledger-card-glow" aria-hidden="true" />
      </div>
      <div className="ledger-card-content">
        <span className="ledger-index">{number}</span>
        <Link href={`/services/${service.slug}`} className="ledger-link" {...INTERACTIONS.link}>
          <span className="ledger-title">{service.title}</span>
          <span className="ledger-outcome">{outcomes[service.slug] ?? service.tagline}</span>
        </Link>
        <span className="ledger-arrow" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      </div>
      <div className={`ledger-card-specular ${hovered ? "active" : ""}`} aria-hidden="true" />
    </motion.div>
  );
}

export default function PremiumCapabilityLedgerV2() {
  return (
    <motion.div 
      className="capability-ledger-v2" 
      variants={MOTION_VARIANTS.section}
    >
      <motion.div className="ledger-3d-grid" variants={MOTION_VARIANTS.staggerContainer}>
        {ledgerGroups.map(({ pillar, services }, groupIndex) => (
          <motion.div 
            key={pillar.slug} 
            className="ledger-group-v2"
            variants={MOTION_VARIANTS.staggerItem}
            custom={{ delay: groupIndex * 0.1 }}
          >
            <motion.div 
              className="ledger-group-header glass-morph"
              variants={MOTION_VARIANTS.staggerItem}
              {...INTERACTIONS.magnetic}
            >
              <span className="group-index">{pillar.index}</span>
              <span className="group-name">{pillar.title}</span>
              <span className="group-kicker">{pillar.kicker}</span>
            </motion.div>
            <motion.div 
              className="ledger-cards-row" 
              variants={MOTION_VARIANTS.staggerContainer}
            >
              {services.map(({ service, number }, index) => (
                <CapabilityCard3D
                  key={service.slug}
                  service={service}
                  number={number}
                  pillarColor={pillarColors[pillar.slug]}
                  index={index}
                  featured={service.slug === "web-development"}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}