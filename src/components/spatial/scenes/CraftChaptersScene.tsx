'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceMonitor } from '@/components/v6/performance-optimizer';
import { useAdaptiveQuality } from '@/components/v6/performance-optimizer';

interface CraftChaptersSceneProps {
  scrollProgress: number;
}

interface CraftPrimitive {
  name: string;
  geometry: 'icosahedron' | 'octahedron' | 'tetrahedron' | 'torusKnot';
  color: string;
  position: [number, number, number];
  description: string;
  href: string;
}

const CRAFT_PRIMITIVES: CraftPrimitive[] = [
  {
    name: 'Web Development',
    geometry: 'icosahedron',
    color: '#14b8a6',
    position: [-8, 0, -8],
    description: 'High-performance web platforms engineered for speed, search visibility, and conversion.',
    href: '/services/web-development',
  },
  {
    name: 'Mobile App Development',
    geometry: 'octahedron',
    color: '#06b6d4',
    position: [8, 0, -8],
    description: 'Native-feel iOS and Android apps from a single senior team. Store launch included.',
    href: '/services/mobile-app-development',
  },
  {
    name: 'AI-Driven Websites',
    geometry: 'tetrahedron',
    color: '#a855f7',
    position: [-8, 0, 8],
    description: 'Interfaces that adapt, answer, and sell while you sleep. AI wired into the product.',
    href: '/services/ai-driven-websites',
  },
  {
    name: 'Website Refurbishment',
    geometry: 'torusKnot',
    color: '#f59e0b',
    position: [8, 0, 8],
    description: 'We rebuild what\'s slowing you down without losing what already works.',
    href: '/services/website-refurbishment',
  },
];

interface CraftChaptersSceneProps {
  scrollProgress: number;
}

export function CraftChaptersScene({ scrollProgress }: CraftChaptersSceneProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();

  const intensity = quality === 'high' ? 1.0 : quality === 'medium' ? 0.7 : 0.4;

  return (
    <group>
      {CRAFT_PRIMITIVES.map((primitive, index) => (
        <CraftPrimitive
          key={primitive.name}
          primitive={primitive}
          index={index}
          scrollProgress={scrollProgress}
          intensity={intensity}
        />
      ))}
      
      <GridLines scrollProgress={scrollProgress} />
      <FloatingParticles count={20} scrollProgress={scrollProgress} />
    </group>
  );
}

function CraftPrimitive({ 
  primitive, 
  index, 
  scrollProgress,
  intensity 
}: { 
  primitive: CraftPrimitive;
  index: number;
  scrollProgress: number;
  intensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { quality } = usePerformanceMonitor();

  const geometry = useMemo(() => {
    switch (primitive.geometry) {
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(2, 2);
      case 'octahedron':
        return new THREE.OctahedronGeometry(2);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(2.5);
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
      default:
        return new THREE.IcosahedronGeometry(2, 2);
    }
  }, [primitive.geometry]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: primitive.color,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
  }, [primitive.color]);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    const group = groupRef.current;
    const mesh = meshRef.current;

    // Float animation
    group.position.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
    
    // Rotation
    mesh.rotation.y += delta * 0.15;
    mesh.rotation.x += delta * 0.05;

    // Scroll-driven position
    const scrollFactor = smoothstep(0, 1, scrollProgress);
    group.position.y = THREE.MathUtils.lerp(-10, primitive.position[1], 1 - scrollFactor);
    group.position.x = THREE.MathUtils.lerp(0, primitive.position[0], 1 - scrollFactor);
    group.position.z = THREE.MathUtils.lerp(0, primitive.position[2], 1 - scrollFactor);

    // Rotation based on scroll
    group.rotation.y = scrollProgress * Math.PI * 0.5;
  });

  // Smoothstep function
  function smoothstep(edge0: number, edge1: number, x: number) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  return (
    <group ref={groupRef} position={primitive.position}>
      <mesh ref={meshRef}>
        <primitive object={geometry} attach="geometry" />
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <primitive object={geometry.clone()} attach="geometry" />
        <meshBasicMaterial
          color={primitive.color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Label */}
      <Html
        position={[0, -4, 0]}
        transform
        className="primitive-label"
        style={{
          color: primitive.color,
          fontSize: '0.75rem',
          fontWeight: 600,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 10px currentColor',
        }}
      >
        {primitive.name}
      </Html>
    </group>
  );
}

function GridLines({ scrollProgress }: { scrollProgress: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(40 * 3 * 2);
    const colors = new Float32Array(40 * 3 * 2);
    
    let idx = 0;
    const gridSize = 40;
    const step = 2;
    
    // Grid lines in X direction
    for (let i = -gridSize/2; i <= gridSize/2; i += step) {
      // Line along Z
      positions[idx++] = -gridSize/2; positions[idx++] = 0; positions[idx++] = i;
      positions[idx++] = gridSize/2; positions[idx++] = 0; positions[idx++] = i;
      colors[idx++] = 0.08; colors[idx++] = 0.72; colors[idx++] = 0.65;
      colors[idx++] = 0.08; colors[idx++] = 0.72; colors[idx++] = 0.65;
      
      // Line along X
      positions[idx++] = i; positions[idx++] = 0; positions[idx++] = -gridSize/2;
      positions[idx++] = i; positions[idx++] = 0; positions[idx++] = gridSize/2;
      colors[idx++] = 0.08; colors[idx++] = 0.72; colors[idx++] = 0.65;
      colors[idx++] = 0.08; colors[idx++] = 0.72; colors[idx++] = 0.65;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ 
        vertexColors: true, 
        transparent: true, 
        opacity: 0.3,
        depthWrite: false,
      })
    );
  }, []);

  useFrame((state, delta) => {
    if (!linesRef.current) return;
    
    // Fade with scroll
    const opacity = Math.max(0, 1 - scrollProgress * 1.5);
    (linesRef.current.material as THREE.LineBasicMaterial).opacity = opacity * 0.3;
    
    // Subtle animation
    linesRef.current.rotation.y += delta * 0.005;
  });

  return (
    <primitive object={lines} ref={linesRef} />
  );
}

function FloatingParticles({ count, scrollProgress }: { count: number; scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, scales, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 10;
      const theta = (i / count) * Math.PI * 2;
      const phi = Math.random() * Math.PI - Math.PI / 2;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
      scales[i] = 0.02 + Math.random() * 0.04;
      
      const color = new THREE.Color();
      color.setHSL(0.45 + Math.random() * 0.15, 0.7, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, scales, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.01;
    pointsRef.current.scale.setScalar(1 - scrollProgress * 0.5);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.5}
        vertexColors
      />
    </points>
  );
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}