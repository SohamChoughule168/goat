"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

interface FooterCTASceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  hovered: boolean;
  intensity: number;
}

export function FooterCTAScene({ scrollProgress, mousePos, hovered, intensity }: FooterCTASceneProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const { size } = useThree();

  const sectionProgress = useSectionProgress("footer-cta");

  const sunRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Points>(null);
  const ringRefs = useRef<Array<THREE.Mesh | null>>([]);
  const groupRef = useRef<THREE.Group>(null);

  const intensityValue = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;
  const finalIntensity = intensity * intensityValue;

  // Sun material - bright, emissive
  const sunMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  }), []);

  // Moon material - dark with subtle glow
  const moonMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x0a0b0f,
    metalness: 0.3,
    roughness: 0.7,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    emissive: 0x141420,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.95,
  }), []);

  // Corona material - animated gradient
  const coronaMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uColorA: { value: new THREE.Color("#14b8a6") },
      uColorB: { value: new THREE.Color("#a855f7") },
      uColorC: { value: new THREE.Color("#f59e0b") },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void main() {
        float n = fbm(vUv * 5.0 + uTime * 0.1);
        vec3 color = mix(uColorA, uColorB, n);
        color = mix(color, uColorC, n * 0.5);
        
        float edge = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        edge = smoothstep(0.0, 0.5, edge);
        
        float glow = smoothstep(0.8, 1.0, n) * edge;
        color += vec3(glow) * uIntensity;
        
        float alpha = smoothstep(0.3, 0.7, n) * edge * uIntensity;
        gl_FragColor = vec4(color, alpha * 0.6);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  // Ring materials
  const ringMaterials = useMemo(() => [
    new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.2, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.15, side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.15, side: THREE.DoubleSide }),
  ], []);

  // Particle system
  const { positions, colors, sizes, alphas } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    
    const palette = [
      new THREE.Color("#14b8a6"),
      new THREE.Color("#a855f7"),
      new THREE.Color("#f59e0b"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#ffffff"),
    ];
    
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI - Math.PI / 2;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
      
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      
      sizes[i] = 0.02 + Math.random() * 0.08;
      alphas[i] = 0.3 + Math.random() * 0.5;
    }
    return { positions, colors, sizes, alphas };
  }, []);

  // Create scene
  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    group.clear();

    // Sun
    const sunGeo = new THREE.SphereGeometry(2.5, 64, 64);
    const sunMesh = new THREE.Mesh(sunGeo, sunMaterial.clone());
    group.add(sunMesh);
    sunRef.current = sunMesh;

    // Moon (initially offset for eclipse)
    const moonGeo = new THREE.SphereGeometry(2.6, 64, 64);
    const moonMesh = new THREE.Mesh(moonGeo, moonMaterial.clone());
    moonMesh.position.set(5, 0, 0.5);
    group.add(moonMesh);
    moonRef.current = moonMesh;

    // Corona
    const coronaGeo = new THREE.SphereGeometry(3.5, 64, 64);
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMaterial.clone());
    group.add(coronaMesh);
    coronaRef.current = coronaMesh;

    // Rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(4 + i * 1.5, 4.2 + i * 1.5, 64);
      const ringMesh = new THREE.Mesh(ringGeo, ringMaterials[i].clone());
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.rotation.z = i * 0.5;
      group.add(ringMesh);
      ringRefs.current[i] = ringMesh;
    }

    // Particles
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particleGeo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    
    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);
    particleRef.current = particles;
  }, [sunMaterial, moonMaterial, coronaMaterial, ringMaterials]);

  // Animate
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const time = state.clock.elapsedTime;

    // Eclipse animation based on scroll
    // Moon moves across sun as user scrolls through footer
    const eclipseProgress = Math.min(sectionProgress * 2, 1);
    const moonX = THREE.MathUtils.lerp(5, -0.3, eclipseProgress);
    const moonY = Math.sin(eclipseProgress * Math.PI) * 0.5;
    const totality = Math.max(0, 1 - Math.abs(eclipseProgress - 0.5) * 4);

    if (moonRef.current) {
      moonRef.current.position.x = moonX;
      moonRef.current.position.y = moonY;
    }

    // Corona visibility during eclipse
    if (coronaRef.current && coronaRef.current.material) {
      const coronaMat = coronaRef.current.material as THREE.ShaderMaterial;
      coronaMat.uniforms.uTime.value = time;
      coronaMat.uniforms.uIntensity.value = eclipseProgress * finalIntensity;
      coronaRef.current.visible = eclipseProgress > 0.1;
      
      // Scale corona during totality
      coronaRef.current.scale.setScalar(1 + totality * 0.5);
    }

    // Sun glow pulse
    if (sunRef.current) {
      const pulse = 1 + Math.sin(time * 1.5) * 0.05;
      sunRef.current.scale.setScalar(pulse);
      
      // Dim sun during eclipse
      if (eclipseProgress > 0.3 && eclipseProgress < 0.7) {
        (sunRef.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(1, 0.3, totality);
      } else {
        (sunRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
      }
    }

    // Rotate rings
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z += delta * (0.1 + i * 0.05);
        ring.rotation.y += delta * 0.02;
        
        // Pulse opacity during eclipse
        if (eclipseProgress > 0.4 && eclipseProgress < 0.6) {
          (ring.material as THREE.MeshBasicMaterial).opacity = 
            ringMaterials[i].opacity * (1 + Math.sin(time * 3) * 0.5);
        }
      }
    });

    // Particle flow
    if (particleRef.current) {
      particleRef.current.rotation.y += delta * 0.02 * finalIntensity;
      particleRef.current.rotation.x += delta * 0.01 * finalIntensity;
      
      const posAttr = particleRef.current.geometry.getAttribute("position");
      const count = posAttr.count;
      
      for (let i = 0; i < count; i++) {
        const y = posAttr.getY(i);
        const newY = y + delta * 0.5 * finalIntensity;
        if (newY > 5) {
          posAttr.setY(i, -5);
        } else {
          posAttr.setY(i, newY);
        }
      }
      posAttr.needsUpdate = true;
    }

    // Mouse parallax
    group.rotation.y += mousePos.x * 0.05;
    group.rotation.x -= mousePos.y * 0.03;
  });

  return (
    <group ref={groupRef} position={[0, 0, -15]}>
      {/* Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <primitive object={sunMaterial.clone()} attach="material" />
      </mesh>
      
      {/* Moon */}
      <mesh ref={moonRef} position={[5, 0, 0.5]}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <primitive object={moonMaterial.clone()} attach="material" />
      </mesh>
      
      {/* Corona */}
      <mesh ref={coronaRef} scale={1}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <primitive object={coronaMaterial.clone()} attach="material" />
      </mesh>
      
      {/* Rings */}
      {ringMaterials.map((mat, i) => (
        <mesh key={i} ref={(el) => { ringRefs.current[i] = el; }}>
          <ringGeometry args={[4 + i * 1.5, 4.2 + i * 1.5, 64]} />
          <primitive object={mat.clone()} attach="material" />
        </mesh>
      ))}
      
      {/* Particles */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-alpha" args={[alphas, 1]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.6 * finalIntensity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default FooterCTAScene;