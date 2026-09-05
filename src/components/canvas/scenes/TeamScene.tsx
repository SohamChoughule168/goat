"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const TEAM = [
  { name: "Arjun Patel", role: "Founder & CEO", initials: "AP", color: "#14b8a6", skills: ["Architecture", "Performance", "Strategy"] },
  { name: "Meera Krishnan", role: "CTO", initials: "MK", color: "#06b6d4", skills: ["ML Systems", "Distributed Systems", "AI"] },
  { name: "Rohit Verma", role: "VP Engineering", initials: "RV", color: "#10b981", skills: ["Platform Engineering", "DevEx", "Scale"] },
  { name: "Sneha Reddy", role: "Design Director", initials: "SR", color: "#a855f7", skills: ["Design Systems", "Accessibility", "Brand"] },
  { name: "Karan Malhotra", role: "AI Lead", initials: "KM", color: "#f59e0b", skills: ["LLMs", "RAG", "MLOps"] },
  { name: "Ananya Iyer", role: "Head of Delivery", initials: "AI", color: "#ec4899", skills: ["Delivery", "Agile", "Client Success"] },
];

interface TeamSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  hovered: boolean;
  intensity: number;
}

export function TeamScene({ scrollProgress, mousePos, hovered, intensity }: TeamSceneProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const { size } = useThree();

  const sectionProgress = useSectionProgress("team");

  const orbRefs = useRef<Array<THREE.Mesh | null>>([]);
  const orbGroupRef = useRef<THREE.Group>(null);
  const connectionRefs = useRef<Array<THREE.Line | null>>([]);

  const intensityValue = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;
  const finalIntensity = intensity * intensityValue;

  // Orb materials - glass-like spheres
  const orbMaterials = useMemo(() => TEAM.map(member => 
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(member.color),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 1.33,
      transparent: true,
      opacity: 0.7,
      emissive: new THREE.Color(member.color),
      emissiveIntensity: 0.15,
    })
  ), []);

  // Inner core material
  const coreMaterials = useMemo(() => TEAM.map(member => 
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(member.color),
      transparent: true,
      opacity: 0.4,
    })
  ), []);

  // Connection lines
  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.2,
    linewidth: 1,
  }), []);

  // Create orbs
  useEffect(() => {
    if (!orbGroupRef.current) return;
    const group = orbGroupRef.current;
    group.clear();

    // Calculate positions in a hexagonal arrangement
    const positions: THREE.Vector3[] = [];
    const radius = 5;
    TEAM.forEach((_, i) => {
      const angle = (i / TEAM.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 2) * 1.5;
      positions.push(new THREE.Vector3(x, y, z));
    });

    TEAM.forEach((member, i) => {
      const orbGroup = new THREE.Group();
      
      // Outer glass sphere
      const outerGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const outerMesh = new THREE.Mesh(outerGeo, orbMaterials[i].clone());
      orbGroup.add(outerMesh);
      
      // Inner core
      const coreGeo = new THREE.SphereGeometry(0.6, 16, 16);
      const coreMesh = new THREE.Mesh(coreGeo, coreMaterials[i].clone());
      orbGroup.add(coreMesh);
      
      // Glow ring
      const ringGeo = new THREE.TorusGeometry(1.4, 0.03, 8, 64);
      const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: new THREE.Color(member.color),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      }));
      ringMesh.rotation.x = Math.PI / 2;
      orbGroup.add(ringMesh);
      
      orbGroup.position.copy(positions[i]);
      orbGroup.userData = { 
        basePos: orbGroup.position.clone(), 
        member, 
        index: i,
        core: coreMesh,
        ring: ringMesh,
        outer: outerMesh,
      };
      
      group.add(orbGroup);
      orbRefs.current[i] = outerMesh;
    });

    // Create connections between orbs
    for (let i = 0; i < TEAM.length; i++) {
      for (let j = i + 1; j < TEAM.length; j++) {
        const points = [
          positions[i].clone(),
          positions[j].clone(),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMaterial.clone());
        group.add(line);
        connectionRefs.current.push(line);
      }
    }
  }, [orbMaterials, coreMaterials, lineMaterial]);

  // Animate
  useFrame((state, delta) => {
    if (!orbGroupRef.current) return;

    const group = orbGroupRef.current;
    const time = state.clock.elapsedTime;

    // Global rotation based on scroll
    group.rotation.y = sectionProgress * Math.PI * 0.2;
    
    // Mouse parallax
    group.rotation.y += mousePos.x * 0.1;
    group.rotation.x -= mousePos.y * 0.08;

    // Animate each orb
    orbRefs.current.forEach((orb, i) => {
      if (!orb || !orb.parent) return;
      const orbGroup = orb.parent;
      const base = orbGroup.userData.basePos;
      const phase = i * 1.0;
      
      // Floating
      orbGroup.position.y = base.y + Math.sin(time * 0.8 + phase) * 0.5;
      orbGroup.position.x = base.x + Math.cos(time * 0.6 + phase) * 0.3;
      orbGroup.position.z = base.z + Math.sin(time * 0.7 + phase) * 0.3;
      
      // Core pulse
      if (orbGroup.userData.core) {
        const scale = 1 + Math.sin(time * 1.2 + phase) * 0.15;
        orbGroup.userData.core.scale.setScalar(scale);
      }
      
      // Ring rotation
      if (orbGroup.userData.ring) {
        orbGroup.userData.ring.rotation.z += delta * 0.3;
        orbGroup.userData.ring.rotation.y += delta * 0.2;
      }
      
      // Outer sphere subtle rotation
      if (orbGroup.userData.outer) {
        orbGroup.userData.outer.rotation.y += delta * 0.05;
        orbGroup.userData.outer.rotation.x += delta * 0.03;
      }
    });

    // Animate connections
    connectionRefs.current.forEach((line, idx) => {
      if (!line) return;
      const opacity = 0.1 + Math.sin(time * 0.5 + idx * 0.3) * 0.1 * finalIntensity;
      (line.material as THREE.LineBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group ref={orbGroupRef} position={[0, 0, -12]}>
      {/* Orbs */}
      {TEAM.map((member, i) => (
        <Float
          key={member.name}
          speed={1 + i * 0.1}
          rotationIntensity={0.3}
          floatIntensity={0.2}
        >
          <group ref={(el) => { if (el) orbRefs.current[i] = el.children[0] as THREE.Mesh; }}>
            <mesh>
              <sphereGeometry args={[1.2, 32, 32]} />
              <primitive object={orbMaterials[i].clone()} attach="material" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <primitive object={coreMaterials[i].clone()} attach="material" />
            </mesh>
            <mesh>
              <torusGeometry args={[1.4, 0.03, 8, 64]} />
              <primitive object={new THREE.MeshBasicMaterial({
                color: new THREE.Color(member.color),
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
              })} attach="material" />
            </mesh>
          </group>
        </Float>
      ))}
      
      {/* Connection lines */}
      {connectionRefs.current.map((_, idx) => (
        <primitive key={idx} object={connectionRefs.current[idx]!} />
      ))}
    </group>
  );
}

export default TeamScene;