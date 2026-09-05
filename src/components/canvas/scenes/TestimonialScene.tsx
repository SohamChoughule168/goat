"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const CARDS = [
  { id: 0, color: "#14b8a6", initials: "PS", title: "Priya Sharma", role: "CTO, FinTech" },
  { id: 1, color: "#06b6d4", initials: "RK", title: "Rajesh Kumar", role: "VP Engineering" },
  { id: 2, color: "#10b981", initials: "AM", title: "Anjali Mehta", role: "VP Product" },
  { id: 3, color: "#f59e0b", initials: "VS", title: "Vikram Singh", role: "Founder" },
  { id: 4, color: "#a855f7", initials: "KN", title: "Dr. Kavya Nair", role: "CTO, HealthTech" },
  { id: 5, color: "#ec4899", initials: "AP", title: "Arjun Patel", role: "VP Growth" },
];

interface TestimonialSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  hovered: boolean;
  intensity: number;
}

export function TestimonialScene({ scrollProgress, mousePos, hovered, intensity }: TestimonialSceneProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const { size } = useThree();

  const sectionProgress = useSectionProgress("testimonials");

  const cardRefs = useRef<Array<THREE.Mesh | null>>([]);
  const cardGroupRef = useRef<THREE.Group>(null);
  const backgroundRef = useRef<THREE.Mesh>(null);

  const intensityValue = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;
  const finalIntensity = intensity * intensityValue;

  // Card material
  const cardMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  }), []);

  // Background sphere
  const bgMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x0a0b0f,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
  }), []);

  // Create cards
  useEffect(() => {
    if (!cardGroupRef.current) return;
    const group = cardGroupRef.current;
    group.clear();

    CARDS.forEach((card, i) => {
      const geometry = new THREE.BoxGeometry(3, 2, 0.15, 4, 4, 1);
      const mesh = new THREE.Mesh(geometry, cardMaterial.clone());
      mesh.position.set(
        (i % 2) * 4 - 2,
        Math.floor(i / 2) * -3 + 2,
        0
      );
      mesh.userData = { basePos: mesh.position.clone(), card };
      group.add(mesh);
      cardRefs.current[i] = mesh;
    });
  }, [cardMaterial]);

  // Animate cards
  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    const group = cardGroupRef.current;
    const time = state.clock.elapsedTime;

    // Subtle rotation based on scroll
    group.rotation.y = sectionProgress * Math.PI * 0.15;
    group.rotation.x = Math.sin(time * 0.2) * 0.05;

    // Mouse parallax
    group.rotation.y += mousePos.x * 0.1;
    group.rotation.x -= mousePos.y * 0.05;

    // Card hover/twave
    cardRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const base = mesh.userData.basePos;
      const phase = i * 0.5;
      
      mesh.position.y = base.y + Math.sin(time * 0.8 + phase) * 0.08;
      mesh.position.x = base.x + Math.cos(time * 0.6 + phase) * 0.05;
      mesh.rotation.z = Math.sin(time * 0.5 + phase) * 0.02;
    });

    // Background pulse
    if (backgroundRef.current) {
      backgroundRef.current.scale.setScalar(1 + Math.sin(time * 0.3) * 0.02);
    }
  });

  return (
    <group ref={cardGroupRef} position={[0, 0, -8]}>
      {/* Background ambient sphere */}
      <mesh ref={backgroundRef} scale={15}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={bgMaterial} attach="material" />
      </mesh>

      {/* Testimonial cards */}
      {CARDS.map((card, i) => (
        <Float
          key={card.id}
          speed={1.2 + i * 0.1}
          rotationIntensity={0.15}
          floatIntensity={0.1}
        >
          <mesh
            ref={(el) => { cardRefs.current[i] = el; }}
            onPointerOver={() => { }}
            onPointerOut={() => { }}
          >
            <boxGeometry args={[3, 2, 0.15, 4, 4, 1]} />
            <primitive object={cardMaterial.clone()} attach="material" />
          </mesh>
        </Float>
      ))}

      {/* Floating particles */}
      <ParticleField count={30} intensity={finalIntensity * 0.5} />
    </group>
  );
}

function ParticleField({ count, intensity }: { count: number; intensity: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const cardColors = CARDS.map(c => new THREE.Color(c.color));
    
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6 - Math.PI * 0.3;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
      
      const c = cardColors[Math.floor(Math.random() * cardColors.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      
      sizes[i] = 0.03 + Math.random() * 0.05;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02 * intensity;
    pointsRef.current.rotation.x += delta * 0.01 * intensity;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.6 * intensity}
      />
    </points>
  );
}

export default TestimonialScene;