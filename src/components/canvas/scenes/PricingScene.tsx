"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const TIERS = [
  { name: "Launch", color: "#14b8a6", y: 2, z: 0 },
  { name: "Scale", color: "#a855f7", y: 0, z: -3, popular: true },
  { name: "Enterprise", color: "#f59e0b", y: -2, z: 0 },
];

interface PricingSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  hovered: boolean;
  intensity: number;
}

export function PricingScene({ scrollProgress, mousePos, hovered, intensity }: PricingSceneProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const { size } = useThree();

  const sectionProgress = useSectionProgress("pricing");

  const tierRefs = useRef<Array<THREE.Group | null>>([]);
  const tierGroupRef = useRef<THREE.Group>(null);

  const intensityValue = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;
  const finalIntensity = intensity * intensityValue;

  // Materials
  const cardMaterials = useMemo(() => TIERS.map(tier => 
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(tier.color),
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(tier.color),
      emissiveIntensity: 0.1,
    })
  ), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.9,
    thickness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
    ior: 1.5,
    transparent: true,
    opacity: 0.3,
  }), []);

  const ringMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  }), []);

  // Create tiers
  useEffect(() => {
    if (!tierGroupRef.current) return;
    const group = tierGroupRef.current;
    group.clear();

    TIERS.forEach((tier, i) => {
      const tierGroup = new THREE.Group();
      
      // Main card (rounded box)
      const cardGeo = new THREE.BoxGeometry(4, 5, 0.3, 8, 10, 2);
      const cardMesh = new THREE.Mesh(cardGeo, cardMaterials[i].clone());
      tierGroup.add(cardMesh);
      
      // Glass overlay
      const glassGeo = new THREE.BoxGeometry(4.05, 5.05, 0.35, 8, 10, 2);
      const glassMesh = new THREE.Mesh(glassGeo, glassMaterial.clone());
      tierGroup.add(glassMesh);
      
      // Floating ring for popular tier
      if (tier.popular) {
        const ringGeo = new THREE.TorusGeometry(2.8, 0.05, 8, 64);
        const ringMesh = new THREE.Mesh(ringGeo, ringMaterial.clone());
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.z = 0.5;
        tierGroup.add(ringMesh);
        ringMesh.userData = { isRing: true, baseRotation: 0 };
      }
      
      // Position
      tierGroup.position.set(i * 6 - 6, tier.y, tier.z);
      tierGroup.userData = { basePos: tierGroup.position.clone(), tier };
      
      group.add(tierGroup);
      tierRefs.current[i] = tierGroup;
    });
  }, [cardMaterials, glassMaterial, ringMaterial]);

  // Animate
  useFrame((state, delta) => {
    if (!tierGroupRef.current) return;

    const group = tierGroupRef.current;
    const time = state.clock.elapsedTime;

    // Global rotation based on scroll
    group.rotation.y = sectionProgress * Math.PI * 0.1;
    
    // Mouse parallax
    group.rotation.y += mousePos.x * 0.15;
    group.rotation.x -= mousePos.y * 0.1;

    // Animate each tier
    tierRefs.current.forEach((tierGroup, i) => {
      if (!tierGroup) return;
      const base = tierGroup.userData.basePos;
      const phase = i * 1.2;
      
      // Floating animation
      tierGroup.position.y = base.y + Math.sin(time * 0.7 + phase) * 0.3;
      tierGroup.position.x = base.x + Math.cos(time * 0.5 + phase) * 0.2;
      tierGroup.rotation.z = Math.sin(time * 0.4 + phase) * 0.03;
      tierGroup.rotation.x = Math.cos(time * 0.6 + phase) * 0.05;
      
      // Pulse popular tier
      if (TIERS[i].popular) {
        tierGroup.scale.setScalar(1 + Math.sin(time * 1.5) * 0.03);
        
        // Rotate ring
        tierGroup.children.forEach(child => {
          if (child.userData.isRing) {
            child.rotation.z += delta * 0.5;
          }
        });
      }
    });

    // Ambient particles
    if (ambientParticlesRef.current) {
      ambientParticlesRef.current.rotation.y += delta * 0.03 * finalIntensity;
    }
  });

  const ambientParticlesRef = useRef<THREE.Points>(null);

  // Ambient particles
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    const colors = new Float32Array(50 * 3);
    const sizes = new Float32Array(50);
    const tierColors = TIERS.map(t => new THREE.Color(t.color));
    
    for (let i = 0; i < 50; i++) {
      const r = 10 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI - Math.PI / 2;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
      
      const c = tierColors[Math.floor(Math.random() * tierColors.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      
      sizes[i] = 0.04 + Math.random() * 0.06;
    }
    return { positions, colors, sizes };
  }, []);

  useEffect(() => {
    if (ambientParticlesRef.current) {
      ambientParticlesRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      ambientParticlesRef.current.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      ambientParticlesRef.current.geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    }
  }, [positions, colors, sizes]);

  return (
    <group ref={tierGroupRef} position={[0, 0, -10]}>
      {/* Tier cards */}
      {TIERS.map((tier, i) => (
        <Float
          key={tier.name}
          speed={1 + i * 0.15}
          rotationIntensity={0.2}
          floatIntensity={0.15}
        >
          <group ref={(el) => { tierRefs.current[i] = el; }}>
            <mesh>
              <boxGeometry args={[4, 5, 0.3, 8, 10, 2]} />
              <primitive object={cardMaterials[i].clone()} attach="material" />
            </mesh>
            <mesh>
              <boxGeometry args={[4.05, 5.05, 0.35, 8, 10, 2]} />
              <primitive object={glassMaterial.clone()} attach="material" />
            </mesh>
            {tier.popular && (
              <mesh>
                <torusGeometry args={[2.8, 0.05, 8, 64]} />
                <primitive object={ringMaterial.clone()} attach="material" />
              </mesh>
            )}
          </group>
        </Float>
      ))}
      
      {/* Ambient particles */}
      <points ref={ambientParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.5 * finalIntensity}
        />
      </points>
    </group>
  );
}

export default PricingScene;