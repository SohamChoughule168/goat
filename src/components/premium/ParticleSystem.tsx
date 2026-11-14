"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface ParticleSystemProps {
  count?: number;
  color?: number;
  size?: number;
  speed?: number;
  area?: { x: number; y: number; z: number };
  blendMode?: "additive" | "normal";
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParticleSystem({
  count = 800,
  color = 0x14d896,
  size = 0.8,
  speed = 0.3,
  area = { x: 40, y: 30, z: 20 },
  blendMode = "additive",
  interactive = true,
  className = "",
  style = {},
}: ParticleSystemProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    setMounted(true);

    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const hues = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * area.x;
      positions[i3 + 1] = (Math.random() - 0.5) * area.y;
      positions[i3 + 2] = (Math.random() - 0.5) * area.z;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      sizes[i] = Math.random() * size + 0.3;
      alphas[i] = Math.random() * 0.5 + 0.1;
      hues[i] = Math.random() * 0.1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("hue", new THREE.BufferAttribute(hues, 1));

    const material = new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: blendMode === "additive" ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Ambient particles (background layer)
    const bgGeometry = new THREE.BufferGeometry();
    const bgCount = Math.floor(count * 0.3);
    const bgPositions = new Float32Array(bgCount * 3);
    const bgSizes = new Float32Array(bgCount);

    for (let i = 0; i < bgCount; i++) {
      const i3 = i * 3;
      bgPositions[i3] = (Math.random() - 0.5) * area.x * 1.5;
      bgPositions[i3 + 1] = (Math.random() - 0.5) * area.y * 1.5;
      bgPositions[i3 + 2] = (Math.random() - 0.5) * area.z * 1.5;
      bgSizes[i] = Math.random() * 0.4 + 0.1;
    }

    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute("size", new THREE.BufferAttribute(bgSizes, 1));

    const bgMaterial = new THREE.PointsMaterial({
      color: 0x14d896,
      size: 0.3,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const bgParticles = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgParticles);

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Animation
    let frame = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      const positions = particles.geometry.attributes.position.array as Float32Array;
      const velocities = particles.geometry.attributes.velocity.array as Float32Array;
      const sizes = particles.geometry.attributes.size.array as Float32Array;
      const hues = particles.geometry.attributes.hue.array as Float32Array;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Float motion
        positions[i3 + 1] += Math.sin(timeRef.current * 0.5 + i) * 0.003;
        positions[i3] += Math.cos(timeRef.current * 0.3 + i) * 0.002;

        // Mouse attraction
        if (interactive) {
          const dx = mouseX * 15 - positions[i3];
          const dy = mouseY * 10 - positions[i3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 20) {
            const force = (1 - dist / 20) * 0.02;
            velocities[i3] += dx * force;
            velocities[i3 + 1] += dy * force;
          }
        }

        // Apply velocity with damping
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        velocities[i3] *= 0.98;
        velocities[i3 + 1] *= 0.98;
        velocities[i3 + 2] *= 0.98;

        // Boundary wrap
        const halfX = area.x / 2;
        const halfY = area.y / 2;
        const halfZ = area.z / 2;

        if (positions[i3] > halfX) positions[i3] = -halfX;
        if (positions[i3] < -halfX) positions[i3] = halfX;
        if (positions[i3 + 1] > halfY) positions[i3 + 1] = -halfY;
        if (positions[i3 + 1] < -halfY) positions[i3 + 1] = halfY;
        if (positions[i3 + 2] > halfZ) positions[i3 + 2] = -halfZ;
        if (positions[i3 + 2] < -halfZ) positions[i3 + 2] = halfZ;

        // Size pulse
        sizes[i] = (Math.sin(timeRef.current * 2 + hues[i] * 10) * 0.3 + 0.7) * (particles.geometry.attributes.size.array as Float32Array)[i];
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;

      // Rotate background
      bgParticles.rotation.y += 0.0001;
      bgParticles.rotation.x += 0.00005;

      // Camera subtle movement
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current!);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reduced]);

  if (!mounted || reduced) return null;

  return (
    <div
      ref={containerRef}
      className={`particle-system ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

ParticleSystem.displayName = "ParticleSystem";