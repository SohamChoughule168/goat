"use client";

/**
 * CRAFT CHAPTERS 3D SCENE
 * 
 * Four floating geometry primitives, each representing a service:
 * - Web: Icosahedron (connection, network)
 * - Mobile: Cube (structure, architecture)
 * - AI: TorusKnot (intelligence, complexity)
 * - Refurb: Octahedron (refinement, transformation)
 * 
 * Behavior:
 * - Slow rotation on Y-axis
 * - Float gently up and down
 * - On scroll, they align into a grid formation
 * - On hover, they emit particles
 */

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface PrimitiveProps {
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  color: string;
  scrollProgress: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

function ServicePrimitive({
  position,
  geometry,
  color,
  scrollProgress,
  isHovered,
  onHover,
}: PrimitiveProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // Slow continuous rotation
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

    // Float
    const floatY = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.1;
    groupRef.current.position.y = position[1] + floatY;

    // Scroll-driven alignment to grid
    // 0-0.5: scattered, 0.5-1: aligned in grid
    const alignmentProgress = THREE.MathUtils.smoothstep(scrollProgress, 0.3, 0.7);
    const targetX = position[0] * (1 - alignmentProgress);
    const targetZ = position[2] * (1 - alignmentProgress);
    const targetY = position[1] + floatY + (alignmentProgress * (1 - position[1] * 0.5));
    
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x, 
      targetX, 
      0.05
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z, 
      targetZ, 
      0.05
    );

    // Hover effect: scale up
    const targetScale = isHovered ? 1.3 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.8 : 0.2}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glow ring */}
      {isHovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

export function CraftChaptersScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Pre-create geometries
  const geometries = useMemo(() => {
    return {
      web: new THREE.IcosahedronGeometry(0.5, 1),
      mobile: new THREE.BoxGeometry(0.7, 0.7, 0.7),
      ai: new THREE.TorusKnotGeometry(0.35, 0.12, 64, 8),
      refurb: new THREE.OctahedronGeometry(0.6, 0),
    };
  }, []);

  // Pre-configured positions (scattered initially)
  const primitives = useMemo(() => [
    { 
      name: "Web",
      geometry: geometries.web, 
      color: "#14b8a6",
      position: [-3, 0.5, -1] as [number, number, number],
    },
    {
      name: "Mobile",
      geometry: geometries.mobile,
      color: "#06b6d4",
      position: [-1, -0.5, 1] as [number, number, number],
    },
    {
      name: "AI",
      geometry: geometries.ai,
      color: "#a855f7",
      position: [1, 0.5, 1.5] as [number, number, number],
    },
    {
      name: "Refurb",
      geometry: geometries.refurb,
      color: "#f59e0b",
      position: [3, -0.5, -1] as [number, number, number],
    },
  ], [geometries]);

  return (
    <group>
      {primitives.map((p, i) => (
        <ServicePrimitive
          key={p.name}
          position={p.position}
          geometry={p.geometry}
          color={p.color}
          scrollProgress={scrollProgress}
          isHovered={hoveredIndex === i}
          onHover={(h) => setHoveredIndex(h ? i : null)}
        />
      ))}
      
      {/* Ambient particles for depth */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#a855f7" />
    </group>
  );
}
