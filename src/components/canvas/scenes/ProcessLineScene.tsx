"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalScrollProgress, useSectionProgress } from "@/components/canvas/Tunnel";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

const STEPS = [
  { n: "01", title: "Discovery & Audit", color: "#14b8a6", duration: "Week 1" },
  { n: "02", title: "Strategy & Scope", color: "#a855f7", duration: "Week 1–2" },
  { n: "03", title: "Execution & Delivery", color: "#f59e0b", duration: "Week 2–8" },
  { n: "04", title: "Launch & Ownership", color: "#ec4899", duration: "Launch" },
];

interface ProcessLineSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  hovered: boolean;
  intensity: number;
}

export function ProcessLineScene({ scrollProgress, mousePos, hovered, intensity }: ProcessLineSceneProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  const { size } = useThree();

  const sectionProgress = useSectionProgress("process");

  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const pathRef = useRef<THREE.Line | null>(null);
  const particleRefs = useRef<Array<THREE.Points | null>>([]);
  const groupRef = useRef<THREE.Group>(null);

  const intensityValue = quality === "high" ? 1.0 : quality === "medium" ? 0.7 : 0.4;
  const finalIntensity = intensity * intensityValue;

  // Materials
  const nodeMaterials = useMemo(() => STEPS.map(step => 
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(step.color),
      metalness: 0.2,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(step.color),
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.95,
    })
  ), []);

  const pathMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.4,
    linewidth: 3,
  }), []);

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
  }), []);

  // Create path and nodes
  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    group.clear();

    // Create curved path
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-4, 2, 1),
      new THREE.Vector3(4, -2, -1),
      new THREE.Vector3(10, 0, 0),
    ]);

    // Path line
    const pathPoints = curve.getPoints(100);
    const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathLine = new THREE.Line(pathGeo, pathMaterial.clone());
    group.add(pathLine);
    pathRef.current = pathLine;

    // Glow path (thicker, lower opacity)
    const glowGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const glowLine = new THREE.Line(glowGeo, new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.1,
      linewidth: 8,
    }));
    group.add(glowLine);

    // Nodes at path points
    const nodePositions = [
      curve.getPoint(0),
      curve.getPoint(0.33),
      curve.getPoint(0.66),
      curve.getPoint(1),
    ];

    STEPS.forEach((step, i) => {
      const nodeGroup = new THREE.Group();
      
      // Main node sphere
      const nodeGeo = new THREE.SphereGeometry(0.8, 32, 32);
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMaterials[i].clone());
      nodeGroup.add(nodeMesh);
      
      // Outer glow ring
      const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 64);
      const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: new THREE.Color(step.color),
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      }));
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);
      
      // Pulse ring
      const pulseGeo = new THREE.RingGeometry(1.1, 1.5, 32);
      const pulseMesh = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({
        color: new THREE.Color(step.color),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      }));
      pulseMesh.rotation.x = -Math.PI / 2;
      nodeGroup.add(pulseMesh);
      pulseMesh.userData = { isPulse: true };
      
      nodeGroup.position.copy(nodePositions[i]);
      nodeGroup.userData = { 
        basePos: nodeGroup.position.clone(), 
        step, 
        index: i,
        ring: ringMesh,
        pulse: pulseMesh,
        curvePoint: nodePositions[i],
      };
      
      group.add(nodeGroup);
      nodeRefs.current[i] = nodeMesh;
    });

    // Particles flowing along path
    for (let p = 0; p < 20; p++) {
      const particles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({
          color: STEPS[p % STEPS.length].color,
          size: 0.15,
          transparent: true,
          opacity: 0.6,
          sizeAttenuation: true,
        })
      );
      group.add(particles);
      particleRefs.current[p] = particles;
    }
  }, [nodeMaterials, pathMaterial, glowMaterial]);

  // Animate particles along path
  useEffect(() => {
    if (!groupRef.current || !pathRef.current) return;
    
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-4, 2, 1),
      new THREE.Vector3(4, -2, -1),
      new THREE.Vector3(10, 0, 0),
    ]);

    particleRefs.current.forEach((particles, p) => {
      if (!particles) return;
      const count = 8;
      const positions = new Float32Array(count * 3);
      const alphas = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        const t = ((p / 20) + (i / count) * 0.05) % 1;
        const point = curve.getPoint(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
        alphas[i] = 1 - i / count;
      }
      
      particles.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particles.geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    });
  }, []);

  // Animate
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const time = state.clock.elapsedTime;

    // Global rotation based on scroll
    group.rotation.y = sectionProgress * Math.PI * 0.05;
    group.rotation.x = Math.sin(time * 0.1) * 0.05;
    
    // Mouse parallax
    group.rotation.y += mousePos.x * 0.05;
    group.rotation.x -= mousePos.y * 0.03;

    // Animate nodes
    nodeRefs.current.forEach((node, i) => {
      if (!node || !node.parent) return;
      const nodeGroup = node.parent;
      const base = nodeGroup.userData.basePos;
      const phase = i * 1.5;
      
      // Subtle float
      nodeGroup.position.y = base.y + Math.sin(time * 0.7 + phase) * 0.3;
      nodeGroup.position.x = base.x + Math.cos(time * 0.5 + phase) * 0.2;
      
      // Pulse ring
      if (nodeGroup.userData.pulse) {
        const pulse = nodeGroup.userData.pulse;
        const scale = 1 + Math.sin(time * 1 + phase) * 0.3;
        pulse.scale.setScalar(scale);
        (pulse.material as THREE.MeshBasicMaterial).opacity = 0.3 * Math.abs(Math.sin(time * 1 + phase));
      }
      
      // Ring rotation
      if (nodeGroup.userData.ring) {
        nodeGroup.userData.ring.rotation.z += delta * 0.4;
      }
      
      // Node scale pulse based on scroll progress
      const nodeProgress = (i + 1) / STEPS.length;
      const active = sectionProgress > (nodeProgress - 0.15);
      const targetScale = active ? 1.2 : 1.0;
      nodeGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      
      // Emissive pulse when active
      if (active) {
        (node.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;
      } else {
        (node.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.2;
      }
    });

    // Move particles along path
    if (pathRef.current) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(-4, 2, 1),
        new THREE.Vector3(4, -2, -1),
        new THREE.Vector3(10, 0, 0),
      ]);

      particleRefs.current.forEach((particles, p) => {
        if (!particles) return;
        const posAttr = particles.geometry.getAttribute("position");
        const alphaAttr = particles.geometry.getAttribute("alpha");
        const count = posAttr.count;
        
        for (let i = 0; i < count; i++) {
          const t = ((p / 20) + (time * 0.05) + (i / count) * 0.05) % 1;
          const point = curve.getPoint(t);
          posAttr.setXYZ(i, point.x, point.y, point.z);
        }
        posAttr.needsUpdate = true;
      });
    }

    // Path glow pulse
    if (pathRef.current) {
      const opacity = 0.2 + Math.sin(time * 0.8) * 0.2 * finalIntensity;
      (pathRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -8]}>
      {/* Path with glow */}
      {pathRef.current && <primitive object={pathRef.current} />}
      
      {/* Nodes */}
      {STEPS.map((step, i) => (
        <Float
          key={step.n}
          speed={1.2 + i * 0.1}
          rotationIntensity={0.15}
          floatIntensity={0.1}
        >
          <group ref={(el) => { if (el) nodeRefs.current[i] = el.children[0] as THREE.Mesh; }}>
            <mesh>
              <sphereGeometry args={[0.8, 32, 32]} />
              <primitive object={nodeMaterials[i].clone()} attach="material" />
            </mesh>
            <mesh>
              <torusGeometry args={[1.2, 0.05, 8, 64]} />
              <primitive object={new THREE.MeshBasicMaterial({
                color: new THREE.Color(step.color),
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
              })} attach="material" />
            </mesh>
            <mesh>
              <ringGeometry args={[1.1, 1.5, 32]} />
              <primitive object={new THREE.MeshBasicMaterial({
                color: new THREE.Color(step.color),
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
              })} attach="material" />
            </mesh>
          </group>
        </Float>
      ))}
      
      {/* Flowing particles */}
      {particleRefs.current.map((_, p) => (
        <primitive key={p} object={particleRefs.current[p]!} />
      ))}
    </group>
  );
}

export default ProcessLineScene;