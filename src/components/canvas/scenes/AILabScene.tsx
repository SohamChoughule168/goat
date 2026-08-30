"use client";

/**
 * AI LAB 3D NEURAL NETWORK
 * 
 * Real 3D neural network visualization with:
 * - 3 layers: input (8) → hidden (12) → output (6)
 * - Animated signal pulses traveling through connections
 * - Interactive: hover over a node to see its activation
 * - Scroll-driven: rotates as user scrolls the section
 */

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface NeuralNodeProps {
  position: [number, number, number];
  label: string;
  activation: number;
  onHover: (label: string | null) => void;
  isHovered: boolean;
}

function NeuralNode({ position, label, activation, onHover, isHovered }: NeuralNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current) return;
    
    // Pulse with activation
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * activation;
    meshRef.current.scale.setScalar(scale);
    
    // Hover ring
    if (isHovered) {
      ringRef.current.scale.setScalar(1.5);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 
        THREE.MathUtils.lerp(
          (ringRef.current.material as THREE.MeshBasicMaterial).opacity, 
          0.5, 
          0.1
        );
    } else {
      ringRef.current.scale.setScalar(1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 
        THREE.MathUtils.lerp(
          (ringRef.current.material as THREE.MeshBasicMaterial).opacity, 
          0, 
          0.1
        );
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(label)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? "#ffffff" : "#14b8a6"}
          emissive={isHovered ? "#14b8a6" : "#14b8a6"}
          emissiveIntensity={isHovered ? 1.5 : 0.5}
        />
      </mesh>
      
      {/* Hover ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0} />
      </mesh>
      
      {/* Label */}
      {isHovered && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

interface NeuralConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  signalProgress: number;
  intensity: number;
}

function NeuralConnection({ start, end, signalProgress, intensity }: NeuralConnectionProps) {
  const lineRef = useRef<THREE.Line>(null);
  const signalRef = useRef<THREE.Mesh>(null);

  // Create the line geometry
  const lineGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [start, end]);

  useFrame(() => {
    if (!signalRef.current) return;
    // Move signal along the line
    const t = (signalProgress * 2) % 1; // cycle 0-1
    const pos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
      t
    );
    signalRef.current.position.copy(pos);
    (signalRef.current.material as THREE.MeshBasicMaterial).opacity = 
      Math.sin(t * Math.PI) * intensity; // fade in/out
  });

  return (
    <group>
      {/* Connection line */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: "#14b8a6", transparent: true, opacity: 0.15 * intensity }))} ref={lineRef} />
      
      {/* Signal pulse */}
      <mesh ref={signalRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent />
      </mesh>
    </group>
  );
}

export function NeuralNetworkScene({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Layer configuration
  const layers = [
    { name: "input", y: 1.5, nodes: 8, labels: ["Query", "Context", "History", "Intent", "Entity", "Sentiment", "Topic", "Style"] },
    { name: "hidden", y: 0, nodes: 12, labels: Array(12).fill(0).map((_, i) => `H${i + 1}`) },
    { name: "output", y: -1.5, nodes: 6, labels: ["Response", "Action", "Confidence", "Source", "Format", "Tone"] },
  ];

  // Generate node positions
  const nodePositions = useMemo(() => {
    const positions: Array<{
      id: string;
      position: [number, number, number];
      label: string;
      layer: number;
      index: number;
    }> = [];
    
    layers.forEach((layer, layerIdx) => {
      const spacing = 2.4 / (layer.nodes - 1);
      for (let i = 0; i < layer.nodes; i++) {
        positions.push({
          id: `${layer.name}-${i}`,
          position: [layerIdx * 2.5 - 2.5, layer.y, i * spacing - 1.2],
          label: layer.labels[i],
          layer: layerIdx,
          index: i,
        });
      }
    });
    return positions;
  }, []);

  // Generate connections (each node connects to next layer)
  const connections = useMemo(() => {
    const conns: Array<{
      start: [number, number, number];
      end: [number, number, number];
      intensity: number;
    }> = [];
    
    for (let i = 0; i < nodePositions.length; i++) {
      const node = nodePositions[i];
      if (node.layer === layers.length - 1) continue;
      
      // Connect to 2-3 random nodes in next layer
      const nextLayer = layers[node.layer + 1];
      const targetCount = 2 + Math.floor(Math.random() * 2);
      const nextLayerNodes = nodePositions.filter(n => n.layer === node.layer + 1);
      
      for (let j = 0; j < targetCount; j++) {
        const target = nextLayerNodes[Math.floor(Math.random() * nextLayerNodes.length)];
        conns.push({
          start: node.position,
          end: target.position,
          intensity: 0.3 + Math.random() * 0.4,
        });
      }
    }
    
    return conns;
  }, [nodePositions]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Rotate based on scroll
    groupRef.current.rotation.y = scrollProgress * Math.PI * 0.5;
  });

  return (
    <group ref={groupRef}>
      {/* Render nodes */}
      {nodePositions.map((node) => (
        <NeuralNode
          key={node.id}
          position={node.position}
          label={node.label}
          activation={hoveredNode === node.label ? 1 : 0.3}
          onHover={setHoveredNode}
          isHovered={hoveredNode === node.label}
        />
      ))}
      
      {/* Render connections */}
      {connections.map((conn, i) => (
        <NeuralConnection
          key={i}
          start={conn.start}
          end={conn.end}
          signalProgress={i * 0.1}
          intensity={conn.intensity}
        />
      ))}
      
      {/* Layer labels */}
      {layers.map((layer, i) => (
        <Text
          key={layer.name}
          position={[i * 2.5 - 2.5, 2.5, 0]}
          fontSize={0.15}
          color="#a1a1aa"
          anchorX="center"
          anchorY="middle"
        >
          {layer.name.toUpperCase()}
        </Text>
      ))}
    </group>
  );
}

export function AILabScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <group>
      <NeuralNetworkScene scrollProgress={scrollProgress} />
    </group>
  );
}
