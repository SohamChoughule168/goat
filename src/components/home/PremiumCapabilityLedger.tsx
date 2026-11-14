"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { ArrowUpRight } from "lucide-react";
import { getServicesByPillar, pillars } from "@/content/services";
import type { PillarSlug } from "@/content/services";
import { useThreeCanvas, getParticleCount } from "@/components/premium/ThreeProvider";

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
  build: new THREE.Color(0x14d896),
  grow: new THREE.Color(0x3b82f6),
  content: new THREE.Color(0xd946ef),
  enable: new THREE.Color(0xf59e0b),
};

function buildLedgerGroups() {
  let counter = 0;

  return pillars.map((pillar) => ({
    pillar,
    services: getServicesByPillar(pillar.slug as PillarSlug).map((service) => {
      counter += 1;
      return {
        service,
        number: String(counter).padStart(2, "0"),
      };
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
  const { canvasRef, context, performanceLevel } = useThreeCanvas(`capability-card-${service.slug}`, { cameraZ: 8 });
  const meshRef = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!context) return;

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("card", performanceLevel);

    // Central morphing geometry
    const geometry = new THREE.IcosahedronGeometry(1.2, 4);
    const material = new THREE.MeshPhysicalMaterial({
      color: pillarColor,
      metalness: 0,
      roughness: 0.3,
      transmission: 0.3,
      thickness: 0.5,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Glow sphere
    const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: pillarColor,
      transparent: true,
      opacity: 0,
      depthWrite: false,
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
      const radius = 2.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    pGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometryRef.current = pGeometry;

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeometry, particleMaterial);
    particles.position.y = 0;
    scene.add(particles);
    particlesRef.current = particles;

    const animateFn = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.x = Math.sin(performance.now() * 0.0005) * 0.1;
      }

      if (glowRef.current) {
        const pulse = Math.sin(performance.now() * 0.003) * 0.5 + 0.5;
        if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
          glowRef.current.material.opacity = 0.1 + pulse * 0.3;
        }
        glowRef.current.scale.setScalar(1 + Math.sin(performance.now() * 0.002) * 0.1);
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0001;
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
    <div className={`ledger-card-3d ${featured ? "ledger-card-3d--featured" : ""} magnetic specular`} 
         onMouseEnter={() => setHovered(true)} 
         onMouseLeave={() => setHovered(false)}>
      <div className="ledger-card-3d-canvas">
        <canvas ref={canvasRef} className="ledger-card-canvas" aria-hidden="true" />
        <div className="ledger-card-glow" aria-hidden="true" />
      </div>
      <div className="ledger-card-content">
        <span className="ledger-index inst-num ledger-index-premium">{number}</span>
        <Link href={`/services/${service.slug}`} className="ledger-link magnetic specular">
          <span className="ledger-title">{service.title}</span>
          <span className="ledger-outcome">{outcomes[service.slug] ?? service.tagline}</span>
        </Link>
        <span className="ledger-arrow ledger-arrow-premium" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </span>
      </div>
      <div className={`ledger-card-specular specular ${hovered ? "active" : ""}`} aria-hidden="true" />
    </div>
  );
}

export default function CapabilityLedger() {
  return (
    <div className="ledger-table-wrapper overflow-hidden">
      <div className="ledger-3d-grid">
        {ledgerGroups.map(({ pillar, services }) => (
          <div key={pillar.slug} className="ledger-group-3d">
            <div className="ledger-group-header ledger-group-header-premium magnetic specular">
              <span className="ledger-group-index inst-num">{pillar.index}</span>
              <span className="ledger-group-name">{pillar.title}</span>
              <span className="ledger-group-kicker">{pillar.kicker}</span>
            </div>
            <div className="ledger-cards-row">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}